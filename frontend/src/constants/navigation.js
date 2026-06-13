import { 
  LayoutDashboard, 
  ShoppingCart, 
  Users, 
  MonitorPlay, 
  Package, 
  Tags, 
  Percent, 
  UserCircle, 
  BarChart3 
} from 'lucide-react';

export const NAVIGATION = [
  { name: 'POS', href: '/pos', icon: LayoutDashboard, roles: ['admin', 'employee'] },
  { name: 'Orders', href: '/orders', icon: ShoppingCart, roles: ['admin', 'employee'] },
  { name: 'KDS', href: '/kds', icon: MonitorPlay, roles: ['admin', 'employee'] },
  { name: 'Customers', href: '/customers', icon: Users, roles: ['admin', 'employee'] },
  
  { name: 'Products', href: '/products', icon: Package, roles: ['admin'] },
  { name: 'Categories', href: '/categories', icon: Tags, roles: ['admin'] },
  { name: 'Promotions', href: '/promotions', icon: Percent, roles: ['admin'] },
  { name: 'Users', href: '/users', icon: UserCircle, roles: ['admin'] },
  { name: 'Reports', href: '/reports', icon: BarChart3, roles: ['admin'] },
];
