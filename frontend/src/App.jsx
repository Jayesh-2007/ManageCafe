import { Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './hooks/useAuth';
import Login from './pages/Login';
import SignUp from './pages/SignUp';

const adminRoles = ['admin'];

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/pos" element={<ProtectedRoute />} />
      <Route path="/orders" element={<ProtectedRoute />} />
      <Route path="/products" element={<ProtectedRoute allowedRoles={adminRoles} />} />
      <Route path="/categories" element={<ProtectedRoute allowedRoles={adminRoles} />} />
      <Route path="/payment-methods" element={<ProtectedRoute allowedRoles={adminRoles} />} />
      <Route path="/promotions" element={<ProtectedRoute allowedRoles={adminRoles} />} />
      <Route path="/users" element={<ProtectedRoute allowedRoles={adminRoles} />} />
      <Route path="/kds" element={null} />
      <Route path="/reports" element={<ProtectedRoute allowedRoles={adminRoles} />} />
    </Routes>
  );
}

export default App;
