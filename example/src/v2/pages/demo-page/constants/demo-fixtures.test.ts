import { colors } from '@vojtechportes/react-query-builder';
import { describe, expect, it } from 'vitest';
import { defaultTheme } from './default-theme';
import { demoFields } from './demo-fields';
import { initialQueryTree } from './initial-query-tree';
import { localeOptions } from './locale-options';

describe('v2 Demo fixtures', () => {
  it('preserves the field configuration and locales', () => {
    expect(demoFields).toHaveLength(16);
    expect(demoFields.map(({ field }) => field)).toEqual([
      'CUSTOMER_COUNTRY',
      'CUSTOMER_COUNTRY_CODE',
      'DELIVERY_COUNTRY_CODE',
      'CUSTOMER_SEGMENTS',
      'IS_IN_EU',
      'IS_VAT_PAYER',
      'CUSTOMER_CITY',
      'ORDER_TOTAL',
      'ORDER_APPROVAL_LIMIT',
      'ORDER_MANUAL_REVIEW_THRESHOLD',
      'ORDER_DISCOUNT_CAP',
      'ORDER_CREATED_AT',
      'COMPANY_NAME',
      'DELIVERY_WINDOW',
      'RISK_NOTE',
      'FIRST_NAME',
    ]);
    expect(localeOptions.map(({ id }) => id)).toEqual([
      'en-US',
      'fr-FR',
      'it-IT',
      'de-DE',
      'es-ES',
      'pt-PT',
      'cs-CZ',
      'sk-SK',
      'zh-CN',
      'zh-TW',
    ]);
  });

  it('preserves the initial query and default 1.33.1 colors', () => {
    expect(initialQueryTree).toHaveLength(1);
    expect(initialQueryTree[0]).toMatchObject({
      type: 'GROUP',
      value: 'AND',
      isNegated: false,
    });
    expect(
      'type' in initialQueryTree[0] && initialQueryTree[0].children
    ).toHaveLength(4);
    expect(defaultTheme.colors).toBe(colors);
  });
});
