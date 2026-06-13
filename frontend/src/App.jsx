import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import AppLayout from './layouts/AppLayout';
import Login from './pages/Login';
import Signup from './pages/Signup';

// Placeholder Pages
import POS from './pages/POS';
import Orders from './pages/Orders';
import KDS from './pages/KDS';
import Customers from './pages/Customers';
import Products from './pages/Products';
import Categories from './pages/Categories';
import Promotions from './pages/Promotions';
import Users from './pages/Users';
import Reports from './pages/Reports';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Guest Routes */}
          <Route element={<ProtectedRoute guestOnly />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Route>
          
          {/* Protected Routes (Authenticated users) */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/" element={<Navigate to="/pos" replace />} />
              <Route path="/pos" element={<POS />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/kds" element={<KDS />} />
              <Route path="/customers" element={<Customers />} />
              
              {/* Admin Only Routes */}
              <Route element={<ProtectedRoute requiredRole="admin" />}>
                <Route path="/products" element={<Products />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/promotions" element={<Promotions />} />
                <Route path="/users" element={<Users />} />
                <Route path="/reports" element={<Reports />} />
              </Route>
            </Route>
          </Route>
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
