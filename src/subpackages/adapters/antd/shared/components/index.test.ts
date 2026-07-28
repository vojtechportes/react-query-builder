import * as subject from './index';

describe('#adapters/antd/shared/components/index', () => {
  it('exposes the intended adapter exports', () => {
    expect(Object.keys(subject).sort()).toEqual(
      [
        'AntdAddButton',
        'AntdAlert',
        'AntdCloneButton',
        'AntdDropZone',
        'AntdEmptyGroupDropZone',
        'AntdGroup',
        'AntdGroupHeaderOption',
        'AntdHistoryControls',
        'AntdInput',
        'AntdLockToggle',
        'AntdOutlinedButton',
        'AntdPopover',
        'AntdPopoverItem',
        'AntdRemoveButton',
        'AntdRule',
        'AntdSelect',
        'AntdSelectMulti',
        'AntdSwitch',
        'AntdText',
        'AntdTextModeInput',
        'AntdTextModeToggleContent',
        'createAntdComponentSet',
      ].sort()
    );
  });
});
