import { useQuery } from '@tanstack/react-query';
import { Navigate, useParams } from 'react-router-dom';
import Loader from '../components/Loader';
import { getUserByUsername } from '../api/DevTreeAPI';
import UsernameData from '../components/UsernameData';

export default function UsernameView() {
  const params = useParams();
  const username = params.username!;
  const { data, isError, isLoading } = useQuery({
    queryFn: () => getUserByUsername(username),
    queryKey: ['username', username],
    retry: 1
  });

  if(isLoading) return <div className='flex justify-center'><Loader/></div>
  if(isError) return <Navigate to={'/404'}/>
  if(data) return <UsernameData data={data} />
}