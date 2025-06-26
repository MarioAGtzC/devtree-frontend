import { useForm } from 'react-hook-form';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import type { User, ProfileForm } from '../types';
import { updateProfile } from '../api/DevTreeAPI';
import ErrorMessage from '../components/ErrorMessage';

export default function ProfileView() {
  const queryClient = useQueryClient();
  const data = queryClient.getQueryData<User>(['user']);

  const {register, handleSubmit, formState: {errors}} = useForm<ProfileForm>({defaultValues: {
    username: data?.username,
    description: data?.description,
  }});

  const updateProfileMutation = useMutation({
    mutationFn: updateProfile,
    onError: (error) => {
      console.error(error);
    },
    onSuccess: (data) => {
      console.log(data);
    }
  });

  const handleUserProfileForm = (formData: ProfileForm) => {
    console.log(formData);

    updateProfileMutation.mutate(formData);
  }

  return (
    <form
      className='bg-white p-10 rounded-lg space-y-5'
      onSubmit={handleSubmit(handleUserProfileForm)}
    >
      <legend className='text-2xl text-slate-800 text-center'>Edit information</legend>
      <div className='grid grid-cols-1 gap-2'>
        <label htmlFor='username'>Username:</label>
        <input
          type='text'
          className='border-none bg-slate-100 rounded-lg p-2'
          placeholder='Username or handle'
          {...register('username', {
            required: 'Username is required'
          })}
        />
        {errors.username && <ErrorMessage>{errors.username.message}</ErrorMessage>}
      </div>
      <div className='grid grid-cols-1 gap-2'>
        <label htmlFor='description'>Description:</label>
        <textarea
          className='border-none bg-slate-100 rounded-lg p-2'
          placeholder='Your description'
          {...register('description')}
        />
      </div>
      <div className='grid grid-cols-1 gap-2'>
        <label htmlFor='image'>Image:</label>
        <input
          type='file'
          className='border-none bg-slate-100 rounded-lg p-2'
          accept='image/*'
        />
      </div>
      <input
        type='submit'
        className='bg-cyan-400 p-2 text-lg w-full uppercase text-slate-600 rounded-lg font-bold cursor-pointer'
        value='Save changes'
      />
    </form>
  )
}
