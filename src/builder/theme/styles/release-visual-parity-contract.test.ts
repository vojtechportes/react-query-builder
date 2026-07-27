import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { colors } from './colors';

const readCss = (relativePath: string): string =>
  readFileSync(join(__dirname, '..', '..', '..', relativePath), 'utf8');

const toRgb = (hex: string): [number, number, number] => {
  const value = Number.parseInt(hex.slice(1), 16);

  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
};

const getRelativeLuminance = (hex: string): number => {
  const channels = toRgb(hex).map((channel) => {
    const value = channel / 255;

    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });

  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
};

const getContrastRatio = (foreground: string, background: string): number => {
  const foregroundLuminance = getRelativeLuminance(foreground);
  const backgroundLuminance = getRelativeLuminance(background);
  const lighter = Math.max(foregroundLuminance, backgroundLuminance);
  const darker = Math.min(foregroundLuminance, backgroundLuminance);

  return (lighter + 0.05) / (darker + 0.05);
};

const transitionModules = [
  'builder/components/clone-button/clone-button.module.css',
  'builder/drag-and-drop/components/drop-zone/drop-zone.module.css',
  'builder/drag-and-drop/components/empty-group-drop-zone/empty-group-drop-zone.module.css',
  'fluentui/shared/components/fluent-ui-group-header-option/fluent-ui-group-header-option.module.css',
  'builder/components/form-controls/switch/switch.module.css',
  'builder/components/lock-toggle/lock-toggle.module.css',
  'builder/components/rule-controls/select-multi/components/option/option.module.css',
];

describe('T059 visual and accessibility parity contract', () => {
  it('keeps desktop and responsive root, group, rule, and control layouts', () => {
    const builder = readCss(
      'builder/components/styled-builder/styled-builder.module.css'
    );
    const group = readCss(
      'builder/components/group/components/group-container/group-container.module.css'
    );
    const rule = readCss('builder/components/rule/rule.module.css');
    const rootControls = readCss(
      'builder/components/root-controls/root-controls.module.css'
    );

    expect(builder).toContain('.builder');
    expect(builder).toContain('--query-builder-root-padding');
    expect(group).toContain('grid-template-columns: 1fr');
    expect(group).toContain('@media (max-width: 900px)');
    expect(rule).toContain('grid-template-columns:');
    expect(rule).toContain('@media (max-width: 900px)');
    expect(rootControls).toContain('grid-auto-flow: column');
  });

  it('keeps DnD, validation, clone, lock, text-mode, and Monaco state hooks', () => {
    const dropZone = readCss(
      'builder/drag-and-drop/components/drop-zone/drop-zone.module.css'
    );
    const emptyDropZone = readCss(
      'builder/drag-and-drop/components/empty-group-drop-zone/empty-group-drop-zone.module.css'
    );
    const rule = readCss('builder/components/rule/rule.module.css');
    const cloneButton = readCss(
      'builder/components/clone-button/clone-button.module.css'
    );
    const lockToggle = readCss(
      'builder/components/lock-toggle/lock-toggle.module.css'
    );
    const textEditor = readCss(
      'builder/text-mode/components/text-mode-editor/text-mode-editor.module.css'
    );
    const monaco = readCss(
      'monaco/components/monaco-text-mode-editor/monaco-text-mode-editor.module.css'
    );

    expect(dropZone).toMatch(/\.anchor\.dragging\.active/);
    expect(dropZone).toContain('.transitionDisabled');
    expect(emptyDropZone).toMatch(/\.placeholder\.active\.dragging/);
    expect(rule).toContain('.validationIssues');
    expect(rule).toContain('.readOnly');
    expect(cloneButton).toContain('.disabled');
    expect(lockToggle).toContain('.unlocked');
    expect(lockToggle).toContain('.self');
    expect(lockToggle).toContain('.all');
    expect(textEditor).toContain('.diagnosticOverlay');
    expect(textEditor).toContain('.missingTokenMarker');
    expect(monaco).toContain('.rqb-monaco-text-mode-diagnostic');
    expect(monaco).toContain('.rqb-monaco-text-mode-protected');
  });

  it('keeps adapter-owned structural and state modules', () => {
    const adapterModules = [
      'antd/shared/components/antd-text-mode-toggle-content/antd-text-mode-toggle-content.module.css',
      'fluentui/shared/components/fluent-ui-group/fluent-ui-group.module.css',
      'mantine/shared/components/mantine-text-mode-toggle-content/mantine-text-mode-toggle-content.module.css',
      'mui/shared/components/mui-text-mode-toggle-content/mui-text-mode-toggle-content.module.css',
      'radix/shared/components/radix-group/radix-group.module.css',
    ];

    for (const adapterModule of adapterModules) {
      expect(readCss(adapterModule)).toContain('@layer react-query-builder');
    }
  });

  it('keeps visible keyboard focus and minimum control hit targets', () => {
    const button = readCss('builder/components/button/button.module.css');
    const cloneButton = readCss(
      'builder/components/clone-button/clone-button.module.css'
    );
    const lockToggle = readCss(
      'builder/components/lock-toggle/lock-toggle.module.css'
    );
    const popoverItem = readCss(
      'builder/components/popover-item/popover-item.module.css'
    );
    const switchCss = readCss(
      'builder/components/form-controls/switch/switch.module.css'
    );

    expect(button).toContain('.button:focus-visible');
    expect(cloneButton).toContain('.cloneButton:focus-visible');
    expect(lockToggle).toContain('.lockToggle:focus-visible');
    expect(popoverItem).toContain('.item:focus-visible');
    expect(switchCss).toContain('.switch:focus-visible');
    expect(button).toContain('min-height: 2rem');
    expect(cloneButton).toContain('min-width: 2.5rem');
    expect(lockToggle).toContain('min-width: 2.5rem');
    expect(switchCss).toContain('height: 1.6rem');
  });

  it.each(transitionModules)(
    'disables motion for reduced-motion users in %s',
    (modulePath) => {
      const css = readCss(modulePath);

      expect(css).toContain('@media (prefers-reduced-motion: reduce)');
      expect(css).toMatch(
        /@media \(prefers-reduced-motion: reduce\)[\s\S]*transition: none/
      );
    }
  );

  it('keeps core text and validation contrast at WCAG AA ratios', () => {
    expect(
      getContrastRatio(colors.primary.default, colors.white)
    ).toBeGreaterThanOrEqual(4.5);
    expect(
      getContrastRatio(colors.grey[700], colors.white)
    ).toBeGreaterThanOrEqual(4.5);
    expect(
      getContrastRatio(colors.grey[800], colors.white)
    ).toBeGreaterThanOrEqual(4.5);
    expect(
      getContrastRatio(colors.error.primary, colors.white)
    ).toBeGreaterThanOrEqual(4.5);
  });
});
