export interface ISelectMultiSummary {
  text: string;
  hiddenCount: number;
}

const ELLIPSIS = '...';

const trimLabel = (label: string, maxLength: number) => {
  if (label.length <= maxLength) {
    return label;
  }

  if (maxLength <= ELLIPSIS.length) {
    return label.slice(0, maxLength);
  }

  return `${label.slice(0, maxLength - ELLIPSIS.length)}${ELLIPSIS}`;
};

export const createSummary = (
  labels: string[],
  maxLength = 36
): ISelectMultiSummary => {
  if (labels.length === 0) {
    return {
      text: '',
      hiddenCount: 0,
    };
  }

  let summary = '';
  let visibleCount = 0;

  labels.forEach((label, index) => {
    if (visibleCount !== index) {
      return;
    }

    const prefix = summary ? ', ' : '';
    const nextValue = `${summary}${prefix}${label}`;

    if (nextValue.length <= maxLength) {
      summary = nextValue;
      visibleCount += 1;
      return;
    }

    if (!summary) {
      summary = trimLabel(label, maxLength);
      visibleCount += 1;
      return;
    }
  });

  return {
    text: summary,
    hiddenCount: Math.max(labels.length - visibleCount, 0),
  };
};
