import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { Text } from './text';
import styles from './text.module.css';

describe('#components/Text', () => {
  it('renders its content in one span with incoming classes', () => {
    const { container } = render(
      <Text className="incoming-class">Readable value</Text>
    );
    const text = container.firstElementChild as HTMLElement;

    expect(container.children).toHaveLength(1);
    expect(text.tagName).toBe('SPAN');
    expect(text).toHaveClass(styles.text, 'incoming-class');
    expect(text).toHaveTextContent('Readable value');
    expect(text.getAttribute('style')).toBeNull();
  });

  it('renders on the server without styled-components runtime output', () => {
    const markup = renderToString(
      <Text className="server-text">Server value</Text>
    );

    expect(markup).toContain('Server value');
    expect(markup).toContain('server-text');
    expect(markup).toContain(styles.text);
    expect(markup).not.toContain('$theme');
    expect(markup).not.toContain('--query-builder-color-grey-800');
  });

  it('exposes the CSS Module class contract', () => {
    expect(styles.text).toBe('text');
  });
});
