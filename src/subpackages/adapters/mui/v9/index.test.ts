import * as subject from './index';

describe('#adapters/mui/v9/index', () => {
  it('exposes the intended adapter exports', () => {
    expect(Object.keys(subject).sort()).toEqual(
      [
        'components',
        'createMuiComponents',
        'MuiAddButton',
        'MuiCloneButton',
        'MuiDropZone',
        'MuiEmptyGroupDropZone',
        'MuiGroup',
        'MuiGroupHeaderOption',
        'MuiHistoryControls',
        'MuiInput',
        'MuiLockToggle',
        'MuiOutlinedButton',
        'MuiPopover',
        'MuiPopoverItem',
        'MuiRemoveButton',
        'MuiRule',
        'MuiSelect',
        'MuiSelectMulti',
        'MuiSwitch',
        'MuiText',
        'MuiTextModeInput',
      ].sort()
    );
  });
});
