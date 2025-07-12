import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, User, Lock } from 'lucide-react';
import Navbar from '../components/Navbar';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await login(data);
      toast.success('Welcome back!');
      navigate('/Home');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black font-body">
      <Navbar />
      <div className="w-full max-w-sm bg-black rounded-2xl shadow-lg p-8 flex flex-col items-center border-2 border-white">
        {/* Avatar */}
        <div className="w-20 h-20 rounded-full bg-base flex items-center justify-center mb-8">
          <User className="h-10 w-10 text-eco" />
        </div>
        <form className="w-full space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-200 mb-1">
              Username
            </label>
            <div className="relative">
              <input
                id="username"
                type="text"
                {...formRegister('username', {
                  required: 'Username is required',
                })}
                className="input-field bg-gray-700 text-gray-100 placeholder-gray-400 border-gray-600"
                placeholder="Enter your username"
              />
            </div>
            {errors.username && (
              <p className="mt-1 text-xs text-red-400">{errors.username.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                {...formRegister('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                })}
                className="input-field bg-gray-700 text-gray-100 placeholder-gray-400 border-gray-600 pr-10"
                placeholder="Enter your password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary bg-green-600 hover:bg-green-700 text-white mt-2"
          >
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>
        {/* Social login placeholder */}
        <div className="w-full mt-6 flex flex-col items-center">
          <div className="text-gray-400 text-xs mb-2">or</div>
          <button className="w-full py-2 rounded-lg bg-gray-700 text-gray-200 font-medium border border-gray-600 cursor-not-allowed opacity-60 mb-2">
            Social Login (Coming Soon)
          </button>
        </div>
        <div className="w-full text-center mt-4">
          <span className="text-gray-400 text-sm">Don't have an account? </span>
          <Link to="/register" className="text-green-400 hover:underline text-sm">Register</Link>
        </div>
      </div>
    </div>
  );
};

export default Login; 