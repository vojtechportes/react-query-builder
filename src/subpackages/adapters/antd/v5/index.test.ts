import * as subject from './index';

describe('#adapters/antd/v5/index', () => {
  it('exposes the intended adapter exports', () => {
    expect(Object.keys(subject).sort()).toEqual(
      [
        'AntdAddButton',
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
        'components',
        'createAntdComponents',
      ].sort()
    );
  });
});
