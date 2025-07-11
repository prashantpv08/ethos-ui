import { render } from '@testing-library/react';
import PrimaryButton from './PrimaryButton';

describe('Primary Button', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <PrimaryButton variant="contained"> test</PrimaryButton>
    );
    expect(baseElement).toBeTruthy();
  });
});
