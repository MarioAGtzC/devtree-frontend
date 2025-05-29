import { Link } from 'react-router-dom';

export default function LoginView() {
  return (
    <>
      <div>LoginView</div>

      <nav>
        <Link to='/auth/register'>
          Don't have an account? Register
        </Link>
      </nav>
    </>
  )
}