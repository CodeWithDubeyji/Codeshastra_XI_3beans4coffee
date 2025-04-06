"use client"
import { supabase } from '@/lib/supabaseClient'
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SignUp() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [agreement, setAgreement] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    await supabase.from('users').insert({ "fullname": formData.fullName, "email": formData.email , "password":formData.confirmPassword})
    const {data , error} = await supabase
  .from('users')         // your table name
  .select('id')          // only fetch the 'id' column
  .eq('email', formData.email)  // match where email = test@example.com
  .single();
  if (error) {
    console.error('Error fetching ID:', error);
  } else {
    localStorage.setItem('userId', data.id);
  }
    if (!agreement) {
      setError('You must agree to the Terms and Privacy Policy');
      return;
    }

    setIsLoading(true);
    setError('');
     await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
    });

    try {
      // Replace with your actual registration logic
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Redirect to quiz instead of verification
      router.push('/quiz');
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col justify-center">
      <div className="mx-auto w-full max-w-md px-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-light text-blue-600 mb-2">Create Account</h1>
          <p className="text-gray-500">Sign up to get started with our service</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-500 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="••••••••"
            />
            <p className="mt-1 text-xs text-gray-500">
              Password must be at least 8 characters and include a number and a special character
            </p>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="••••••••"
            />
          </div>

          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="agreement"
                type="checkbox"
                checked={agreement}
                onChange={(e) => setAgreement(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="agreement" className="text-gray-700">
                I agree to the{' '}
                <Link href="/terms" className="text-blue-600 hover:text-blue-800">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-blue-600 hover:text-blue-800">
                  Privacy Policy
                </Link>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            {isLoading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-blue-600 hover:text-blue-800">
              Sign in
            </Link>
          </p>
        </div>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or sign up with</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3">
            <button
              type="button"
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <span className="sr-only">Sign up with Google</span>
              <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.545 10.239v3.821h5.445c-0.712 2.315-2.647 3.972-5.445 3.972-3.332 0-6.033-2.701-6.033-6.032s2.701-6.032 6.033-6.032c1.498 0 2.866 0.549 3.921 1.453l2.814-2.814c-1.787-1.638-4.139-2.639-6.735-2.639-5.522 0-10 4.478-10 10s4.478 10 10 10c8.396 0 10.249-7.85 9.426-11.748l-9.426 0.019z" />
              </svg>
            </button>

            <button
              type="button"
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <span className="sr-only">Sign up with Apple</span>
              <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.152 6.896c-0.948 0-2.415-1.078-3.96-1.040-2.040 0.038-3.92 1.188-4.96 3.015-2.117 3.671-0.541 9.086 1.519 12.057 1 1.445 2.197 3.071 3.761 3.015 1.508-0.057 2.078-0.972 3.91-0.972 1.831 0 2.352 0.972 3.96 0.94 1.638-0.029 2.678-1.486 3.678-2.932 1.161-1.686 1.64-3.317 1.68-3.397-0.040-0.02-3.22-1.236-3.26-4.892-0.032-3.055 2.5-4.516 2.62-4.596-1.441-2.111-3.681-2.346-4.469-2.396-2.020-0.168-3.702 1.158-4.479 1.158z" />
                <path d="M14.285 3.518c0.829-1.001 1.385-2.391 1.23-3.775-1.191 0.048-2.629 0.793-3.479 1.793-0.764 0.884-1.432 2.3-1.252 3.654 1.326 0.104 2.672-0.673 3.501-1.672z" />
              </svg>
            </button>

            <button
              type="button"
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <span className="sr-only">Sign up with Facebook</span>
              <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <footer className="mt-16 pb-6 text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} Your Company. All rights reserved.</p>
      </footer>
    </div>
  );
}