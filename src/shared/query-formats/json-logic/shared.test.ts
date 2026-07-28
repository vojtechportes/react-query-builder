import { createVarRule, isJsonLogicObject, isVarRule } from './shared';

describe('shared', () => {
  it('creates and recognizes variable rules', () => {
    const rule = createVarRule('name');

    expect(rule).toEqual({ var: 'name' });
    expect(isVarRule(rule)).toBe(true);
    expect(isJsonLogicObject(rule)).toBe(true);
  });
});
