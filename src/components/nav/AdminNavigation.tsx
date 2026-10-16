import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';

export default function AdminNavigation() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const logout = () => {
    localStorage.removeItem('AUTH_TOKEN');
    // Remove, not invalidate: a failed refetch left the query in error and bounced the next login back here
    queryClient.removeQueries({ queryKey: ['user'] });
    navigate('/auth/login', { replace: true });
  }

  return (
    <button
      className='bg-lime-500 p-2 text-slate-800 uppercase font-black text-xs rounded-lg cursor-pointer'
      onClick={logout}
    >Log out</button>
  )
}