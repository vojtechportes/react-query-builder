/* @vitest-environment jsdom */

import * as React from 'react';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { Typography } from './typography';

afterEach(cleanup);

describe('Typography', () => {
  it('renders a dark body2 paragraph by default', () => {
    render(<Typography>Default copy</Typography>);

    const copy = screen.getByText('Default copy');

    expect(copy.tagName).toBe('P');
    expect(getComputedStyle(copy).fontSize).toBe('1rem');
    expect(getComputedStyle(copy).lineHeight).toBe('1.6');
    expect(getComputedStyle(copy).color).toBe('rgb(15, 23, 42)');
    expect(getComputedStyle(copy).marginTop).toBe('0px');
    expect(getComputedStyle(copy).marginBottom).toBe('0px');
  });

  it('keeps the semantic variant when the visual scale changes', () => {
    render(
      <Typography variant="h1" as="h5">
        Semantic title
      </Typography>
    );

    const title = screen.getByRole('heading', {
      level: 1,
      name: 'Semantic title',
    });

    expect(title.tagName).toBe('H1');
    expect(getComputedStyle(title).fontSize).toBe('1.25rem');
    expect(getComputedStyle(title).lineHeight).toBe('1.1');
  });

  it('lets component override the rendered element', () => {
    render(
      <Typography variant="h2" component="span">
        Visual heading
      </Typography>
    );

    const title = screen.getByText('Visual heading');

    expect(title.tagName).toBe('SPAN');
    expect(getComputedStyle(title).fontSize).toBe('2.5rem');
  });

  it.each([
    ['h1', '3rem'],
    ['h2', '2.5rem'],
    ['h3', '2rem'],
    ['h4', '1.5rem'],
    ['h5', '1.25rem'],
    ['h6', '1.1rem'],
    ['body1', '1.1rem'],
    ['body2', '1rem'],
  ] as const)('uses the %s visual scale', (variant, fontSize) => {
    render(
      <Typography variant="body2" as={variant}>
        {variant}
      </Typography>
    );

    expect(getComputedStyle(screen.getByText(variant)).fontSize).toBe(fontSize);
  });

  it.each([
    ['dark', 'rgb(15, 23, 42)'],
    ['muted', 'rgb(71, 85, 105)'],
    ['light', 'rgb(255, 255, 255)'],
    ['success', 'rgb(22, 101, 52)'],
    ['info', 'rgb(0, 41, 132)'],
    ['error', 'rgb(185, 28, 28)'],
    ['warning', 'rgb(154, 52, 18)'],
  ] as const)('uses the %s color', (color, expectedColor) => {
    render(<Typography color={color}>{color}</Typography>);

    expect(getComputedStyle(screen.getByText(color)).color).toBe(expectedColor);
  });

  it('supports custom font styles and margin precedence', () => {
    render(
      <Typography fontSize="1.35rem" fontWeight={600} my={2} mt="12px" mb={0}>
        Styled copy
      </Typography>
    );

    const copy = screen.getByText('Styled copy');

    expect(getComputedStyle(copy).fontSize).toBe('1.35rem');
    expect(getComputedStyle(copy).fontWeight).toBe('600');
    expect(getComputedStyle(copy).marginTop).toBe('12px');
    expect(getComputedStyle(copy).marginBottom).toBe('0px');
  });

  it('forwards standard HTML and accessibility attributes', () => {
    render(
      <Typography
        id="status-copy"
        role="status"
        aria-live="polite"
        data-kind="ready"
      >
        Ready
      </Typography>
    );

    const copy = screen.getByRole('status');

    expect(copy).toHaveAttribute('id', 'status-copy');
    expect(copy).toHaveAttribute('aria-live', 'polite');
    expect(copy).toHaveAttribute('data-kind', 'ready');
  });
});
