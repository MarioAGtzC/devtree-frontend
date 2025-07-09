import type { Username } from '../types';

type UsernameDataProps = {
  data: Username
}

export default function UsernameData({data}: UsernameDataProps) {
  return (
    <div className='space-y-6 text-white'>
      <p className='text-5xl text-center font-black'>{data.username}</p>
      {data.image && <img src={data.image} className='max-w-[250px] mx-auto'/>}
      <p className='text-lg text-center font-bold'>{data.description}</p>
    </div>
  )
}