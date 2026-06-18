Long-running tooling (tests, docker compose, migrations, etc.) must always be invoked with sensible timeouts or in non-interactive batch mode. Never leave a shell command waiting indefinitely—prefer explicit timeouts, scripted runs, or log polling after the command exits.

Prefer arrow functions over function statements. Make sure each file contains exactly one function, one react component or set of constants that are related.

If pattern is react component, function is tied to one or two interfaces or one or two styled components, they can be in one file. Once the file becomes too complex, prefer splitting types into ./types folder relative to the component or move styled components to ./components folder relative to the component.

Utility functions should be always suffixed with .util.(ts|tsx).