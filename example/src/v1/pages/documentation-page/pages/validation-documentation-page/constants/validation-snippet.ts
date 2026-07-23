export const validationSnippet = `const fields: IBuilderFieldProps[] = [
  {
    field: 'COMPANY_NAME',
    label: 'Company name',
    type: 'TEXT',
    operators: ['EQUAL', 'CONTAINS'],
    validation: {
      common: {
        required: true,
      },
      rules: [
        {
          operators: ['EQUAL', 'CONTAINS'],
          minLength: 2,
          maxLength: 50,
        },
      ],
    },
  },
  {
    field: 'ORDER_TOTAL',
    label: 'Order total',
    type: 'NUMBER',
    operators: ['EQUAL', 'BETWEEN'],
    validation: {
      common: {
        required: true,
      },
      rules: [
        {
          operators: ['EQUAL'],
          min: 0,
          max: 100000,
        },
        {
          operators: ['BETWEEN'],
          range: {
            common: {
              min: 0,
            },
            requireAscending: true,
            allowEqual: false,
          },
        },
      ],
    },
  },
];

<Builder
  fields={fields}
  data={data}
  showValidation
  onStateChange={state => {
    console.log(state.isValid);
    console.log(state.validation);
  }}
  onChange={setData}
/>;`;
