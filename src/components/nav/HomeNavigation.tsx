import { Link } from 'react-router-dom';

export default function HomeNavigation() {
  return (
    <>
      <Link
        className='text-white p-2 uppercase font-black text-xs cursor-pointer'
        to='/auth/login'
      >Log in</Link>
      <Link
        className='bg-lime-500 p-2 text-slate-800 uppercase font-black text-xs rounded-lg cursor-pointer'
        to='/auth/register'
      >Register</Link>
    </>
  )
}