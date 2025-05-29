import { Link } from 'react-router-dom';

export default function LoginView() {
  return (
    <>
      <h1 className='text-4xl text-white font-bold'>Log in</h1>
      <nav>
        <Link
          className='text-center text-white text-lg block'
          to='/auth/register'
        >Don't have an account? Register</Link>
      </nav>
    </>
  )
}