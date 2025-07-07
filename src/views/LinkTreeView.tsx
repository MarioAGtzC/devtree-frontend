import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { User } from '../types';
import { isValidUrl } from '../utils';
import { social } from '../data/social';
import { updateProfile } from '../api/DevTreeAPI';
import type { DevTreeLink } from '../types/index';
import DevTreeInput from '../components/DevTreeInput';

export default function LinkTreeView() {
  const [devTreeLinks, setDevTreeLinks] = useState(social);

  const queryClient = useQueryClient();
  const user : User = queryClient.getQueryData(['user'])!;
  const { mutate } = useMutation({
    mutationFn: updateProfile,
    onError: (error) => {
      if(error instanceof Error) {
        toast.error(error.message, { richColors: true });
      } else {
        (error as []).forEach((err: { msg: string }) => {
          toast.error(err.msg, { richColors: true });
        });
      }
    },
    onSuccess: (data) => {
      toast.success(`${data}`, { richColors: true });
    }
  });

  useEffect(() => {
    const updatedData = social.map(item => {
      const userLink = JSON.parse(user.links).find((link : DevTreeLink) => link.name === item.name)
      if(userLink) {
        return { ...item, url: userLink.url, enabled: userLink.enabled }
      }
      return item;
    })
    setDevTreeLinks(updatedData);
  }, [user.links])

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedLinks = devTreeLinks.map(link => link.name === e.target.name ? {...link, url: e.target.value } : link);

    setDevTreeLinks(updatedLinks);

    queryClient.setQueryData(['user'], (prevData: User) => {
      return {
        ...prevData,
        links: JSON.stringify(updatedLinks)
      }
    })
  }

  const handleEnableLink = (socialNetwork: string) => {
    const updatedLinks = devTreeLinks.map(link => {
      if(link.name === socialNetwork) {
        if(isValidUrl(link.url)) {
          return {...link, enabled: !link.enabled };
        } else {
        toast.error('Not a valid URL', { richColors: true });
        }
      }
      return link;
    });

    setDevTreeLinks(updatedLinks);

    queryClient.setQueryData(['user'], (prevData: User) => {
      return {
        ...prevData,
        links: JSON.stringify(updatedLinks)
      }
    })
  }
  
  return (
    <>
      <div className='space-y-5'>
        {devTreeLinks.map(item => (
          <DevTreeInput
            key={item.name}
            item={item}
            handleUrlChange={handleUrlChange}
            handleEnableLink={handleEnableLink}
          />
        ))}
      </div>
      <button
        className='bg-cyan-400 p-2 text-lg w-full uppercase text-slate-600 rounded-lg font-bold'
        value='Save changes'
        onClick={() => mutate(user)}
      >Save changes</button>
    </>
  )
}