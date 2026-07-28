import * as subject from './index';

describe('#adapters/fluent-ui/v8/index', () => {
  it('exposes the intended adapter exports', () => {
    expect(Object.keys(subject).sort()).toEqual(
      [
        'components',
        'createFluentUiComponents',
        'FluentUiAddButton',
        'FluentUiAlert',
        'FluentUiCloneButton',
        'FluentUiDropZone',
        'FluentUiEmptyGroupDropZone',
        'FluentUiGroup',
        'FluentUiGroupHeaderOption',
        'FluentUiHistoryControls',
        'FluentUiInput',
        'FluentUiLockToggle',
        'FluentUiOutlinedButton',
        'FluentUiPopover',
        'FluentUiPopoverItem',
        'FluentUiRemoveButton',
        'FluentUiRule',
        'FluentUiSelect',
        'FluentUiSelectMulti',
        'FluentUiSwitch',
        'FluentUiText',
        'FluentUiTextModeInput',
        'FluentUiTextModeToggleContent',
      ].sort()
    );
  });
});
