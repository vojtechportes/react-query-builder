export const createRouteRedirectDocument = (location: string): string => {
  const escapedLocation = location
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  const serializedLocation = JSON.stringify(location).replace(/</g, '\\u003c');

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="robots" content="noindex" />
    <meta http-equiv="refresh" content="0;url=${escapedLocation}" />
    <title>Redirecting</title>
    <script>
      window.location.replace(${serializedLocation} + window.location.search + window.location.hash);
    </script>
  </head>
  <body>
    <p>Redirecting to <a href="${escapedLocation}">${escapedLocation}</a>.</p>
  </body>
</html>
`;
};
