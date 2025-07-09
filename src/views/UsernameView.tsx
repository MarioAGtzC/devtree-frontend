import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getUserByUsername } from '../api/DevTreeAPI';
import Loader from '../components/Loader';

export default function UsernameView() {
  const params = useParams();
  const username = params.username!;
  const { data, isError, isLoading } = useQuery({
    queryFn: () => getUserByUsername(username),
    queryKey: ['username', username],
    retry: 1
  });

  if(isLoading) return <div className='flex justify-center'><Loader/></div>
  console.log(isError);
  console.log(data);

  return (
    <div>UsernameView</div>
  )
}