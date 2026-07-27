export const ensureV1MetaProperty = (property: string): HTMLMetaElement => {
  let element = document.head.querySelector<HTMLMetaElement>(
    `meta[property="${property}"]`
  );

  if (!element) {
    element = document.createElement('meta');
    element.setAttribute('property', property);
    document.head.appendChild(element);
  }

  return element;
};
