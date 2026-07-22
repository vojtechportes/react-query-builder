import type { IStrings } from '../types/strings';

export const strings: IStrings = {
  textMode: {
    toggleToBuilder: 'Zum Builder-Modus wechseln',
    toggleToText: 'Zum Textmodus wechseln',
    syntaxError: 'Syntaxfehler',
    locksUnsupported:
      'Gesperrte Regeln oder Gruppen werden bei dieser Konfiguration im Texteditor nicht unterstützt.',
    lockedRangesHover:
      'Dieses SQL-Fragment ist gesperrt und kann nicht bearbeitet werden.',
    sql: {
      possibleMissingQuote:
        'Möglicherweise fehlt vor dem Ende dieser Zeichenkette ein Anführungszeichen.',
      missingClosingQuote: 'Das schließende Anführungszeichen fehlt.',
      missingClosingIdentifierQuote:
        'Das schließende Anführungszeichen für den Bezeichner fehlt.',
      unexpectedTokenInExpression:
        'Unerwartetes Token "{token}" im SQL-Ausdruck.',
      missingClosingParenthesis: 'Die schließende Klammer fehlt.',
      missingOpeningParenthesis: 'Die öffnende Klammer fehlt.',
      missingComma: 'Das Komma fehlt.',
      missingSqlOperator: 'Der SQL-Operator fehlt.',
      missingFieldIdentifier: 'Der Feldbezeichner fehlt.',
      missingStringValue: 'Der Zeichenkettenwert fehlt.',
      missingNumericValue: 'Der numerische Wert fehlt.',
      missingToken: 'Das Token "{token}" fehlt.',
      missingAndKeyword: 'Das Schlüsselwort AND fehlt.',
      missingOrKeyword: 'Das Schlüsselwort OR fehlt.',
      missingNotKeyword: 'Das Schlüsselwort NOT fehlt.',
      missingInKeyword: 'Das Schlüsselwort IN fehlt.',
      missingLikeKeyword: 'Das Schlüsselwort LIKE fehlt.',
      missingIsKeyword: 'Das Schlüsselwort IS fehlt.',
      missingNullKeyword: 'Das Schlüsselwort NULL fehlt.',
      missingBetweenKeyword: 'Das Schlüsselwort BETWEEN fehlt.',
      missingKeyword: 'Das Schlüsselwort "{keyword}" fehlt.',
      expectedToken: 'Token "{token}" erwartet, aber "{value}" gefunden.',
      expectedKeyword:
        'Schlüsselwort "{keyword}" erwartet, aber "{value}" gefunden.',
      unexpectedTokenAfterNot: 'Unerwartetes Token "{value}" nach NOT.',
      sqlInListsSupportOnlyStringAndNumberValues:
        'SQL-IN-Listen unterstützen derzeit nur Zeichenketten- und Zahlenwerte.',
      sqlBetweenSupportsOnlyStringAndNumberValues:
        'SQL BETWEEN unterstützt derzeit nur Zeichenketten- und Zahlenwerte.',
      sqlArraysMustContainSameScalarType:
        'SQL-Arrays dürfen nur Werte desselben skalaren Typs enthalten.',
      expectedScalarValue:
        'Ein skalarer Wert wurde erwartet, aber "{value}" gefunden.',
      expectedFieldIdentifier:
        'Ein Feldbezeichner wurde erwartet, aber "{value}" gefunden.',
      unsupportedSqlOperator: 'Nicht unterstützter SQL-Operator "{operator}".',
      unknownSqlParseError: 'Unbekannter Fehler beim Parsen von SQL.',
    },
  },
  history: {
    undo: 'Rückgängig',
    redo: 'Wiederholen',
  },
  group: {
    not: 'Nicht',
    or: 'Oder',
    and: 'Und',
    addRule: 'Regel hinzufügen',
    addGroup: 'Gruppe hinzufügen',
    addGroupWithModifiers: 'Mit Modifikatoren',
    addGroupWithoutModifiers: 'Ohne Modifikatoren',
    delete: 'Löschen',
    clone: 'Gruppe duplizieren',
    lock: 'Gruppe sperren',
    lockDescendants: 'Gruppe und untergeordnete Elemente sperren',
    unlockDescendants: 'Gruppe und untergeordnete Elemente entsperren',
  },
  rule: {
    delete: 'Löschen',
    clone: 'Regel duplizieren',
    lock: 'Regel sperren',
    unlock: 'Regel entsperren',
  },
  form: {
    selectYourValue: 'Wert auswählen',
    compareToValue: 'Wert',
    compareToField: 'Feld',
    selectField: 'Feld auswählen',
  },
  operators: {
    LARGER: 'Größer als',
    SMALLER: 'Kleiner als',
    LARGER_EQUAL: 'Größer oder gleich',
    SMALLER_EQUAL: 'Kleiner oder gleich',
    EQUAL: 'Gleich',
    NOT_EQUAL: 'Ungleich',
    ALL_IN: 'Enthält alle Werte',
    ANY_IN: 'Enthält mindestens einen der Werte',
    IN: 'Ist enthalten in',
    NOT_IN: 'Ist nicht enthalten in',
    BETWEEN: 'Zwischen',
    NOT_BETWEEN: 'Nicht zwischen',
    IS_NULL: 'Ist null',
    IS_NOT_NULL: 'Ist nicht null',
    LIKE: 'Entspricht dem Muster',
    NOT_LIKE: 'Entspricht nicht dem Muster',
    CONTAINS: 'Enthält',
    NOT_CONTAINS: 'Enthält nicht',
    STARTS_WITH: 'Beginnt mit',
    ENDS_WITH: 'Endet mit',
  },
  validation: {
    operatorNotAllowed:
      'Operator "{operator}" ist für das Feld "{field}" nicht zulässig',
    valueNotAllowed: 'Dieser Operator darf keinen Wert haben',
    required: 'Dieser Wert ist erforderlich',
    minLength: 'Der Wert muss mindestens {min} Zeichen lang sein',
    maxLength: 'Der Wert darf höchstens {max} Zeichen lang sein',
    matches: 'Der Wert hat ein ungültiges Format',
    min: 'Der Wert muss größer oder gleich {min} sein',
    max: 'Der Wert muss kleiner oder gleich {max} sein',
    integer: 'Der Wert muss eine ganze Zahl sein',
    positive: 'Der Wert muss positiv sein',
    negative: 'Der Wert muss negativ sein',
    minDate: 'Das Datum liegt vor dem zulässigen Mindestdatum',
    maxDate: 'Das Datum liegt nach dem zulässigen Höchstdatum',
    boolean: 'Der Wert muss ein boolescher Wert sein',
    oneOf: 'Der Wert muss einer der zulässigen Optionen entsprechen',
    minItems: 'Wählen Sie mindestens {min} Werte aus',
    maxItems: 'Wählen Sie höchstens {max} Werte aus',
    custom: 'Der Wert ist ungültig',
    rangeOrder: 'Der Bereichsanfang muss kleiner als das Bereichsende sein',
    rangeOrderAllowEqual:
      'Der Bereichsanfang muss kleiner oder gleich dem Bereichsende sein',
    rangeCustom: 'Der Bereich ist ungültig',
    fieldNotFound: 'Feld "{field}" ist nicht definiert',
    negationNotAllowed: 'Negation ist in diesem Builder nicht zulässig',
    usageLimitExceeded:
      'Feld "{field}" darf in diesem Geltungsbereich höchstens {max}-mal vorkommen',
    invalidTree: 'Die Eingabedaten haben eine ungültige Baumstruktur',
    valueFieldRequired: 'Ein Vergleichsfeld ist erforderlich',
    valueFieldNotFound: 'Vergleichsfeld "{field}" wurde nicht gefunden',
    fieldComparisonNotAllowed:
      'Der Feldvergleich ist für das Feld "{field}" und den Operator "{operator}" nicht zulässig',
    fieldComparisonDisabled: 'Feldvergleiche sind nicht zulässig',
    fieldComparisonOperatorNotAllowed:
      'Operator "{operator}" unterstützt für das Feld "{field}" keinen Feldvergleich',
    fieldComparisonIncompatible:
      'Vergleichsfeld "{valueField}" ist für den Operator "{operator}" nicht mit dem Feld "{field}" kompatibel',
  },
};
