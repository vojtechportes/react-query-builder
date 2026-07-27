import React from 'react';
import { OptionContainer, OptionContainerProps } from './option-container';

const divRef = React.createRef<HTMLDivElement>();
const buttonRef = React.createRef<HTMLButtonElement>();
const anchorRef = React.createRef<HTMLAnchorElement>();
const labelRef = React.createRef<HTMLLabelElement>();

interface ICustomOptionContainerProps {
  children?: React.ReactNode;
  className?: string;
  'data-test'?: string;
  onClick?: React.MouseEventHandler<HTMLLabelElement>;
  requiredCustomProp: string;
}

const CustomOptionContainer = React.forwardRef<
  HTMLLabelElement,
  ICustomOptionContainerProps
>((_props, _ref) => null);

const defaultProps: OptionContainerProps = {
  className: 'options',
  'aria-label': 'Options',
  onClick: (event) => {
    const currentTarget: HTMLDivElement = event.currentTarget;

    expect(currentTarget.tagName).toBe('DIV');
  },
};

const buttonProps: OptionContainerProps<'button'> = {
  as: 'button',
  type: 'button',
  onClick: (event) => {
    const currentTarget: HTMLButtonElement = event.currentTarget;

    expect(currentTarget.tagName).toBe('BUTTON');
  },
};

const anchorProps: OptionContainerProps<'a'> = {
  as: 'a',
  href: '#filters',
};

const customProps: OptionContainerProps<typeof CustomOptionContainer> = {
  as: CustomOptionContainer,
  requiredCustomProp: 'required',
};

const typeAssertions = [
  <OptionContainer key="div" ref={divRef} {...defaultProps} />,
  <OptionContainer key="button" ref={buttonRef} {...buttonProps} />,
  <OptionContainer key="anchor" ref={anchorRef} {...anchorProps} />,
  <OptionContainer key="custom" ref={labelRef} {...customProps} />,
];

// @ts-expect-error href is not a valid attribute for the default div surface.
const invalidDefaultHref = <OptionContainer href="#filters" />;

// @ts-expect-error button refs are rejected when rendering the default div.
const invalidDefaultRef = <OptionContainer ref={buttonRef} />;

// @ts-expect-error custom components must receive their required props.
const invalidCustomMissingProp = <OptionContainer as={CustomOptionContainer} />;

describe('#components/OptionContainer types', () => {
  it('keeps TypeScript assertions reachable at runtime', () => {
    expect(typeAssertions).toHaveLength(4);
    expect(invalidDefaultHref).toBeTruthy();
    expect(invalidDefaultRef).toBeTruthy();
    expect(invalidCustomMissingProp).toBeTruthy();
  });
});
