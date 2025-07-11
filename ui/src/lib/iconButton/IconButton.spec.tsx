import { render } from '@testing-library/react';
import { Iconbutton } from './IconButton';

describe('Icon Button', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Iconbutton name="test">test</Iconbutton>);
    expect(baseElement).toBeTruthy();
  });
});
