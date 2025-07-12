import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, User, Mail, Lock } from 'lucide-react';
import Navbar from '../components/Navbar';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const {
    register: formRegister,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await registerUser(data);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <Navbar />
      <div className="w-full max-w-sm bg-black rounded-2xl shadow-lg p-8 flex flex-col items-center border-2 border-white">
        {/* Avatar */}
        <div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center mb-8">
          <User className="h-10 w-10 text-gray-400" />
        </div>
        <form className="w-full space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-200 mb-1">
              First Name
            </label>
            <input
              id="firstName"
              type="text"
              {...formRegister('firstName', {
                required: 'First name is required',
                minLength: { value: 2, message: 'At least 2 characters' },
              })}
              className="input-field bg-gray-700 text-gray-100 placeholder-gray-400 border-gray-600"
              placeholder="Enter your first name"
            />
            {errors.firstName && (
              <p className="mt-1 text-xs text-red-400">{errors.firstName.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-200 mb-1">
              Last Name
            </label>
            <input
              id="lastName"
              type="text"
              {...formRegister('lastName', {
                required: 'Last name is required',
                minLength: { value: 2, message: 'At least 2 characters' },
              })}
              className="input-field bg-gray-700 text-gray-100 placeholder-gray-400 border-gray-600"
              placeholder="Enter your last name"
            />
            {errors.lastName && (
              <p className="mt-1 text-xs text-red-400">{errors.lastName.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              {...formRegister('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
              className="input-field bg-gray-700 text-gray-100 placeholder-gray-400 border-gray-600"
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>
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
                  minLength: { value: 6, message: 'At least 6 characters' },
                })}
                className="input-field bg-gray-700 text-gray-100 placeholder-gray-400 border-gray-600 pr-10"
                placeholder="Create a password"
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
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        {/* Social login placeholder */}
        <div className="w-full mt-6 flex flex-col items-center">
          <div className="text-gray-400 text-xs mb-2">or</div>
          <button className="w-full py-2 rounded-lg bg-gray-700 text-gray-200 font-medium border border-gray-600 cursor-not-allowed opacity-60 mb-2">
            Social Signup (Coming Soon)
          </button>
        </div>
        <div className="w-full text-center mt-4">
          <span className="text-gray-400 text-sm">Already have an account? </span>
          <Link to="/login" className="text-green-400 hover:underline text-sm">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Register; 