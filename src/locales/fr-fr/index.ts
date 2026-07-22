import type { IStrings } from '../types/strings';

export const strings: IStrings = {
  textMode: {
    toggleToBuilder: 'Passer en mode visuel',
    toggleToText: 'Passer en mode texte',
    syntaxError: 'Erreur de syntaxe',
    locksUnsupported:
      "Les règles et groupes verrouillés ne sont pas pris en charge par l'éditeur de texte dans cette configuration.",
    lockedRangesHover:
      'Ce fragment SQL est verrouillé et ne peut pas être modifié.',
    sql: {
      possibleMissingQuote:
        'Guillemet peut-être manquant avant la fin de cette chaîne.',
      missingClosingQuote: 'Guillemet fermant manquant.',
      missingClosingIdentifierQuote:
        "Guillemet fermant manquant pour l'identifiant.",
      unexpectedTokenInExpression:
        "Jeton inattendu « {token} » dans l'expression SQL.",
      missingClosingParenthesis: 'Parenthèse fermante manquante.',
      missingOpeningParenthesis: 'Parenthèse ouvrante manquante.',
      missingComma: 'Virgule manquante.',
      missingSqlOperator: 'Opérateur SQL manquant.',
      missingFieldIdentifier: 'Identifiant de champ manquant.',
      missingStringValue: 'Valeur de chaîne manquante.',
      missingNumericValue: 'Valeur numérique manquante.',
      missingToken: 'Jeton « {token} » manquant.',
      missingAndKeyword: 'Mot-clé AND manquant.',
      missingOrKeyword: 'Mot-clé OR manquant.',
      missingNotKeyword: 'Mot-clé NOT manquant.',
      missingInKeyword: 'Mot-clé IN manquant.',
      missingLikeKeyword: 'Mot-clé LIKE manquant.',
      missingIsKeyword: 'Mot-clé IS manquant.',
      missingNullKeyword: 'Mot-clé NULL manquant.',
      missingBetweenKeyword: 'Mot-clé BETWEEN manquant.',
      missingKeyword: 'Mot-clé « {keyword} » manquant.',
      expectedToken: 'Jeton « {token} » attendu, mais « {value} » trouvé.',
      expectedKeyword:
        'Mot-clé « {keyword} » attendu, mais « {value} » trouvé.',
      unexpectedTokenAfterNot: 'Jeton inattendu « {value} » après NOT.',
      sqlInListsSupportOnlyStringAndNumberValues:
        "Les listes de l'opérateur SQL IN ne prennent actuellement en charge que les chaînes et les nombres.",
      sqlBetweenSupportsOnlyStringAndNumberValues:
        "L'opérateur SQL BETWEEN ne prend actuellement en charge que les chaînes et les nombres.",
      sqlArraysMustContainSameScalarType:
        'Les tableaux SQL doivent contenir des valeurs du même type scalaire.',
      expectedScalarValue:
        'Valeur scalaire attendue, mais « {value} » trouvée.',
      expectedFieldIdentifier:
        'Identifiant de champ attendu, mais « {value} » trouvé.',
      unsupportedSqlOperator:
        'Opérateur SQL « {operator} » non pris en charge.',
      unknownSqlParseError: "Erreur inconnue d'analyse SQL.",
    },
  },
  history: {
    undo: 'Annuler',
    redo: 'Rétablir',
  },
  group: {
    not: 'Non',
    or: 'Ou',
    and: 'Et',
    addRule: 'Ajouter une règle',
    addGroup: 'Ajouter un groupe',
    addGroupWithModifiers: 'Avec des modificateurs',
    addGroupWithoutModifiers: 'Sans modificateurs',
    delete: 'Supprimer',
    clone: 'Dupliquer le groupe',
    lock: 'Verrouiller le groupe',
    lockDescendants: 'Verrouiller le groupe et ses descendants',
    unlockDescendants: 'Déverrouiller le groupe et ses descendants',
  },
  rule: {
    delete: 'Supprimer',
    clone: 'Dupliquer la règle',
    lock: 'Verrouiller la règle',
    unlock: 'Déverrouiller la règle',
  },
  form: {
    selectYourValue: 'Sélectionnez une valeur',
    compareToValue: 'Valeur',
    compareToField: 'Champ',
    selectField: 'Sélectionnez un champ',
  },
  operators: {
    LARGER: 'Supérieur à',
    SMALLER: 'Inférieur à',
    LARGER_EQUAL: 'Supérieur ou égal à',
    SMALLER_EQUAL: 'Inférieur ou égal à',
    EQUAL: 'Égal à',
    NOT_EQUAL: 'Différent de',
    ALL_IN: 'Tous inclus dans',
    ANY_IN: 'Au moins un inclus dans',
    IN: 'Appartient à',
    NOT_IN: "N'appartient pas à",
    BETWEEN: 'Compris entre',
    NOT_BETWEEN: 'Non compris entre',
    IS_NULL: 'Est nul',
    IS_NOT_NULL: "N'est pas nul",
    LIKE: 'Correspond à',
    NOT_LIKE: 'Ne correspond pas à',
    CONTAINS: 'Contient',
    NOT_CONTAINS: 'Ne contient pas',
    STARTS_WITH: 'Commence par',
    ENDS_WITH: 'Se termine par',
  },
  validation: {
    operatorNotAllowed:
      "L'opérateur « {operator} » n'est pas autorisé pour le champ « {field} »",
    valueNotAllowed: 'Cet opérateur ne doit pas être associé à une valeur',
    required: 'Cette valeur est obligatoire',
    minLength: 'La valeur doit comporter au moins {min} caractères',
    maxLength: 'La valeur doit comporter au maximum {max} caractères',
    matches: "Le format de la valeur n'est pas valide",
    min: 'La valeur doit être supérieure ou égale à {min}',
    max: 'La valeur doit être inférieure ou égale à {max}',
    integer: 'La valeur doit être un entier',
    positive: 'La valeur doit être positive',
    negative: 'La valeur doit être négative',
    minDate: 'La date est antérieure à la date minimale autorisée',
    maxDate: 'La date est postérieure à la date maximale autorisée',
    boolean: 'La valeur doit être booléenne',
    oneOf: 'La valeur doit faire partie des options autorisées',
    minItems: 'Sélectionnez au moins {min} valeurs',
    maxItems: 'Sélectionnez au maximum {max} valeurs',
    custom: "La valeur n'est pas valide",
    rangeOrder: "Le début de l'intervalle doit être inférieur à sa fin",
    rangeOrderAllowEqual:
      "Le début de l'intervalle doit être inférieur ou égal à sa fin",
    rangeCustom: "L'intervalle n'est pas valide",
    fieldNotFound: "Le champ « {field} » n'est pas défini",
    negationNotAllowed:
      "La négation n'est pas autorisée dans ce générateur de requêtes",
    usageLimitExceeded:
      'Le champ « {field} » peut apparaître au maximum {max} fois dans cette portée',
    invalidTree:
      "Le format de l'arborescence des données d'entrée n'est pas valide",
    valueFieldRequired: 'Un champ de comparaison est obligatoire',
    valueFieldNotFound: 'Le champ de comparaison « {field} » est introuvable',
    fieldComparisonNotAllowed:
      "La comparaison entre champs n'est pas autorisée pour le champ « {field} » et l'opérateur « {operator} »",
    fieldComparisonDisabled: "La comparaison entre champs n'est pas autorisée",
    fieldComparisonOperatorNotAllowed:
      "L'opérateur « {operator} » ne prend pas en charge la comparaison entre champs pour le champ « {field} »",
    fieldComparisonIncompatible:
      "Le champ de comparaison « {valueField} » n'est pas compatible avec le champ « {field} » pour l'opérateur « {operator} »",
  },
};
