import type { IStrings } from '../types/strings';

export const strings: IStrings = {
  textMode: {
    toggleToBuilder: 'Mudar para o modo de construção',
    toggleToText: 'Mudar para o modo de texto',
    syntaxError: 'Erro de sintaxe',
    locksUnsupported:
      'As regras ou os grupos bloqueados não são suportados pelo editor de texto nesta configuração.',
    lockedRangesHover:
      'Este fragmento SQL está bloqueado e não pode ser editado.',
    sql: {
      possibleMissingQuote:
        'Pode faltar uma aspa antes deste ponto da cadeia de caracteres.',
      missingClosingQuote: 'Falta a aspa de fecho.',
      missingClosingIdentifierQuote: 'Falta a aspa de fecho do identificador.',
      unexpectedTokenInExpression:
        'Token «{token}» inesperado na expressão SQL.',
      missingClosingParenthesis: 'Falta o parêntese de fecho.',
      missingOpeningParenthesis: 'Falta o parêntese de abertura.',
      missingComma: 'Falta uma vírgula.',
      missingSqlOperator: 'Falta um operador SQL.',
      missingFieldIdentifier: 'Falta o identificador do campo.',
      missingStringValue: 'Falta um valor de texto.',
      missingNumericValue: 'Falta um valor numérico.',
      missingToken: 'Falta o token «{token}».',
      missingAndKeyword: 'Falta a palavra-chave AND.',
      missingOrKeyword: 'Falta a palavra-chave OR.',
      missingNotKeyword: 'Falta a palavra-chave NOT.',
      missingInKeyword: 'Falta a palavra-chave IN.',
      missingLikeKeyword: 'Falta a palavra-chave LIKE.',
      missingIsKeyword: 'Falta a palavra-chave IS.',
      missingNullKeyword: 'Falta a palavra-chave NULL.',
      missingBetweenKeyword: 'Falta a palavra-chave BETWEEN.',
      missingKeyword: 'Falta a palavra-chave «{keyword}».',
      expectedToken:
        'Era esperado o token «{token}», mas foi encontrado «{value}».',
      expectedKeyword:
        'Era esperada a palavra-chave «{keyword}», mas foi encontrada «{value}».',
      unexpectedTokenAfterNot: 'Token «{value}» inesperado após NOT.',
      sqlInListsSupportOnlyStringAndNumberValues:
        'Atualmente, as listas SQL IN só suportam valores de texto e numéricos.',
      sqlBetweenSupportsOnlyStringAndNumberValues:
        'Atualmente, o operador SQL BETWEEN só suporta valores de texto e numéricos.',
      sqlArraysMustContainSameScalarType:
        'Os arrays SQL têm de conter valores do mesmo tipo escalar.',
      expectedScalarValue:
        'Era esperado um valor escalar, mas foi encontrado «{value}».',
      expectedFieldIdentifier:
        'Era esperado um identificador de campo, mas foi encontrado «{value}».',
      unsupportedSqlOperator: 'O operador SQL «{operator}» não é suportado.',
      unknownSqlParseError: 'Erro desconhecido na análise de SQL.',
    },
  },
  history: {
    undo: 'Anular',
    redo: 'Refazer',
  },
  group: {
    not: 'Não',
    or: 'Ou',
    and: 'E',
    addRule: 'Adicionar regra',
    addGroup: 'Adicionar grupo',
    addGroupWithModifiers: 'Com modificadores',
    addGroupWithoutModifiers: 'Sem modificadores',
    delete: 'Eliminar',
    clone: 'Duplicar grupo',
    lock: 'Bloquear grupo',
    lockDescendants: 'Bloquear grupo e descendentes',
    unlockDescendants: 'Desbloquear grupo e descendentes',
  },
  rule: {
    delete: 'Eliminar',
    clone: 'Duplicar regra',
    lock: 'Bloquear regra',
    unlock: 'Desbloquear regra',
  },
  form: {
    selectYourValue: 'Selecione um valor',
    compareToValue: 'Valor',
    compareToField: 'Campo',
    selectField: 'Selecione um campo',
  },
  operators: {
    LARGER: 'Maior que',
    SMALLER: 'Menor que',
    LARGER_EQUAL: 'Maior ou igual a',
    SMALLER_EQUAL: 'Menor ou igual a',
    EQUAL: 'Igual a',
    NOT_EQUAL: 'Diferente de',
    ALL_IN: 'Todos pertencem a',
    ANY_IN: 'Pelo menos um pertence a',
    IN: 'Pertence a',
    NOT_IN: 'Não pertence a',
    BETWEEN: 'Entre',
    NOT_BETWEEN: 'Não está entre',
    IS_NULL: 'É nulo',
    IS_NOT_NULL: 'Não é nulo',
    LIKE: 'Corresponde a',
    NOT_LIKE: 'Não corresponde a',
    CONTAINS: 'Contém',
    NOT_CONTAINS: 'Não contém',
    STARTS_WITH: 'Começa por',
    ENDS_WITH: 'Termina em',
  },
  validation: {
    operatorNotAllowed:
      'O operador «{operator}» não é permitido para o campo «{field}»',
    valueNotAllowed: 'Este operador não pode ter um valor',
    required: 'Este valor é obrigatório',
    minLength: 'O valor tem de ter, pelo menos, {min} caracteres',
    maxLength: 'O valor pode ter, no máximo, {max} caracteres',
    matches: 'O valor tem um formato inválido',
    min: 'O valor tem de ser maior ou igual a {min}',
    max: 'O valor tem de ser menor ou igual a {max}',
    integer: 'O valor tem de ser um número inteiro',
    positive: 'O valor tem de ser positivo',
    negative: 'O valor tem de ser negativo',
    minDate: 'A data é anterior à data permitida',
    maxDate: 'A data é posterior à data permitida',
    boolean: 'O valor tem de ser booleano',
    oneOf: 'O valor tem de ser uma das opções permitidas',
    minItems: 'Selecione, pelo menos, {min} valores',
    maxItems: 'Selecione, no máximo, {max} valores',
    custom: 'O valor é inválido',
    rangeOrder: 'O início do intervalo tem de ser inferior ao fim',
    rangeOrderAllowEqual:
      'O início do intervalo tem de ser inferior ou igual ao fim',
    rangeCustom: 'O intervalo é inválido',
    fieldNotFound: 'O campo «{field}» não está definido',
    negationNotAllowed: 'A negação não é permitida neste construtor',
    usageLimitExceeded:
      'O campo «{field}» pode aparecer, no máximo, {max} vezes neste âmbito',
    invalidTree: 'A árvore de dados de entrada tem um formato inválido',
    valueFieldRequired: 'É necessário um campo de comparação',
    valueFieldNotFound: 'O campo de comparação «{field}» não foi encontrado',
    fieldComparisonNotAllowed:
      'A comparação entre campos não é permitida para o campo «{field}» e o operador «{operator}»',
    fieldComparisonDisabled: 'A comparação entre campos não é permitida',
    fieldComparisonOperatorNotAllowed:
      'O operador «{operator}» não suporta a comparação entre campos para o campo «{field}»',
    fieldComparisonIncompatible:
      'O campo de comparação «{valueField}» não é compatível com o campo «{field}» para o operador «{operator}»',
  },
};
