import { configure } from 'enzyme';
import Adapter from '@cfaester/enzyme-adapter-react-18';

configure({ adapter: new Adapter() });

const originalConsoleError = console.error;

console.error = (...args: unknown[]) => {
  const [firstArg] = args;

  if (
    typeof firstArg === 'string' &&
    firstArg.includes('findDOMNode is deprecated')
  ) {
    return;
  }

  originalConsoleError(...args);
};
