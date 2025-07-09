import { useForm } from 'react-hook-form';
import ErrorMessage from './ErrorMessage';

export default function SearchForm() {
  const { register, handleSubmit, watch, formState: { errors }} = useForm({
    defaultValues: {
      username: ''
    }
  });

  const username = watch('username');

  const handleSearch = () => {
    console.log(username);
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

      </div>

      <input
        type='submit'
        className='bg-cyan-400 p-3 text-lg w-full uppercase text-slate-600 rounded-lg font-bold cursor-pointer'
        value='Get my DevTree'
      />
    </form>
  )
}