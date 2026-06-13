import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import AppLayout from './layouts/AppLayout';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<div>Login Page</div>} />
          <Route path="/signup" element={<div>Signup Page</div>} />
          
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/" element={<Navigate to="/pos" replace />} />
              <Route path="/pos" element={<div>POS Page</div>} />
              <Route path="/orders" element={<div>Orders Page</div>} />
              <Route path="/kds" element={<div>KDS Page</div>} />
              <Route path="/products" element={<div>Products Page</div>} />
              <Route path="/categories" element={<div>Categories Page</div>} />
              <Route path="/customers" element={<div>Customers Page</div>} />
              <Route path="/promotions" element={<div>Promotions Page</div>} />
              <Route path="/users" element={<div>Users Page</div>} />
              <Route path="/reports" element={<div>Reports Page</div>} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
