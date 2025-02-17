'use client';
import useUserContext from '@/context/userContext/useUserContext';
import { useRefetchUser } from '@/endpoints/auth/refetchUserData';
import { useRouter } from '@/navigation';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef } from 'react';
import handleToken from './useSaveToken';
import Cookies from 'js-cookie';
import { COOKIES_KEYS } from '@/app-constants';
export default function useRefetchUserData() {
  const { userData, setUserData } = useUserContext();
  const isInitialized = useRef(false);
  /* ---------------------------------- Hooks --------------------------------- */
  const { replace } = useRouter();
  const pathname = usePathname();

  /* ---------------------------------- APIS ---------------------------------- */
  const { mutateAsync } = useRefetchUser({
    onSuccess: (response) => {
      if (!response) return;
      setUserData(response.user);
      handleToken(response);
    },
  });

  /* -------------------------------- Functions ------------------------------- */
  const renewToken = useCallback(
    async (token: string) => {
      try {
        await mutateAsync(token);
      } catch (err) {
        console.log(err);
        Cookies.remove(COOKIES_KEYS.token);
        replace('login');
      }
    },
    [mutateAsync, replace]
  );

  const getUserData = useCallback(async () => {
    const token = Cookies.get(COOKIES_KEYS.token);
    if (!token) {
      return replace('login');
    }
    await renewToken(token);
  }, [pathname, replace, renewToken]);

  useEffect(() => {
    if (!isInitialized.current && !userData) {
      getUserData();
      isInitialized.current = true;
    }
  }, [getUserData]);
}
