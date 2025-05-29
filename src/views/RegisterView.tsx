import { Link } from 'react-router-dom';

export default function RegisterView() {
  return (
    <>
      <nav>
        <Link to='/auth/login'>
          Have an account? Log in
        </Link>
      </nav>
    </>
  )
}