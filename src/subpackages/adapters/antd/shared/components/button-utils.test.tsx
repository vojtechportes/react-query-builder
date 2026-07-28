import { resolveButtonContent } from './button-utils';

describe('#adapters/antd/shared/components/button-utils', () => {
  it('prefers children and falls back to the label', () => {
    const onClick = jest.fn();

    expect(
      resolveButtonContent({ children: 'Child', label: 'Label', onClick })
    ).toBe('Child');
    expect(resolveButtonContent({ label: 'Label', onClick })).toBe('Label');
  });
});
