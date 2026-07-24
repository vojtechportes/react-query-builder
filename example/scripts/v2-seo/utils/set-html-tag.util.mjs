export const setHtmlTag = (html, matcher, replacement) => {
  if (matcher.test(html)) {
    return html.replace(matcher, replacement);
  }

  return html.replace('</head>', `    ${replacement}\n  </head>`);
};
