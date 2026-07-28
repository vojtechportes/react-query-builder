export { fireEvent, screen, waitFor, within } from '@testing-library/dom';
export { cleanupReact19Roots as cleanup } from './utils/cleanup-react-19-roots.util';
export { configureReact19TestingLibrary } from './utils/configure-react-19-testing-library.util';
export { renderWithReact19 as render } from './utils/render-with-react-19.util';

import { configureReact19TestingLibrary } from './utils/configure-react-19-testing-library.util';

configureReact19TestingLibrary();
