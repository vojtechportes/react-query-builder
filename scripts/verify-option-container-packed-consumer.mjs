import { execSync } from 'node:child_process';
import {
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { join } from 'node:path';
import { cwd } from 'node:process';

const rootDir = cwd();
const tempRoot = join(rootDir, '.tmp', 't043-option-container-packed-consumer');
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

  const declarationFiles = packResult.files
    .map(({ path }) => path)
    .filter((path) => /\.d\.(?:c|m)?ts$/.test(path));

  const styledTypeDeclaration = declarationFiles.find((path) => {
    const content = readFileSync(join(packDir, 'package', path), 'utf8');

    return /styled-components|StyledComponent/.test(content);
  });

  if (styledTypeDeclaration) {
    throw new Error(
      `Packed declaration leaks styled-components types: ${styledTypeDeclaration}`
    );
  }

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
    `import React from 'react';
import { OptionContainer } from '@vojtechportes/react-query-builder';

const divRef = React.createRef<HTMLDivElement>();
const buttonRef = React.createRef<HTMLButtonElement>();
const anchorRef = React.createRef<HTMLAnchorElement>();
const labelRef = React.createRef<HTMLLabelElement>();

interface ICustomOptionContainerProps {
  children?: React.ReactNode;
  className?: string;
  requiredCustomProp: string;
}

const CustomOptionContainer = React.forwardRef<
  HTMLLabelElement,
  ICustomOptionContainerProps
>((_props, _ref) => null);

const defaultUsage = (
  <OptionContainer ref={divRef} className="options" aria-label="Options" />
);

const buttonUsage = (
  <OptionContainer
    as="button"
    ref={buttonRef}
    type="button"
    onClick={event => {
      const currentTarget: HTMLButtonElement = event.currentTarget;
      currentTarget.focus();
    }}
  />
);

const anchorUsage = <OptionContainer as="a" ref={anchorRef} href="#filters" />;

const customUsage = (
  <OptionContainer
    as={CustomOptionContainer}
    ref={labelRef}
    requiredCustomProp="required"
  />
);

// @ts-expect-error href is not valid on the default div surface.
const invalidDefaultHref = <OptionContainer href="#filters" />;

// @ts-expect-error custom components must receive their required props.
const invalidCustomMissingProp = <OptionContainer as={CustomOptionContainer} />;

console.log(
  defaultUsage,
  buttonUsage,
  anchorUsage,
  customUsage,
  invalidDefaultHref,
  invalidCustomMissingProp
);
`
  );

  execSync(`npx tsc -p ${quote(join(consumerDir, 'tsconfig.json'))}`, {
    stdio: 'inherit',
  });
} finally {
  rmSync(tempRoot, { force: true, recursive: true });
}
