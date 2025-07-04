import type { DevTreeLink } from '../types'

type DevTreeInputProps = {
  item: DevTreeLink
}

export default function DevTreeInput({item}: DevTreeInputProps) {
  return (
    <div className='bg-white shadow-sm p-5 flex items-center'>
      <div
        className='w-12 h-12 bg-cover'
        style={{ backgroundImage: `url('/social/icon_${item.name}.svg')` }}
      ></div>
      <input
        type='text'
        className='flex-1 border border-gray-100 rounded-3xl'
      />
    </div>
  )
}