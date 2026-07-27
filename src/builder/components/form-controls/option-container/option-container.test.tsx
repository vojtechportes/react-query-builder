import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { readFileSync } from 'fs';
import { join } from 'path';
import { OptionContainer } from './option-container';
import styles from './option-container.module.css';

const getOptionContainerCss = () =>
  readFileSync(join(__dirname, 'option-container.module.css'), 'utf8');

interface ICustomOptionContainerProps {
  children: React.ReactNode;
  className?: string;
  'data-test'?: string;
  onClick?: React.MouseEventHandler<HTMLLabelElement>;
}

const CustomOptionContainer = React.forwardRef<
  HTMLLabelElement,
  ICustomOptionContainerProps
>(({ children, className, 'data-test': dataTest, onClick }, ref) => (
  <label className={className} data-test={dataTest} onClick={onClick} ref={ref}>
    {children}
  </label>
));

CustomOptionContainer.displayName = 'CustomOptionContainer';

describe('#components/OptionContainer', () => {
  it('renders a div by default with children and incoming attributes', () => {
    const onClick = jest.fn();
    render(
      <OptionContainer
        aria-label="Filter options"
        className="incoming-class"
        data-test="OptionContainer"
        data-state="ready"
        onClick={onClick}
        style={{ marginTop: 4 }}
      >
        <span>First option</span>
      </OptionContainer>
    );
    const container = screen.getByLabelText('Filter options');

    fireEvent.click(container);

    expect(container.tagName).toBe('DIV');
    expect(container.classList.contains(styles.optionContainer)).toBe(true);
    expect(container.classList.contains('incoming-class')).toBe(true);
    expect(container.getAttribute('data-test')).toBe('OptionContainer');
    expect(container.getAttribute('data-state')).toBe('ready');
    expect(container.style.marginTop).toBe('4px');
    expect(screen.getByText('First option')).toBeTruthy();
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('forwards refs to the default div', () => {
    const ref = React.createRef<HTMLDivElement>();

    render(<OptionContainer ref={ref}>Ref target</OptionContainer>);

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current?.textContent).toBe('Ref target');
  });

  it('supports intrinsic as rendering without leaking the as attribute', () => {
    const onClick = jest.fn();
    const ref = React.createRef<HTMLButtonElement>();
    render(
      <OptionContainer
        as="button"
        ref={ref}
        type="button"
        className="button-options"
        onClick={onClick}
      >
        Button options
      </OptionContainer>
    );
    const button = screen.getByRole('button', { name: 'Button options' });

    fireEvent.click(button);

    expect(button.tagName).toBe('BUTTON');
    expect(button.getAttribute('as')).toBeNull();
    expect(button.classList.contains(styles.optionContainer)).toBe(true);
    expect(button.classList.contains('button-options')).toBe(true);
    expect(ref.current).toBe(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('supports custom component as rendering without leaking the as prop', () => {
    const onClick = jest.fn();
    const ref = React.createRef<HTMLLabelElement>();
    render(
      <OptionContainer
        as={CustomOptionContainer}
        ref={ref}
        className="custom-options"
        data-test="CustomOptionContainer"
        onClick={onClick}
      >
        Custom options
      </OptionContainer>
    );
    const customContainer = screen.getByText('Custom options');

    fireEvent.click(customContainer);

    expect(customContainer.tagName).toBe('LABEL');
    expect(customContainer.getAttribute('as')).toBeNull();
    expect(customContainer.classList.contains(styles.optionContainer)).toBe(
      true
    );
    expect(customContainer.classList.contains('custom-options')).toBe(true);
    expect(ref.current).toBe(customContainer);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders on the server without styled-components runtime output', () => {
    const markup = renderToString(
      <OptionContainer className="server-options" data-test="OptionContainer">
        Server option container
      </OptionContainer>
    );

    expect(markup).toContain('server-options');
    expect(markup).toContain('Server option container');
    expect(markup).not.toContain('data-styled');
  });

  it('exposes every CSS Module class used by the component', () => {
    expect(styles.optionContainer).toBe('optionContainer');
  });

  it('defines preserved grid layout rules', () => {
    const css = getOptionContainerCss();

    expect(css).toContain('display: grid');
    expect(css).toContain('grid-auto-columns: min-content');
    expect(css).toContain('grid-auto-flow: column');
    expect(css).toContain('gap: 0.5rem');
    expect(css).toContain('align-self: center');
  });
});
