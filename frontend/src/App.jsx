import { Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './hooks/useAuth';

const adminRoles = ['admin'];

function App() {
  return (
    <Routes>
      <Route path="/login" element={null} />
      <Route path="/signup" element={null} />
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
