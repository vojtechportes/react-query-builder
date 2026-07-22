export const localeOptions = [
  { id: 'en-US', name: 'English' },
  { id: 'fr-FR', name: 'Français' },
  { id: 'it-IT', name: 'Italiano' },
  { id: 'de-DE', name: 'Deutsch' },
  { id: 'es-ES', name: 'Español' },
  { id: 'pt-PT', name: 'Português' },
  { id: 'cs-CZ', name: 'Čeština' },
  { id: 'sk-SK', name: 'Slovenčina' },
  { id: 'zh-CN', name: '简体中文' },
  { id: 'zh-TW', name: '繁體中文' },
] as const;

export type LocaleId = (typeof localeOptions)[number]['id'];
