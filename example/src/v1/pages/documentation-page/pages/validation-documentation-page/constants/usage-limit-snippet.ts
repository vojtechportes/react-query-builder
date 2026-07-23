export const usageLimitSnippet = `const fields: IBuilderFieldProps[] = [
  {
    field: 'PRIMARY_EMAIL',
    label: 'Primary email',
    type: 'TEXT',
    operators: ['EQUAL', 'CONTAINS'],
    usageLimit: {
      max: 1,
      scope: 'global',
    },
  },
  {
    field: 'BILLING_CONTACT',
    label: 'Billing contact',
    type: 'TEXT',
    operators: ['EQUAL'],
    usageLimit: {
      key: 'contact-field',
      max: 1,
      scope: 'parent',
    },
  },
  {
    field: 'SHIPPING_CONTACT',
    label: 'Shipping contact',
    type: 'TEXT',
    operators: ['EQUAL'],
    usageLimit: {
      key: 'contact-field',
      max: 1,
      scope: 'parent',
    },
  },
];

<Builder
  fields={fields}
  data={data}
  showValidation
  onChange={setData}
/>;`;
