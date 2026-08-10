import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { Skeleton } from './skeleton';
import styles from './skeleton.module.css';
import textStyles from './components/text/text.module.css';
import rectangularStyles from './components/rectangular/rectangular.module.css';
import circularStyles from './components/circular/circular.module.css';

describe('#shared/components/Skeleton', () => {
  it('renders a text skeleton with its default rows and sizes', () => {
    const { container } = render(<Skeleton variant="text" />);
    const skeleton = container.firstElementChild as HTMLElement;

    expect(skeleton).toHaveClass(styles.skeleton, textStyles.text);
    expect(skeleton).not.toHaveAttribute('style');
    expect(skeleton.children).toHaveLength(3);
    expect(skeleton.children[0]).toHaveStyle({ width: '100%' });
    expect(skeleton.children[1]).toHaveStyle({ width: '100%' });
    expect(skeleton.children[2]).toHaveStyle({ width: '60%' });
  });

  it('forwards text rows, height, and className', () => {
    const { container } = render(
      <Skeleton
        variant="text"
        rows={2}
        height={12}
        className="custom-skeleton"
      />
    );
    const skeleton = container.firstElementChild as HTMLElement;

    expect(skeleton).toHaveClass(
      styles.skeleton,
      textStyles.text,
      'custom-skeleton'
    );
    expect(skeleton).toHaveStyle({ gap: '12px' });
    expect(skeleton.children).toHaveLength(2);
    expect(skeleton.children[0]).toHaveStyle({ height: '12px' });
    expect(skeleton.children[1]).toHaveStyle({ height: '12px', width: '60%' });
  });

  it('renders a rectangular skeleton with explicit dimensions', () => {
    const { container } = render(
      <Skeleton variant="rectangular" width="50%" height={80} />
    );
    const skeleton = container.firstElementChild as HTMLElement;

    expect(skeleton).toHaveClass(
      styles.skeleton,
      rectangularStyles.rectangular
    );
    expect(skeleton).toHaveStyle({ width: '50%', height: '80px' });
  });

  it('renders a circular skeleton with an explicit width', () => {
    const { container } = render(<Skeleton variant="circular" width={24} />);
    const skeleton = container.firstElementChild as HTMLElement;

    expect(skeleton).toHaveClass(styles.skeleton, circularStyles.circular);
    expect(skeleton).toHaveStyle({ width: '24px' });
  });
});
