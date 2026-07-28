import * as subject from './index';

describe('#adapters/mantine/v8/index', () => {
  it('exposes the intended adapter exports', () => {
    expect(Object.keys(subject).sort()).toEqual(
      [
        'components',
        'createMantineComponents',
        'MantineAddButton',
        'MantineAlertComponent',
        'MantineCloneButton',
        'MantineDropZone',
        'MantineEmptyGroupDropZone',
        'MantineGroup',
        'MantineGroupHeaderOption',
        'MantineHistoryControls',
        'MantineInput',
        'MantineLockToggle',
        'MantineOutlinedButton',
        'MantinePopover',
        'MantinePopoverItem',
        'MantineRemoveButton',
        'MantineRule',
        'MantineSelect',
        'MantineSelectMulti',
        'MantineSwitch',
        'MantineText',
        'MantineTextModeInput',
      ].sort()
    );
  });
});
