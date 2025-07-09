import { Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import Loader from '../components/Loader';
import { getUser } from '../api/DevTreeAPI';
import DevTree from '../components/DevTree';

export default function AppLayout() {
  const { data, isLoading, isError } = useQuery({
    queryFn: getUser,
    queryKey: ['user'],
    retry: 1,
    refetchOnWindowFocus: false
  });

  if(isLoading) return <div className='bg-slate-800 min-h-screen flex justify-center items-center'><Loader/></div>
  if(isError) return <Navigate to={'/auth/login'}/>
  if (data) return <DevTree data={data}/>
}
