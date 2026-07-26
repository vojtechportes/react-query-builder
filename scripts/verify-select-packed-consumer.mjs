import { execSync } from 'node:child_process';
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { cwd } from 'node:process';

const rootDir = cwd();
const tempRoot = join(rootDir, '.tmp', 't045-select-packed-consumer');
const packDir = join(tempRoot, 'pack');
const consumerDir = join(tempRoot, 'consumer');
const quote = (value) => JSON.stringify(value);

if (existsSync(tempRoot)) {
  rmSync(tempRoot, { force: true, recursive: true });
}

mkdirSync(packDir, { recursive: true });
mkdirSync(consumerDir, { recursive: true });

try {
  const packOutput = execSync(
    `npm pack --json --pack-destination ${quote(packDir)}`,
    { encoding: 'utf8' }
  );
  const [packResult] = JSON.parse(packOutput);
  const tarball = join(packDir, packResult.filename);

  execSync(`tar -xf ${quote(tarball)} -C ${quote(packDir)}`, {
    stdio: 'inherit',
  });

  writeFileSync(
    join(consumerDir, 'tsconfig.json'),
    JSON.stringify(
      {
        compilerOptions: {
          baseUrl: '.',
          esModuleInterop: true,
          jsx: 'react',
          lib: ['dom', 'esnext'],
          module: 'esnext',
          moduleResolution: 'bundler',
          noEmit: true,
          paths: {
            '@vojtechportes/react-query-builder': ['../pack/package'],
          },
          skipLibCheck: false,
          strict: true,
          target: 'es2020',
        },
        include: ['index.tsx'],
      },
      null,
      2
    )
  );

  writeFileSync(
    join(consumerDir, 'index.tsx'),
    `import type {
  IBuilderComponentsProps,
  ISelectMultiProps,
  ISelectProps,
} from '@vojtechportes/react-query-builder';

const selectProps: ISelectProps = {
  values: [{ value: 'open', label: 'Open', disabled: true }],
  selectedValue: 'open',
  emptyValue: 'Choose status',
  onChange: value => console.log(value),
  className: 'select',
  disabled: false,
  id: 'status',
  name: 'status',
};

const selectMultiProps: ISelectMultiProps = {
  values: [{ value: 'retail', label: 'Retail' }],
  selectedValue: ['retail'],
  emptyValue: 'Choose segments',
  onChange: value => console.log(value),
  onDelete: value => console.log(value),
  className: 'select-multi',
  disabled: false,
  id: 'segments',
  name: 'segments',
};

const formComponents: IBuilderComponentsProps['form'] = {
  Select: props => (props === selectProps ? null : null),
  SelectMulti: props => (props === selectMultiProps ? null : null),
};

// @ts-expect-error selectedValue remains a string for Select.
const invalidSelect: ISelectProps = { ...selectProps, selectedValue: ['open'] };

// @ts-expect-error selectedValue remains a string array for SelectMulti.
const invalidSelectMulti: ISelectMultiProps = { ...selectMultiProps, selectedValue: 'retail' };

console.log(formComponents, invalidSelect, invalidSelectMulti);
`
  );

  execSync(`npx tsc -p ${quote(join(consumerDir, 'tsconfig.json'))}`, {
    stdio: 'inherit',
  });
} finally {
  rmSync(tempRoot, { force: true, recursive: true });
}
