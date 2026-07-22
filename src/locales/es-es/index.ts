import type { IStrings } from '../types/strings';

export const strings: IStrings = {
  textMode: {
    toggleToBuilder: 'Cambiar al modo de construcción',
    toggleToText: 'Cambiar al modo texto',
    syntaxError: 'Error de sintaxis',
    locksUnsupported:
      'Las reglas o los grupos bloqueados no son compatibles con el editor de texto en esta configuración.',
    lockedRangesHover:
      'Este fragmento SQL está bloqueado y no se puede editar.',
    sql: {
      possibleMissingQuote:
        'Es posible que falte una comilla antes del final de esta cadena.',
      missingClosingQuote: 'Falta la comilla de cierre.',
      missingClosingIdentifierQuote:
        'Falta la comilla de cierre del identificador.',
      unexpectedTokenInExpression:
        'Token «{token}» inesperado en la expresión SQL.',
      missingClosingParenthesis: 'Falta el paréntesis de cierre.',
      missingOpeningParenthesis: 'Falta el paréntesis de apertura.',
      missingComma: 'Falta una coma.',
      missingSqlOperator: 'Falta un operador SQL.',
      missingFieldIdentifier: 'Falta el identificador del campo.',
      missingStringValue: 'Falta un valor de texto.',
      missingNumericValue: 'Falta un valor numérico.',
      missingToken: 'Falta el token «{token}».',
      missingAndKeyword: 'Falta la palabra clave AND.',
      missingOrKeyword: 'Falta la palabra clave OR.',
      missingNotKeyword: 'Falta la palabra clave NOT.',
      missingInKeyword: 'Falta la palabra clave IN.',
      missingLikeKeyword: 'Falta la palabra clave LIKE.',
      missingIsKeyword: 'Falta la palabra clave IS.',
      missingNullKeyword: 'Falta la palabra clave NULL.',
      missingBetweenKeyword: 'Falta la palabra clave BETWEEN.',
      missingKeyword: 'Falta la palabra clave «{keyword}».',
      expectedToken:
        'Se esperaba el token «{token}», pero se encontró «{value}».',
      expectedKeyword:
        'Se esperaba la palabra clave «{keyword}», pero se encontró «{value}».',
      unexpectedTokenAfterNot: 'Token «{value}» inesperado después de NOT.',
      sqlInListsSupportOnlyStringAndNumberValues:
        'Actualmente, las listas con IN de SQL solo admiten valores de texto y numéricos.',
      sqlBetweenSupportsOnlyStringAndNumberValues:
        'Actualmente, SQL BETWEEN solo admite valores de texto y numéricos.',
      sqlArraysMustContainSameScalarType:
        'Los arrays de SQL deben contener valores del mismo tipo escalar.',
      expectedScalarValue:
        'Se esperaba un valor escalar, pero se encontró «{value}».',
      expectedFieldIdentifier:
        'Se esperaba un identificador de campo, pero se encontró «{value}».',
      unsupportedSqlOperator: 'No se admite el operador SQL «{operator}».',
      unknownSqlParseError: 'Error desconocido al analizar SQL.',
    },
  },
  history: {
    undo: 'Deshacer',
    redo: 'Rehacer',
  },
  group: {
    not: 'No',
    or: 'O',
    and: 'Y',
    addRule: 'Añadir regla',
    addGroup: 'Añadir grupo',
    addGroupWithModifiers: 'Con modificadores',
    addGroupWithoutModifiers: 'Sin modificadores',
    delete: 'Eliminar',
    clone: 'Clonar grupo',
    lock: 'Bloquear grupo',
    lockDescendants: 'Bloquear grupo y descendientes',
    unlockDescendants: 'Desbloquear grupo y descendientes',
  },
  rule: {
    delete: 'Eliminar',
    clone: 'Clonar regla',
    lock: 'Bloquear regla',
    unlock: 'Desbloquear regla',
  },
  form: {
    selectYourValue: 'Selecciona un valor',
    compareToValue: 'Valor',
    compareToField: 'Campo',
    selectField: 'Selecciona un campo',
  },
  operators: {
    LARGER: 'Mayor que',
    SMALLER: 'Menor que',
    LARGER_EQUAL: 'Mayor o igual que',
    SMALLER_EQUAL: 'Menor o igual que',
    EQUAL: 'Igual a',
    NOT_EQUAL: 'Distinto de',
    ALL_IN: 'Contiene todos',
    ANY_IN: 'Contiene alguno',
    IN: 'En',
    NOT_IN: 'No está en',
    BETWEEN: 'Entre',
    NOT_BETWEEN: 'No está entre',
    IS_NULL: 'Es nulo',
    IS_NOT_NULL: 'No es nulo',
    LIKE: 'Coincide con',
    NOT_LIKE: 'No coincide con',
    CONTAINS: 'Contiene',
    NOT_CONTAINS: 'No contiene',
    STARTS_WITH: 'Empieza por',
    ENDS_WITH: 'Termina en',
  },
  validation: {
    operatorNotAllowed:
      'El operador «{operator}» no está permitido para el campo «{field}»',
    valueNotAllowed: 'Este operador no debe tener ningún valor',
    required: 'Este valor es obligatorio',
    minLength: 'El valor debe tener al menos {min} caracteres',
    maxLength: 'El valor debe tener como máximo {max} caracteres',
    matches: 'El valor tiene un formato no válido',
    min: 'El valor debe ser mayor o igual que {min}',
    max: 'El valor debe ser menor o igual que {max}',
    integer: 'El valor debe ser un número entero',
    positive: 'El valor debe ser positivo',
    negative: 'El valor debe ser negativo',
    minDate: 'La fecha es anterior a la permitida',
    maxDate: 'La fecha es posterior a la permitida',
    boolean: 'El valor debe ser booleano',
    oneOf: 'El valor debe ser una de las opciones permitidas',
    minItems: 'Selecciona al menos {min} valores',
    maxItems: 'Selecciona como máximo {max} valores',
    custom: 'El valor no es válido',
    rangeOrder: 'El inicio del intervalo debe ser menor que el final',
    rangeOrderAllowEqual:
      'El inicio del intervalo debe ser menor o igual que el final',
    rangeCustom: 'El intervalo no es válido',
    fieldNotFound: 'El campo «{field}» no está definido',
    negationNotAllowed: 'La negación no está permitida en este constructor',
    usageLimitExceeded:
      'El campo «{field}» puede aparecer como máximo {max} veces en este ámbito',
    invalidTree: 'El árbol de datos de entrada tiene un formato no válido',
    valueFieldRequired: 'Se requiere un campo de comparación',
    valueFieldNotFound: 'No se encontró el campo de comparación «{field}»',
    fieldComparisonNotAllowed:
      'La comparación entre campos no está permitida para el campo «{field}» y el operador «{operator}»',
    fieldComparisonDisabled: 'La comparación entre campos no está permitida',
    fieldComparisonOperatorNotAllowed:
      'El operador «{operator}» no admite la comparación entre campos para el campo «{field}»',
    fieldComparisonIncompatible:
      'El campo de comparación «{valueField}» no es compatible con el campo «{field}» para el operador «{operator}»',
  },
};
