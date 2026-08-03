export const createFtpHtaccess = (manifests, siteUrl) => {
  const canonicalBaseUrl = new URL(siteUrl).toString().replace(/\/$/, '');
  const rules = [
    'Options -Indexes',
    'DirectorySlash Off',
    '',
    'RewriteEngine On',
    '',
  ];

  rules.push(`RewriteRule ^$ ${canonicalBaseUrl}/v2 [R=308,L,NE]`, '');

  for (const redirect of manifests.v2.redirects) {
    const source = redirect.from.replace(/^\//, '');

    rules.push(
      `RewriteRule ^${source}/?$ ${canonicalBaseUrl}/v2${redirect.to} [R=308,L,NE]`
    );
  }

  rules.push('');

  for (const target of ['v1', 'v2']) {
    for (const redirect of manifests[target].redirects) {
      const source = redirect.from.replace(/^\//, '');

      rules.push(
        `RewriteRule ^${target}/${source}/?$ ${canonicalBaseUrl}/${target}${redirect.to} [R=308,L,NE]`
      );
    }
  }

  rules.push(
    '',
    'RewriteCond %{REQUEST_URI} !^/(v1|v2)(/|$)',
    'RewriteCond %{DOCUMENT_ROOT}/v2/$1/index.html -f',
    `RewriteRule ^(.+?)/?$ ${canonicalBaseUrl}/v2/$1 [R=308,L,NE]`,
    '',
    'RewriteCond %{REQUEST_URI} !^/$',
    'RewriteCond %{REQUEST_URI} /$',
    `RewriteRule ^(.+)/$ ${canonicalBaseUrl}/$1 [R=308,L,NE]`,
    '',
    'RewriteCond %{REQUEST_FILENAME} -d',
    'RewriteCond %{REQUEST_FILENAME}/index.html -f',
    'RewriteRule ^(.+)$ $1/index.html [L]',
    ''
  );

  return rules.join('\n');
};
