import type { IStrings } from '@vojtechportes/react-query-builder';
import { strings as enUSStrings } from '@vojtechportes/react-query-builder/locale/en-US';
import { strings as frFRStrings } from '@vojtechportes/react-query-builder/locale/fr-FR';
import { strings as itITStrings } from '@vojtechportes/react-query-builder/locale/it-IT';
import { strings as deDEStrings } from '@vojtechportes/react-query-builder/locale/de-DE';
import { strings as esESStrings } from '@vojtechportes/react-query-builder/locale/es-ES';
import { strings as ptPTStrings } from '@vojtechportes/react-query-builder/locale/pt-PT';
import { strings as csCZStrings } from '@vojtechportes/react-query-builder/locale/cs-CZ';
import { strings as skSKStrings } from '@vojtechportes/react-query-builder/locale/sk-SK';
import { strings as zhCNStrings } from '@vojtechportes/react-query-builder/locale/zh-CN';
import { strings as zhTWStrings } from '@vojtechportes/react-query-builder/locale/zh-TW';
import type { LocaleId } from '../types/locale-id';

export const localeStrings = {
  'en-US': enUSStrings,
  'fr-FR': frFRStrings,
  'it-IT': itITStrings,
  'de-DE': deDEStrings,
  'es-ES': esESStrings,
  'pt-PT': ptPTStrings,
  'cs-CZ': csCZStrings,
  'sk-SK': skSKStrings,
  'zh-CN': zhCNStrings,
  'zh-TW': zhTWStrings,
} satisfies Record<LocaleId, IStrings>;
