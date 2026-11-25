import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { TextDecoder, TextEncoder } from 'node:util';

Object.assign(globalThis, { TextDecoder, TextEncoder });

if (typeof window !== 'undefined' && !window.matchMedia) {
  window.matchMedia = (media) => ({
    media,
    matches: false,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: () => true,
  });
}

afterEach(() => {
  cleanup();
});
