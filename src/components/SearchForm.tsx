import slugify from 'react-slugify';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import ErrorMessage from './ErrorMessage';
import { searchByUsername } from '../api/DevTreeAPI';

export default function SearchForm() {
  const { register, handleSubmit, watch, formState: { errors }} = useForm({
    defaultValues: {
      username: ''
    }
  });

  const mutation = useMutation({
    mutationFn: searchByUsername
  });

  const username = watch('username');

  const handleSearch = () => {
    const slug = slugify(username)
    mutation.mutate(slug);    
  }

  return (
    <form
      onSubmit={handleSubmit(handleSearch)}
      className='space-y-5'
    >
      <div className='relative flex items-center bg-white px-2'>
        <label htmlFor='username'>devtree.greenie.dev/</label>
        <input
          type='text'
          id='username'
          className='border-none bg-transparent p-2 focus:ring-0 flex-1'
          placeholder='elonmusk, zuck, jeffbezos'
          {...register('username', {
            required: 'Username is required'
          })}
        />
      </div>
      {errors.username && <ErrorMessage>{errors.username.message}</ErrorMessage>}

      <div className='mt-10'>
        {mutation.isPending && <p className='text-center'>Loading...</p>}
        {mutation.isError && <p className='text-center text-red-600 font-black'>{Array.isArray(mutation.error) ? mutation.error[0]?.msg : mutation.error?.message}</p>}
        {mutation.data && <p className='text-center text-cyan-500 font-black'>{mutation.data} go to <Link to={'/auth/register'}>Register</Link></p>}
      </div>

      <input
        type='submit'
        className='bg-cyan-400 p-3 text-lg w-full uppercase text-slate-600 rounded-lg font-bold cursor-pointer'
        value='Get my DevTree'
      />
    </form>
  )
}