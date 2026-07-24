export const createNotFoundDocument = (latestVersionUrl) => `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="robots" content="noindex" />
    <title>Page not found | React Query Builder</title>
  </head>
  <body>
    <main>
      <h1>Page not found</h1>
      <p>The requested page does not exist.</p>
      <p><a href="${latestVersionUrl}">Open the latest documentation</a>.</p>
    </main>
  </body>
</html>
`;
