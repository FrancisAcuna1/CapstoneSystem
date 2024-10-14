'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

const useLogout = () => {
  const router = useRouter();
  const { data: session, update, status } = useSession();

  const handleLogout = async () => {
    // Get user details from local storage (if you use this to store session data)
    const userDataString = localStorage.getItem('userDetails');
    if (!userDataString) {
      console.log('No user data found');
      router.push('/');
      return;
    }

    const userData = JSON.parse(userDataString);
    const accessToken = userData.token;

    if (!accessToken) {
      console.log('No access token found');
      router.push('/');
      return;
    }

    try {
      // Call your backend logout API
      const response = await fetch('http://127.0.0.1:8000/api/logout', {
        method: 'POST', // Use the correct HTTP method (usually POST for logout)
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (response.ok) {
        // Backend logout succeeded, clear local auth state
        // Clear local storage and session storage
        localStorage.removeItem('userDetails');
        sessionStorage.clear();
        

        // Call the NextAuth sign-out API to clear the session
        await fetch('/api/auth/signout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        // Clear the NextAuth session
        await update({ user: null });

        // Clear any cookies related to authentication
        document.cookie.split(";").forEach((c) => {
          document.cookie = c
            .replace(/^ +/, "")
            .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });
        deleteCookie("next-auth.session-token");
        deleteCookie("jwt");

        // Redirect the user to the login page
        router.push('/');
      } else {
        console.error('Logout failed:', await response.json());
      }
    } catch (error) {
      console.error('An error occurred during logout:', error);
    }
  };

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  return handleLogout;
};

export default useLogout;
