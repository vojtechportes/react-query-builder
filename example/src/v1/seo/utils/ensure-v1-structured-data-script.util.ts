export const ensureV1StructuredDataScript = (): HTMLScriptElement => {
  let element = document.head.querySelector<HTMLScriptElement>(
    'script#structured-data-page'
  );

  if (!element) {
    element = document.createElement('script');
    element.id = 'structured-data-page';
    element.type = 'application/ld+json';
    document.head.appendChild(element);
  }

  return element;
};
