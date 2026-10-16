import { toast } from 'sonner';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { DevTreeLink, SocialNetwork, User } from '../types';
import { isValidUrl } from '../utils';
import { social } from '../data/social';
import { updateProfile } from '../api/DevTreeAPI';
import DevTreeInput from '../components/DevTreeInput';

export default function LinkTreeView() {
  const queryClient = useQueryClient();
  const user : User = queryClient.getQueryData(['user'])!;

  // Read the cache once: re-syncing on every cache change wiped URLs typed into links not enabled yet
  const [devTreeLinks, setDevTreeLinks] = useState(() => social.map(item => {
    const userLink = JSON.parse(user.links).find((link : DevTreeLink) => link.name === item.name)
    return userLink ? { ...item, url: userLink.url, enabled: userLink.enabled } : item;
  }));

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

  const updateCachedLink = (changed: DevTreeLink) => {
    queryClient.setQueryData(['user'], (prevData: User) => {
      const links: SocialNetwork[] = JSON.parse(prevData.links);
      const merged = links.some(link => link.name === changed.name)
        ? links.map(link => link.name === changed.name ? { ...link, url: changed.url, enabled: changed.enabled } : link)
        : [...links, { ...changed, id: 0 }];
      // ids are dnd-kit keys: number enabled links 1..n in their saved order, disabled ones 0
      let n = 0;
      const updatedItems = merged.map(link => ({ ...link, id: link.enabled ? ++n : 0 }));
      return {
        ...prevData,
        links: JSON.stringify(updatedItems)
      }
    })
  }

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const changed = { ...devTreeLinks.find(link => link.name === e.target.name)!, url: e.target.value };
    setDevTreeLinks(devTreeLinks.map(link => link.name === changed.name ? changed : link));
    updateCachedLink(changed);
  }

  const handleEnableLink = (socialNetwork: string) => {
    const link = devTreeLinks.find(link => link.name === socialNetwork)!;
    // Only validate when switching on, so a link with a broken URL can still be switched off
    if(!link.enabled && !isValidUrl(link.url)) {
      toast.error('Not a valid URL', { richColors: true });
      return;
    }
    const changed = { ...link, enabled: !link.enabled };
    setDevTreeLinks(devTreeLinks.map(item => item.name === socialNetwork ? changed : item));
    updateCachedLink(changed);
  }

  const handleSave = () => {
    const invalid = devTreeLinks.find(link => link.enabled && !isValidUrl(link.url));
    if(invalid) {
      toast.error(`Not a valid URL: ${invalid.name}`, { richColors: true });
      return;
    }
    const current : User = queryClient.getQueryData(['user'])!;
    // Disabled links may hold half-typed URLs; don't send those to the API
    const links = JSON.parse(current.links).filter((link: SocialNetwork) => link.enabled || isValidUrl(link.url));
    mutate({ ...current, links: JSON.stringify(links) });
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
        onClick={handleSave}
      >Save changes</button>
    </>
  )
}