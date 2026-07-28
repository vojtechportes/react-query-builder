import { muiControlDensitySx } from './mui-control-density-sx.constant';

describe('#adapters/mui/shared/constants/mui-control-density-sx', () => {
  it('defines the shared compact control density', () => {
    expect(muiControlDensitySx).toMatchObject({
      height: 32,
      fontSize: '14px',
    });
  });
});
