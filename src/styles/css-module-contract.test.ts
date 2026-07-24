import clsx from 'clsx';
import styles from './css-module-contract.module.css';

describe('CSS Module contract', () => {
  it('resolves private class keys in Jest and composes incoming classes', () => {
    expect(clsx(styles.infrastructure, 'incoming-class')).toBe(
      'infrastructure incoming-class'
    );
  });
});
