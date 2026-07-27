export const ensureV1CanonicalLink = (): HTMLLinkElement => {
  let element = document.head.querySelector<HTMLLinkElement>(
    'link[rel="canonical"]'
  );

  if (!element) {
    element = document.createElement('link');
    element.rel = 'canonical';
    document.head.appendChild(element);
  }

  return element;
};
