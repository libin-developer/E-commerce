
import Cookies from 'js-cookie';

// Delete the cookie
Cookies.remove('token', { path: '/signin' });




///

export const deleteCookie = () => {
  
    return   document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/signin;';
}

