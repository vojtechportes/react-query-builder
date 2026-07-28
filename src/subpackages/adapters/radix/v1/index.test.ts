import * as subject from './index';

describe('#adapters/radix/v1/index', () => {
  it('exposes the intended adapter exports', () => {
    expect(Object.keys(subject).sort()).toEqual(
      [
        'components',
        'createRadixComponents',
        'RadixAddButton',
        'RadixAlert',
        'RadixCloneButton',
        'RadixDropZone',
        'RadixEmptyGroupDropZone',
        'RadixGroup',
        'RadixGroupHeaderOption',
        'RadixHistoryControls',
        'RadixInput',
        'RadixLockToggle',
        'RadixOutlinedButton',
        'RadixPopover',
        'RadixPopoverItem',
        'RadixRemoveButton',
        'RadixRule',
        'RadixSelect',
        'RadixSelectMulti',
        'RadixSwitch',
        'RadixText',
        'RadixTextModeInput',
        'RadixTextModeToggleContent',
      ].sort()
    );
  });
});
