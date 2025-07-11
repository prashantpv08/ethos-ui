import { render } from '@testing-library/react';

import { Link } from './link';
import { MemoryRouter } from 'react-router-dom';

describe('Link', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <MemoryRouter>
        <Link to="/" children="test" />
      </MemoryRouter>
    );
    expect(baseElement).toBeTruthy();
  });
});
