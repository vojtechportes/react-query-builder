import * as subject from './index';

describe('#adapters/bootstrap/v5/index', () => {
  it('exposes the intended adapter exports', () => {
    expect(Object.keys(subject).sort()).toEqual(
      [
        'BootstrapAddButton',
        'BootstrapAlert',
        'BootstrapCloneButton',
        'BootstrapDropZone',
        'BootstrapEmptyGroupDropZone',
        'BootstrapGroup',
        'BootstrapGroupHeaderOption',
        'BootstrapHistoryControls',
        'BootstrapInput',
        'BootstrapLockToggle',
        'BootstrapOutlinedButton',
        'BootstrapPopover',
        'BootstrapPopoverItem',
        'BootstrapRemoveButton',
        'BootstrapRule',
        'BootstrapSelect',
        'BootstrapSelectMulti',
        'BootstrapSwitch',
        'BootstrapText',
        'BootstrapTextModeInput',
        'BootstrapTextModeToggleContent',
        'components',
        'createBootstrapComponents',
      ].sort()
    );
  });
});
