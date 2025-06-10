import { toast } from 'sonner';
import { isAxiosError } from 'axios';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import api from '../config/axios';
import type { RegisterForm } from '../types';
import ErrorMessage from '../components/ErrorMessage';

export default function RegisterView() {
  const initialValues: RegisterForm = {
    name: '',
    email: '',
    username: '',
    password: '',
    password_confirmation: '',
  }

  const { register, watch, reset, handleSubmit, formState: { errors }} = useForm({defaultValues: initialValues});

  const password = watch('password');
  
  const handleRegister = async(formData: RegisterForm) => {
    try {
      const { data } = await api.post(`/auth/register`, formData);
      toast.success(data, { richColors: true });
      reset();
    } catch (error) {
      if(isAxiosError(error) && error.response) {
        const errors = error.response?.data.errors;
        errors.forEach((err: { msg: string }) => {
          toast.error(err.msg, { richColors: true });
        });
      }
    }
  }

  return (
    <>
      <h1 className='text-4xl text-white font-bold'>Create Account</h1>

      <form
        onSubmit={handleSubmit(handleRegister)}
        className="bg-white px-5 py-20 rounded-lg space-y-10 mt-10"
      >
        <div className="grid grid-cols-1 space-y-3">
          <label htmlFor="name" className="text-2xl text-slate-500">Name</label>
          <input
            id="name"
            type="text"
            placeholder="Your name"
            className="bg-slate-100 border-none p-3 rounded-lg placeholder-slate-400"
            {...register('name', {
              required: 'Name is required'
            })}
          />
          {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
        </div>
        <div className="grid grid-cols-1 space-y-3">
          <label htmlFor="email" className="text-2xl text-slate-500">E-mail</label>
          <input
            id="email"
            type="email"
            placeholder="Registration Email"
            className="bg-slate-100 border-none p-3 rounded-lg placeholder-slate-400"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: 'Invalid email',
              }
            })}
          />
          {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
        </div>
        <div className="grid grid-cols-1 space-y-3">
          <label htmlFor="username" className="text-2xl text-slate-500">Username</label>
          <input
            id="username"
            type="text"
            placeholder="Username: no spaces"
            className="bg-slate-100 border-none p-3 rounded-lg placeholder-slate-400"
            {...register('username', {
              required: 'Username is required'
            })}
          />
          {errors.username && <ErrorMessage>{errors.username.message}</ErrorMessage>}
        </div>
        <div className="grid grid-cols-1 space-y-3">
          <label htmlFor="password" className="text-2xl text-slate-500">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Registration Password"
            className="bg-slate-100 border-none p-3 rounded-lg placeholder-slate-400"
            {...register('password', {
              required: 'Password is required',
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/,
                message: 'Password must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, one number, and one special character'
              }
            })}
          />
          {errors.password && <ErrorMessage>{errors.password.message}</ErrorMessage>}
        </div>

        <div className="grid grid-cols-1 space-y-3">
          <label htmlFor="password_confirmation" className="text-2xl text-slate-500">Repeat Password</label>
          <input
            id="password_confirmation"
            type="password"
            placeholder="Repeat Password"
            className="bg-slate-100 border-none p-3 rounded-lg placeholder-slate-400"
            {...register('password_confirmation', {
              required: 'Password is required',
              validate: (value) => value === password || 'The passwords don\'t match'
            })}
          />
          {errors.password_confirmation && <ErrorMessage>{errors.password_confirmation.message}</ErrorMessage>}
        </div>

        <input
          type="submit"
          className="bg-cyan-400 p-3 text-lg w-full uppercase text-slate-600 rounded-lg font-bold cursor-pointer"
          value='Create Account'
        />
      </form>

      <nav className='mt-10'>
        <Link
          className='text-center text-white text-lg block'
          to='/auth/login'
        >Have an account? Log in</Link>
      </nav>
    </>
  )
}