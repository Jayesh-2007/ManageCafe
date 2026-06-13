import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ErrorMessage from '../components/common/ErrorMessage';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Toast from '../components/common/Toast';
import { useAuth } from '../hooks/useAuth.jsx';
import api from '../utils/api';

const emailError = 'Please enter a valid email address';
const passwordError = 'Password must be at least 8 characters';
const loginFailure = 'Invalid email or password';

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function getToken(responseData) {
  return responseData?.token ?? responseData?.jwt ?? responseData?.accessToken ?? null;
}

function Login() {
  const navigate = useNavigate();
  const { setJwt } = useAuth();
  const [values, setValues] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [banner, setBanner] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const isSubmittingRef = useRef(false);

  function updateField(event) {
    const { name, value } = event.target;
    setValues((currentValues) => ({ ...currentValues, [name]: value }));
    setErrors((currentErrors) => ({ ...currentErrors, [name]: '' }));
    setBanner('');
  }

  function validate() {
    const nextErrors = {};

    if (!isValidEmail(values.email.trim())) {
      nextErrors.email = emailError;
    }

    if (values.password.length < 8) {
      nextErrors.password = passwordError;
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (isSubmittingRef.current || !validate()) {
      return;
    }

    isSubmittingRef.current = true;
    setIsLoading(true);
    setBanner('');

    try {
      const response = await api.post('/api/auth/login', {
        email: values.email.trim(),
        password: values.password,
      });
      const token = getToken(response.data);

      if (!token) {
        throw new Error('Missing token');
      }

      setJwt(token);
      navigate('/pos', { replace: true });
    } catch {
      setBanner(loginFailure);
    } finally {
      isSubmittingRef.current = false;
      setIsLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
      <section className="w-full max-w-md rounded border border-border bg-surface p-6">
        <h1 className="text-page-title text-primary">Login</h1>
        <form className="mt-6 flex flex-col gap-4" noValidate onSubmit={handleSubmit}>
          {banner ? <Toast message={banner} type="error" /> : null}

          <div className="flex flex-col gap-1">
            <label className="text-label text-copy-primary" htmlFor="email">
              Email/Username
            </label>
            <input
              id="email"
              name="email"
              type="text"
              autoComplete="email"
              value={values.email}
              onChange={updateField}
              aria-describedby={errors.email ? 'email-error' : undefined}
              className={`min-h-12 rounded border bg-background px-4 text-body text-copy-primary outline-none focus:border-accent ${
                errors.email ? 'border-error' : 'border-border'
              }`}
            />
            <ErrorMessage id="email-error" message={errors.email} />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-label text-copy-primary" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={values.password}
              onChange={updateField}
              aria-describedby={errors.password ? 'password-error' : undefined}
              className={`min-h-12 rounded border bg-background px-4 text-body text-copy-primary outline-none focus:border-accent ${
                errors.password ? 'border-error' : 'border-border'
              }`}
            />
            <ErrorMessage id="password-error" message={errors.password} />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="flex min-h-12 items-center justify-center gap-2 rounded bg-accent px-4 text-body font-semibold text-background disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading ? <LoadingSpinner label="Logging in" /> : null}
            Login
          </button>
        </form>

        <p className="mt-4 text-body text-copy-secondary">
          <Link className="font-semibold text-accent" to="/signup">
            Sign Up
          </Link>
        </p>
      </section>
    </main>
  );
}

export default Login;
