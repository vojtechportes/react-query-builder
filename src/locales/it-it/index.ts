import type { IStrings } from '../types/strings';

export const strings: IStrings = {
  textMode: {
    toggleToBuilder: 'Passa alla modalità di composizione',
    toggleToText: 'Passa alla modalità testuale',
    syntaxError: 'Errore di sintassi',
    locksUnsupported:
      'Le regole o i gruppi bloccati non sono supportati nell’editor di testo con questa configurazione.',
    lockedRangesHover:
      'Questo frammento SQL è bloccato e non può essere modificato.',
    sql: {
      possibleMissingQuote:
        'Potrebbe mancare una virgoletta prima di questo punto della stringa.',
      missingClosingQuote: 'Virgoletta di chiusura mancante.',
      missingClosingIdentifierQuote:
        'Virgoletta di chiusura dell’identificatore mancante.',
      unexpectedTokenInExpression:
        'Token imprevisto "{token}" nell’espressione SQL.',
      missingClosingParenthesis: 'Parentesi di chiusura mancante.',
      missingOpeningParenthesis: 'Parentesi di apertura mancante.',
      missingComma: 'Virgola mancante.',
      missingSqlOperator: 'Operatore SQL mancante.',
      missingFieldIdentifier: 'Identificatore del campo mancante.',
      missingStringValue: 'Valore di tipo stringa mancante.',
      missingNumericValue: 'Valore numerico mancante.',
      missingToken: 'Token "{token}" mancante.',
      missingAndKeyword: 'Parola chiave AND mancante.',
      missingOrKeyword: 'Parola chiave OR mancante.',
      missingNotKeyword: 'Parola chiave NOT mancante.',
      missingInKeyword: 'Parola chiave IN mancante.',
      missingLikeKeyword: 'Parola chiave LIKE mancante.',
      missingIsKeyword: 'Parola chiave IS mancante.',
      missingNullKeyword: 'Parola chiave NULL mancante.',
      missingBetweenKeyword: 'Parola chiave BETWEEN mancante.',
      missingKeyword: 'Parola chiave "{keyword}" mancante.',
      expectedToken:
        'Era previsto il token "{token}", ma è stato trovato "{value}".',
      expectedKeyword:
        'Era prevista la parola chiave "{keyword}", ma è stato trovato il token "{value}".',
      unexpectedTokenAfterNot: 'Token imprevisto "{value}" dopo NOT.',
      sqlInListsSupportOnlyStringAndNumberValues:
        'Le liste dell’operatore SQL IN supportano solo stringhe e numeri.',
      sqlBetweenSupportsOnlyStringAndNumberValues:
        'L’operatore SQL BETWEEN supporta solo stringhe e numeri.',
      sqlArraysMustContainSameScalarType:
        'Gli array SQL devono contenere valori dello stesso tipo scalare.',
      expectedScalarValue:
        'Era previsto un valore scalare, ma è stato trovato "{value}".',
      expectedFieldIdentifier:
        'Era previsto un identificatore di campo, ma è stato trovato "{value}".',
      unsupportedSqlOperator: 'Operatore SQL "{operator}" non supportato.',
      unknownSqlParseError: 'Errore sconosciuto di analisi SQL.',
    },
  },
  history: {
    undo: 'Annulla',
    redo: 'Ripristina',
  },
  group: {
    not: 'Non',
    or: 'O',
    and: 'E',
    addRule: 'Aggiungi regola',
    addGroup: 'Aggiungi gruppo',
    addGroupWithModifiers: 'Con modificatori',
    addGroupWithoutModifiers: 'Senza modificatori',
    delete: 'Elimina',
    clone: 'Duplica gruppo',
    lock: 'Blocca gruppo',
    lockDescendants: 'Blocca gruppo e discendenti',
    unlockDescendants: 'Sblocca gruppo e discendenti',
  },
  rule: {
    delete: 'Elimina',
    clone: 'Duplica regola',
    lock: 'Blocca regola',
    unlock: 'Sblocca regola',
  },
  form: {
    selectYourValue: 'Seleziona un valore',
    compareToValue: 'Valore',
    compareToField: 'Campo',
    selectField: 'Seleziona un campo',
  },
  operators: {
    LARGER: 'Maggiore di',
    SMALLER: 'Minore di',
    LARGER_EQUAL: 'Maggiore o uguale a',
    SMALLER_EQUAL: 'Minore o uguale a',
    EQUAL: 'Uguale a',
    NOT_EQUAL: 'Diverso da',
    ALL_IN: 'Contiene tutti',
    ANY_IN: 'Contiene almeno uno',
    IN: 'In',
    NOT_IN: 'Non in',
    BETWEEN: 'Compreso tra',
    NOT_BETWEEN: 'Non compreso tra',
    IS_NULL: 'È nullo',
    IS_NOT_NULL: 'Non è nullo',
    LIKE: 'Corrisponde a',
    NOT_LIKE: 'Non corrisponde a',
    CONTAINS: 'Contiene',
    NOT_CONTAINS: 'Non contiene',
    STARTS_WITH: 'Inizia con',
    ENDS_WITH: 'Termina con',
  },
  validation: {
    operatorNotAllowed:
      'L’operatore "{operator}" non è consentito per il campo "{field}"',
    valueNotAllowed: 'Questo operatore non deve avere un valore',
    required: 'Questo valore è obbligatorio',
    minLength: 'Il valore deve contenere almeno {min} caratteri',
    maxLength: 'Il valore deve contenere al massimo {max} caratteri',
    matches: 'Il formato del valore non è valido',
    min: 'Il valore deve essere maggiore o uguale a {min}',
    max: 'Il valore deve essere minore o uguale a {max}',
    integer: 'Il valore deve essere un numero intero',
    positive: 'Il valore deve essere positivo',
    negative: 'Il valore deve essere negativo',
    minDate: 'La data è precedente al limite consentito',
    maxDate: 'La data è successiva al limite consentito',
    boolean: 'Il valore deve essere booleano',
    oneOf: 'Il valore deve essere una delle opzioni consentite',
    minItems: 'Seleziona almeno {min} valori',
    maxItems: 'Seleziona al massimo {max} valori',
    custom: 'Il valore non è valido',
    rangeOrder:
      'Il valore iniziale dell’intervallo deve essere inferiore al valore finale',
    rangeOrderAllowEqual:
      'Il valore iniziale dell’intervallo deve essere inferiore o uguale al valore finale',
    rangeCustom: 'L’intervallo non è valido',
    fieldNotFound: 'Il campo "{field}" non è definito',
    negationNotAllowed:
      'La negazione non è consentita in questo generatore di query',
    usageLimitExceeded:
      'Il campo "{field}" può comparire al massimo {max} volte in questo ambito',
    invalidTree: 'L’albero dei dati di input ha un formato non valido',
    valueFieldRequired: 'È obbligatorio specificare un campo di confronto',
    valueFieldNotFound: 'Il campo di confronto "{field}" non è stato trovato',
    fieldComparisonNotAllowed:
      'Il confronto tra campi non è consentito per il campo "{field}" e l’operatore "{operator}"',
    fieldComparisonDisabled: 'Il confronto tra campi non è consentito',
    fieldComparisonOperatorNotAllowed:
      'L’operatore "{operator}" non supporta il confronto tra campi per il campo "{field}"',
    fieldComparisonIncompatible:
      'Il campo di confronto "{valueField}" non è compatibile con il campo "{field}" per l’operatore "{operator}"',
  },
};
