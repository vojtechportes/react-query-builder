import { IBuilderFieldProps } from '../../types';
import { tryParseSql } from '../../../query-formats/sql/try-parse-sql';
import { IDenormalizedRuleNode } from '../../../utils/query-tree';
import {
  getRuleReadOnlyTargets,
  isRuleFullyReadOnly,
} from '../../../utils/resolve-rule-read-only.util';
import { formatSql } from '../../../query-formats/sql/format-sql';
import { IParsedSqlRuleNode } from '../../../query-formats/sql/types/parsed-sql-rule-node';

export interface ILocalProtectedRange {
  start: number;
  end: number;
}

export const createRuleReadOnlyProtectedRanges = (
  rule: IDenormalizedRuleNode,
  fields: IBuilderFieldProps[]
): { text: string; protectedRanges: ILocalProtectedRange[] } => {
  const text = formatSql([rule], { fields });

  if (!text) {
    return {
      text,
      protectedRanges: [],
    };
  }

  if (isRuleFullyReadOnly(rule.readOnly)) {
    return {
      text,
      protectedRanges: [
        {
          start: 0,
          end: text.length,
        },
      ],
    };
  }

  const targets = getRuleReadOnlyTargets(rule.readOnly);

  if (targets.length === 0) {
    return {
      text,
      protectedRanges: [],
    };
  }

  const parseResult = tryParseSql(text);
  const parsedRule = parseResult.parsedNodes?.[0];

  if (!parsedRule || 'kind' in parsedRule) {
    return {
      text,
      protectedRanges: [],
    };
  }

  const parsedSqlRule = parsedRule as IParsedSqlRuleNode;

  const protectedRanges: ILocalProtectedRange[] = [];

  if (targets.includes('field')) {
    protectedRanges.push({
      start: parsedSqlRule.source.field.start,
      end: parsedSqlRule.source.field.end,
    });
  }

  if (targets.includes('operator') && parsedSqlRule.source.operator) {
    protectedRanges.push({
      start: parsedSqlRule.source.operator.start,
      end: parsedSqlRule.source.operator.end,
    });
  }

  if (targets.includes('value')) {
    if (parsedSqlRule.source.value) {
      protectedRanges.push({
        start: parsedSqlRule.source.value.start,
        end: parsedSqlRule.source.value.end,
      });
    }

    if (parsedSqlRule.source.values?.length) {
      protectedRanges.push(
        ...parsedSqlRule.source.values.map((valueRange) => ({
          start: valueRange.start,
          end: valueRange.end,
        }))
      );
    }
  }

  return {
    text,
    protectedRanges,
  };
};
