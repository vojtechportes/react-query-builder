import { resolveGroupReadOnly } from './resolve-group-read-only.util';

describe('#utils/resolveGroupReadOnly', () => {
  it('Resolves boolean read-only values', () => {
    expect(resolveGroupReadOnly(true)).toEqual({
      enabled: true,
      inheritToChildren: false,
    });
    expect(resolveGroupReadOnly(false)).toEqual({
      enabled: false,
      inheritToChildren: false,
    });
  });

  it('Only inherits when the group is enabled', () => {
    expect(
      resolveGroupReadOnly({ enabled: true, inheritToChildren: true })
    ).toEqual({
      enabled: true,
      inheritToChildren: true,
    });
    expect(
      resolveGroupReadOnly({ enabled: false, inheritToChildren: true })
    ).toEqual({
      enabled: false,
      inheritToChildren: false,
    });
  });
});
