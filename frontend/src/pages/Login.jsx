import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import ErrorMessage from '../components/common/ErrorMessage';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const validate = () => {
    const errors = {};
    if (!email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email format is invalid';
    }
    if (!password) {
      errors.password = 'Password is required';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setError('');
    
    try {
      const user = await login({ email, password });
      const from = location.state?.from?.pathname || (user.role === 'admin' ? '/reports' : '/pos');
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">
            Sign in to ManageCafe
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Welcome back! Please enter your details.
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <ErrorMessage message={error} />
          
          <div className="space-y-4">
            <Input
              label="Email address"
              type="email"
              placeholder="admin@cafepos.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={validationErrors.email}
              disabled={isLoading}
              autoComplete="email"
            />
            
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={validationErrors.password}
              disabled={isLoading}
              autoComplete="current-password"
            />
          </div>

          <div>
            <Button
              type="submit"
              className="w-full flex justify-center py-2.5"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </div>
        </form>
        
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium text-primary-600 hover:text-primary-500">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
