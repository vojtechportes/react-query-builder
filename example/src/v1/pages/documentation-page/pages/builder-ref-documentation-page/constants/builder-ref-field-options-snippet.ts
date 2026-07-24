export const builderRefFieldOptionsSnippet = `builderRef.current?.isFieldInUse('CITY');

builderRef.current?.getFieldOptionState('CITY');

builderRef.current?.setFieldOptionsStatus('CITY', 'loading');
builderRef.current?.setFieldOptions('CITY', [
  { value: 'PRG', label: 'Prague' },
  { value: 'BRN', label: 'Brno' },
]);

builderRef.current?.invalidateFieldOptions('CITY');
builderRef.current?.reloadFieldOptions('CITY');
builderRef.current?.clearFieldOptions('CITY');`;
