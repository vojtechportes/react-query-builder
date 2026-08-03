/* @vitest-environment jsdom */

import * as React from 'react';
import '@testing-library/jest-dom/vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Button } from './button';

afterEach(cleanup);

describe('Button', () => {
  it('renders a primary large filled button by default', () => {
    render(<Button>Save</Button>);

    const button = screen.getByRole('button', { name: 'Save' });

    expect(button).toHaveAttribute('type', 'button');
    expect(getComputedStyle(button).backgroundColor).toBe('rgb(63, 81, 181)');
    expect(getComputedStyle(button).lineHeight).toBe('1');
  });

  it('preserves an explicit native submit type', () => {
    render(<Button type="submit">Submit</Button>);

    expect(screen.getByRole('button', { name: 'Submit' })).toHaveAttribute(
      'type',
      'submit'
    );
  });

  it('renders an internal link and invokes its click handler', () => {
    const onClick = vi.fn();

    render(
      <MemoryRouter>
        <Button component="a" to="/documentation" onClick={onClick}>
          Documentation
        </Button>
      </MemoryRouter>
    );

    const link = screen.getByRole('link', { name: 'Documentation' });

    expect(link).toHaveAttribute('href', '/documentation');
    fireEvent.click(link);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('uses native disabled button behavior', () => {
    const onClick = vi.fn();

    render(
      <Button disabled onClick={onClick}>
        Save
      </Button>
    );

    const button = screen.getByRole('button', { name: 'Save' });

    expect(button).toBeDisabled();
    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('prevents disabled links from navigating or invoking click handlers', () => {
    const onClick = vi.fn();

    render(
      <MemoryRouter initialEntries={['/']}>
        <Button component="a" to="/documentation" disabled onClick={onClick}>
          Documentation
        </Button>
      </MemoryRouter>
    );

    const link = screen.getByRole('link', { name: 'Documentation' });

    expect(link).not.toHaveAttribute('href');
    expect(link).toHaveAttribute('aria-disabled', 'true');
    expect(link).toHaveAttribute('tabindex', '-1');
    fireEvent.click(link);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('renders outlined colors with transparent backgrounds', () => {
    render(
      <>
        <Button variant="outlined">Primary</Button>
        <Button color="white" variant="outlined">
          White
        </Button>
      </>
    );

    expect(
      getComputedStyle(screen.getByRole('button', { name: 'Primary' }))
        .backgroundColor
    ).toBe('transparent');
    expect(
      getComputedStyle(screen.getByRole('button', { name: 'White' }))
        .backgroundColor
    ).toBe('transparent');
  });
});
