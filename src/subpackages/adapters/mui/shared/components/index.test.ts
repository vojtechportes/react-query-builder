import * as subject from './index';

describe('#adapters/mui/shared/components/index', () => {
  it('exposes the intended adapter exports', () => {
    expect(Object.keys(subject).sort()).toEqual(
      [
        'createMuiComponentSet',
        'MuiAddButton',
        'MuiAlertComponent',
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
        'MuiTextModeToggleContent',
      ].sort()
    );
  });
});
