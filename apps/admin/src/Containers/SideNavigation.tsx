import { NavLink } from 'react-router-dom';
import { ROUTES } from '../helpers/contants';

export default function SideNavigation(): JSX.Element {
  return (
    <nav className="p-4">
      <ul>
        <li>
          <NavLink
            to={ROUTES.ORGANISATION}
            className={({ isActive }) =>
              `block rounded px-4 py-2 hover:bg-gray-100 ${
                isActive ? 'bg-gray-200 font-medium' : ''
              }`
            }
          >
            Organisation
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
