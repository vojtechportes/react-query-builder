import { menuPaperSx } from './styles';

describe('#adapters/mui/shared/components/styles', () => {
  it('keeps menu items in a compact vertical layout', () => {
    expect(menuPaperSx).toMatchObject({
      minWidth: 180,
      mt: 0.5,
    });
  });
});
