"""Activate an uploaded FTPS deployment with a rollback-safe directory swap."""

from __future__ import annotations

import os
import posixpath
import ssl
from ftplib import FTP_TLS, error_perm


LIVE_DIR = "/www"
STAGED_DIR = "/www-new"
BACKUP_DIR = "/www-old"


def required_environment_variable(name: str) -> str:
    value = os.environ.get(name)
    if not value:
        raise RuntimeError(f"Required environment variable {name} is not set")
    return value


def directory_exists(ftp: FTP_TLS, path: str) -> bool:
    current_directory = ftp.pwd()
    try:
        ftp.cwd(path)
        return True
    except error_perm:
        return False
    finally:
        ftp.cwd(current_directory)


def directory_entries(ftp: FTP_TLS, path: str) -> list[tuple[str, str | None]]:
    """Return child paths and their reported types, with an NLST fallback."""
    try:
        return [
            (posixpath.join(path, name), facts.get("type"))
            for name, facts in ftp.mlsd(path)
            if name not in {".", ".."} and facts.get("type") not in {"cdir", "pdir"}
        ]
    except error_perm:
        entries = []
        for name in ftp.nlst(path):
            if posixpath.basename(name.rstrip("/")) in {".", ".."}:
                continue
            child_path = name if name.startswith("/") else posixpath.join(path, name)
            entries.append((child_path, None))
        return entries


def remove_directory_tree(ftp: FTP_TLS, path: str) -> None:
    for child_path, entry_type in directory_entries(ftp, path):
        is_directory = entry_type == "dir"
        if entry_type is None:
            is_directory = directory_exists(ftp, child_path)

        if is_directory:
            remove_directory_tree(ftp, child_path)
        else:
            ftp.delete(child_path)

    ftp.rmd(path)


def activate_deployment(ftp: FTP_TLS) -> None:
    if not directory_exists(ftp, STAGED_DIR):
        raise RuntimeError(f"Staged deployment {STAGED_DIR} does not exist")

    live_exists = directory_exists(ftp, LIVE_DIR)
    backup_exists = directory_exists(ftp, BACKUP_DIR)

    # Recover first if an earlier interrupted swap left only the backup live copy.
    if not live_exists and backup_exists:
        print(f"Recovering {BACKUP_DIR} to {LIVE_DIR} before deployment")
        ftp.rename(BACKUP_DIR, LIVE_DIR)
        live_exists = True
        backup_exists = False

    if backup_exists:
        print(f"Removing previous backup {BACKUP_DIR}")
        remove_directory_tree(ftp, BACKUP_DIR)

    if not live_exists:
        print(f"No live directory found; activating {STAGED_DIR}")
        ftp.rename(STAGED_DIR, LIVE_DIR)
        return

    print(f"Moving {LIVE_DIR} to {BACKUP_DIR}")
    ftp.rename(LIVE_DIR, BACKUP_DIR)

    try:
        print(f"Moving {STAGED_DIR} to {LIVE_DIR}")
        ftp.rename(STAGED_DIR, LIVE_DIR)
    except Exception:
        print(f"Activation failed; rolling {BACKUP_DIR} back to {LIVE_DIR}")
        ftp.rename(BACKUP_DIR, LIVE_DIR)
        raise


def main() -> None:
    hostname = required_environment_variable("FTP_HOSTNAME")
    username = required_environment_variable("FTP_USERNAME")
    password = required_environment_variable("FTP_PASSWORD")
    port = int(os.environ.get("FTP_PORT", "21"))

    context = ssl.create_default_context()
    with FTP_TLS(context=context) as ftp:
        ftp.connect(hostname, port, timeout=60)
        ftp.login(username, password)
        ftp.prot_p()
        activate_deployment(ftp)

    print(f"Deployment activated; previous version is available at {BACKUP_DIR}")


if __name__ == "__main__":
    main()
