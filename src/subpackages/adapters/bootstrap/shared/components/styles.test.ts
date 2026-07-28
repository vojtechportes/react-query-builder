import {
  bootstrapCardStyles,
  bootstrapControlStyles,
  bootstrapIconButtonContentStyles,
  bootstrapIconButtonStyles,
  joinClassNames,
} from './styles';

describe('#adapters/bootstrap/shared/components/styles', () => {
  it('joins valid classes and exposes adapter dimensions', () => {
    expect(joinClassNames('first', false, undefined, 'second')).toBe(
      'first second'
    );
    expect(bootstrapControlStyles.width).toContain('--query-builder-control');
    expect(bootstrapCardStyles.borderRadius).toBe('0.5rem');
    expect(bootstrapIconButtonStyles.height).toBeDefined();
    expect(bootstrapIconButtonContentStyles.width).toBe('1rem');
  });
});
