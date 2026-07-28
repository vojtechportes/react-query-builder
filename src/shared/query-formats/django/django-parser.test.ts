import { DjangoParser } from './django-parser';

describe('django-parser', () => {
  it('parses a representative equality expression', () => {
    const nodes = new DjangoParser("Q(name='Alice')").parse();

    expect(JSON.stringify(nodes)).toContain('name');
    expect(JSON.stringify(nodes)).toContain('EQUAL');
  });

  it('rejects an incomplete expression', () => {
    expect(() => new DjangoParser('name').parse()).toThrow();
  });
});
