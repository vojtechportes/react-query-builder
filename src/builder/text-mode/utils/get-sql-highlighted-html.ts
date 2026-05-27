import Prism from 'prismjs';
import 'prismjs/components/prism-sql';

export const getSqlHighlightedHtml = (value: string): string =>
  Prism.highlight(value, Prism.languages.sql, 'sql');
