export const extractODataFilter = (input: string): string => {
  const trimmed = input.trim();
  const marker = '$filter=';
  const markerIndex = trimmed.indexOf(marker);

  if (markerIndex === -1) {
    return trimmed;
  }

  return trimmed.slice(markerIndex + marker.length).trim();
};
