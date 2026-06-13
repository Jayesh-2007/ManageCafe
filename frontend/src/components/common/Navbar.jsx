import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.jsx';

const navItems = [
  { path: '/login', label: 'Login', access: 'public' },
  { path: '/signup', label: 'Sign Up', access: 'public' },
  { path: '/pos', label: 'POS', access: 'authenticated' },
  { path: '/orders', label: 'Orders', access: 'authenticated' },
  { path: '/products', label: 'Products', access: 'admin' },
  { path: '/categories', label: 'Categories', access: 'admin' },
  { path: '/payment-methods', label: 'Payment Methods', access: 'admin' },
  { path: '/promotions', label: 'Promotions', access: 'admin' },
  { path: '/users', label: 'Users', access: 'admin' },
  { path: '/kds', label: 'KDS', access: 'public' },
  { path: '/reports', label: 'Reports', access: 'admin' },
];

function Navbar() {
  const { isAuthenticated, hasRole } = useAuth();

  const visibleItems = navItems.filter((item) => {
    if (item.access === 'public') {
      return true;
    }

    if (item.access === 'admin') {
      return hasRole(['admin']);
    }

    return isAuthenticated;
  });

  return (
    <nav className="w-full lg:w-[200px] border-r border-background/10 bg-primary text-background shrink-0 shadow-sm" aria-label="Primary">
      <ul className="flex flex-col gap-1 p-4">
        {visibleItems.map((item) => (
          <li key={item.path} className="w-full">
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `block min-h-12 rounded-lg px-4 py-2 text-body transition-all duration-150 active:scale-[0.97] ${
                  isActive
                    ? 'bg-accent text-background font-bold shadow-md shadow-accent/20'
                    : 'text-background/80 hover:bg-background/10 hover:text-background'
                }`
              }
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Navbar;
