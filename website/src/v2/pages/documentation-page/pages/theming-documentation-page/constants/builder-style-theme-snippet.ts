export const builderStyleThemeSnippet = `import '@vojtechportes/react-query-builder/styles.css';
import {
  Builder,
  type IBuilderStyle,
} from '@vojtechportes/react-query-builder';

const builderStyle: IBuilderStyle = {
  '--query-builder-color-primary-default': '#3157c8',
  '--query-builder-root-padding': '1.25rem',
  '--query-builder-root-radius': '8px',
};

<Builder
  data={data}
  fields={fields}
  style={builderStyle}
  onChange={setData}
/>;`;
