import { extractODataFilter } from './extract-odata-filter';

describe('extract-odata-filter', () => {
  it('extracts a filter from a query string', () => {
    expect(extractODataFilter("/users?$filter=name eq 'Alice'")).toBe(
      "name eq 'Alice'"
    );
  });

  it('keeps a bare expression intact', () => {
    expect(extractODataFilter(" name eq 'Alice' ")).toBe("name eq 'Alice'");
  });
});
