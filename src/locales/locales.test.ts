import { strings as rootStrings } from '../index';
import { strings as csCZStrings } from './cs-cz';
import { strings as deDEStrings } from './de-de';
import { strings as enUSStrings } from './en-us';
import { strings as esESStrings } from './es-es';
import { strings as frFRStrings } from './fr-fr';
import { strings as itITStrings } from './it-it';
import { strings as ptPTStrings } from './pt-pt';
import { strings as skSKStrings } from './sk-sk';
import { flattenStringLeaves } from './test-utils/flatten-string-leaves.util';
import { getPlaceholderMultiset } from './test-utils/get-placeholder-multiset.util';
import { strings as zhCNStrings } from './zh-cn';
import { strings as zhTWStrings } from './zh-tw';

const localeStrings = {
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
};

describe('first-party locale strings', () => {
  const englishLeaves = flattenStringLeaves(enUSStrings);
  const englishPaths = [...englishLeaves.keys()].sort();

  it('uses the canonical en-US strings for the package-root strings export', () => {
    expect(rootStrings).toBe(enUSStrings);
  });

  it.each(Object.entries(localeStrings))(
    '%s has the complete translation shape and valid messages',
    (_locale, strings) => {
      const leaves = flattenStringLeaves(strings);

      expect([...leaves.keys()].sort()).toEqual(englishPaths);

      for (const path of englishPaths) {
        const englishValue = englishLeaves.get(path);
        const localizedValue = leaves.get(path);

        expect(localizedValue?.trim()).toBeTruthy();
        expect(getPlaceholderMultiset(localizedValue ?? '')).toEqual(
          getPlaceholderMultiset(englishValue ?? '')
        );
        expect((localizedValue ?? '').replace(/\{[^{}]+\}/g, '')).not.toMatch(
          /[{}]/
        );
      }
    }
  );
});
