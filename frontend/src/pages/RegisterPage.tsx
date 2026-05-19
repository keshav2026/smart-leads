import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'sales';
}

const roleOptions = [
  { value: 'sales', label: 'Sales User' },
  { value: 'admin', label: 'Admin' },
];

const RegisterPage = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({ defaultValues: { role: 'sales' } });

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    try {
      const res = await authService.register(data);
      setAuth(res.user, res.token);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Registration failed';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="h-14 w-14 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg mb-4">
            <span className="text-white text-2xl font-bold">SL</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create Account</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Join Smart Leads Dashboard</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              id="name"
              label="Full Name"
              placeholder="John Doe"
              error={errors.name?.message}
              {...register('name', {
                required: 'Name is required',
                minLength: { value: 2, message: 'Minimum 2 characters' },
              })}
            />

            <Input
              id="email"
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              {...register('email', {
                required: 'Email is required',
                pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' },
              })}
            />

            <div className="relative">
              <Input
                id="password"
                label="Password"
                type={showPass ? 'text' : 'password'}
                placeholder="Min. 6 characters"
                error={errors.password?.message}
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Minimum 6 characters' },
                })}
              />
              <button
                type="button"
                onClick={() => setShowPass((p) => !p)}
                className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
              >
                {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            <Select
              id="role"
              label="Role"
              options={roleOptions}
              error={errors.role?.message}
              {...register('role', { required: 'Role is required' })}
            />

            <Button type="submit" isLoading={isLoading} className="w-full" size="lg">
              Create Account
            </Button>
          </form>

          <p className="mt-5 text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
