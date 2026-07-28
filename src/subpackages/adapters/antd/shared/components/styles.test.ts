import {
  antdControlHeight,
  antdControlStyle,
  antdIconButtonStyle,
  antdTextButtonStyle,
} from './styles';

describe('#adapters/antd/shared/components/styles', () => {
  it('exposes consistent control dimensions', () => {
    expect(antdControlHeight).toBe(32);
    expect(antdControlStyle.minHeight).toBe('32px');
    expect(antdTextButtonStyle.minHeight).toBe('32px');
    expect(antdIconButtonStyle.width).toBe('32px');
  });
});
