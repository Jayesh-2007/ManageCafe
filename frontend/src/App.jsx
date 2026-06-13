import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import AppLayout from './layouts/AppLayout';
import Login from './pages/Login';
import Signup from './pages/Signup';

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
              <Route path="/pos" element={<div>POS Page</div>} />
              <Route path="/orders" element={<div>Orders Page</div>} />
              <Route path="/kds" element={<div>KDS Page</div>} />
              <Route path="/customers" element={<div>Customers Page</div>} />
              
              {/* Admin Only Routes */}
              <Route element={<ProtectedRoute requiredRole="admin" />}>
                <Route path="/products" element={<div>Products Page</div>} />
                <Route path="/categories" element={<div>Categories Page</div>} />
                <Route path="/promotions" element={<div>Promotions Page</div>} />
                <Route path="/users" element={<div>Users Page</div>} />
                <Route path="/reports" element={<div>Reports Page</div>} />
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
