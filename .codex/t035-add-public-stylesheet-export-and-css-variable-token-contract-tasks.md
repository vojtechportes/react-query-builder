# T035 implementation checklist

- [x] Export and publish the explicit package stylesheet with narrow side effects.
- [x] Define the inherited public CSS-variable token contract.
- [x] Add typed Builder style, className, and stable root data hook.
- [x] Verify token precedence and Builder root behavior.
- [x] Verify packed export, client, SSR, and no-CSS consumers.
- [x] Run Prettier on every modified code file.
- [x] Run the repository-required code review agent and resolve findings.
- [x] Mark T035 done and record final verification.

## Scope decision

T035 establishes the stylesheet, token, and Builder root APIs. Broad component
migrations remain assigned to T037-T055. The existing 900px responsive breakpoint
stays compiled, and native Node ESM styled-components interop remains the accepted
T032/T034 limitation while supported Vite SSR is the verification gate.
