import type {
  IDenormalizedRuleNode,
  QueryGroupValue,
} from '../../utils/query-tree';
import type {
  DjangoTokenType,
  IDjangoToken,
  IParsedDjangoGroup,
  ParsedDjangoNode,
} from './django-token.types';
import { inferDjangoLookupOperator } from './shared';
import { tokenizeDjango } from './tokenize-django';

export class DjangoParser {
  private readonly tokens: IDjangoToken[];
  private index = 0;

  constructor(input: string) {
    this.tokens = tokenizeDjango(input);
  }

  public parse(): ParsedDjangoNode[] {
    if (this.peek().type === 'EOF') {
      return [];
    }

    const expression = this.parseOr();
    this.expect('EOF');
    return [expression];
  }

  private parseOr(): ParsedDjangoNode {
    let left = this.parseAnd();

    while (this.peek().type === 'PIPE') {
      this.consume();
      left = this.combine('OR', left, this.parseAnd());
    }

    return left;
  }

  private parseAnd(): ParsedDjangoNode {
    let left = this.parseNot();

    while (this.peek().type === 'AMP') {
      this.consume();
      left = this.combine('AND', left, this.parseNot());
    }

    return left;
  }

  private parseNot(): ParsedDjangoNode {
    if (this.peek().type !== 'TILDE') {
      return this.parsePrimary();
    }

    this.consume();
    const operand = this.parsePrimary();

    if (this.isRuleNode(operand)) {
      return this.negateRule(operand);
    }

    return {
      ...operand,
      isNegated: !operand.isNegated,
    };
  }

  private parsePrimary(): ParsedDjangoNode {
    if (this.peek().type === 'LPAREN') {
      this.consume();
      const expression = this.parseOr();
      this.expect('RPAREN');
      return expression;
    }

    return this.parseQCall();
  }

  private parseQCall(): ParsedDjangoNode {
    this.expectKeyword('Q');
    this.expect('LPAREN');
    const kwargs = this.parseKwargs();
    this.expect('RPAREN');

    if (kwargs.length === 0) {
      throw new Error('Django Q() cannot be empty.');
    }

    if (kwargs.length === 1) {
      return kwargs[0];
    }

    const collapsed = this.tryCollapseAndRules(kwargs);

    if (collapsed) {
      return collapsed;
    }

    return {
      kind: 'group',
      combinator: 'AND',
      isNegated: false,
      children: kwargs,
    };
  }

  private parseKwargs(): IDenormalizedRuleNode[] {
    const rules: IDenormalizedRuleNode[] = [];

    while (this.peek().type !== 'RPAREN') {
      const lookup = this.parseIdentifier();
      this.expect('EQUAL');
      const value = this.parseValue();
      rules.push(this.createRuleFromLookup(lookup, value));

      if (this.peek().type === 'COMMA') {
        this.consume();
      } else {
        break;
      }
    }

    return rules;
  }

  private createRuleFromLookup(
    lookup: string,
    value: string | number | boolean | null | string[] | number[]
  ): IDenormalizedRuleNode {
    const parts = lookup.split('__');
    const field = parts[0];
    const suffix = parts[1] ?? 'exact';

    if (suffix === 'isnull') {
      if (typeof value !== 'boolean') {
        throw new Error('Django __isnull lookup requires a boolean value.');
      }

      return {
        field,
        operator: inferDjangoLookupOperator(suffix, value),
      };
    }

    if (suffix === 'in') {
      if (!Array.isArray(value)) {
        throw new Error('Django __in lookup requires an array value.');
      }

      return {
        field,
        operator: inferDjangoLookupOperator(suffix, value),
        value,
      };
    }

    if (value === null) {
      return {
        field,
        operator: 'IS_NULL',
      };
    }

    return {
      field,
      operator: inferDjangoLookupOperator(suffix, value),
      value: value as Exclude<typeof value, null>,
    };
  }

  private parseValue(): string | number | boolean | null | string[] | number[] {
    const token = this.peek();

    if (token.type === 'LBRACKET') {
      return this.parseList();
    }

    this.consume();

    if (token.type === 'STRING') {
      return token.value;
    }

    if (token.type === 'NUMBER') {
      return Number(token.value);
    }

    if (token.type === 'KEYWORD' && token.value === 'True') {
      return true;
    }

    if (token.type === 'KEYWORD' && token.value === 'False') {
      return false;
    }

    if (token.type === 'KEYWORD' && token.value === 'None') {
      return null;
    }

    throw new Error(`Expected a Django scalar value but found "${token.value}".`);
  }

  private parseList(): string[] | number[] {
    this.expect('LBRACKET');
    const values: Array<string | number> = [];

    while (this.peek().type !== 'RBRACKET') {
      const value = this.parseValue();

      if (typeof value === 'boolean' || value === null || Array.isArray(value)) {
        throw new Error('Django lists currently support only string and number values.');
      }

      values.push(value);

      if (this.peek().type === 'COMMA') {
        this.consume();
      } else {
        break;
      }
    }

    this.expect('RBRACKET');

    if (values.every(value => typeof value === 'string')) {
      return values as string[];
    }

    if (values.every(value => typeof value === 'number')) {
      return values as number[];
    }

    throw new Error('Django lists must contain values of the same scalar type.');
  }

  private parseIdentifier(): string {
    const token = this.consume();

    if (token.type !== 'IDENTIFIER') {
      throw new Error(`Expected an identifier but found "${token.value}".`);
    }

    return token.value;
  }

  private negateRule(rule: IDenormalizedRuleNode): ParsedDjangoNode {
    switch (rule.operator) {
      case 'EQUAL':
        return { ...rule, operator: 'NOT_EQUAL' };
      case 'IN':
        return { ...rule, operator: 'NOT_IN' };
      case 'CONTAINS':
        return { ...rule, operator: 'NOT_CONTAINS' };
      case 'LIKE':
        return { ...rule, operator: 'NOT_LIKE' };
      case 'IS_NULL':
        return { ...rule, operator: 'IS_NOT_NULL' };
      case 'BETWEEN':
        return { ...rule, operator: 'NOT_BETWEEN' };
      default:
        return {
          kind: 'group',
          combinator: 'AND',
          isNegated: true,
          children: [rule],
        };
    }
  }

  private combine(
    combinator: QueryGroupValue,
    left: ParsedDjangoNode,
    right: ParsedDjangoNode
  ): ParsedDjangoNode {
    const collapsed = this.tryCollapse(combinator, left, right);

    if (collapsed) {
      return collapsed;
    }

    const children: ParsedDjangoNode[] = [];

    if (this.isParsedGroup(left) && !left.isNegated && left.combinator === combinator) {
      children.push(...left.children);
    } else {
      children.push(left);
    }

    if (this.isParsedGroup(right) && !right.isNegated && right.combinator === combinator) {
      children.push(...right.children);
    } else {
      children.push(right);
    }

    return {
      kind: 'group',
      combinator,
      isNegated: false,
      children,
    };
  }

  private tryCollapseAndRules(
    rules: IDenormalizedRuleNode[]
  ): IDenormalizedRuleNode | null {
    if (rules.length !== 2 || rules[0].field !== rules[1].field) {
      return null;
    }

    if (
      rules[0].operator === 'LARGER_EQUAL' &&
      rules[1].operator === 'SMALLER_EQUAL'
    ) {
      return {
        field: rules[0].field,
        operator: 'BETWEEN',
        value: [rules[0].value, rules[1].value] as string[] | number[],
      };
    }

    return null;
  }

  private tryCollapse(
    combinator: QueryGroupValue,
    left: ParsedDjangoNode,
    right: ParsedDjangoNode
  ): IDenormalizedRuleNode | null {
    if (!this.isRuleNode(left) || !this.isRuleNode(right) || left.field !== right.field) {
      return null;
    }

    if (
      combinator === 'OR' &&
      left.operator === 'SMALLER' &&
      right.operator === 'LARGER'
    ) {
      return {
        field: left.field,
        operator: 'NOT_BETWEEN',
        value: [left.value, right.value] as string[] | number[],
      };
    }

    if (
      left.operator === 'CONTAINS' &&
      right.operator === 'CONTAINS'
    ) {
      return {
        field: left.field,
        operator: combinator === 'AND' ? 'ALL_IN' : 'ANY_IN',
        value: [left.value, right.value] as string[] | number[],
      };
    }

    return null;
  }

  private isRuleNode(node: ParsedDjangoNode): node is IDenormalizedRuleNode {
    return !this.isParsedGroup(node);
  }

  private isParsedGroup(node: ParsedDjangoNode): node is IParsedDjangoGroup {
    return 'kind' in node && node.kind === 'group';
  }

  private expect(type: DjangoTokenType): IDjangoToken {
    const token = this.consume();

    if (token.type !== type) {
      throw new Error(`Expected token "${type}" but found "${token.value}".`);
    }

    return token;
  }

  private expectKeyword(value: string): void {
    const token = this.consume();

    if (token.type !== 'KEYWORD' || token.value !== value) {
      throw new Error(`Expected keyword "${value}" but found "${token.value}".`);
    }
  }

  private consume(): IDjangoToken {
    const token = this.tokens[this.index];
    this.index += 1;
    return token;
  }

  private peek(): IDjangoToken {
    return this.tokens[this.index];
  }
}
