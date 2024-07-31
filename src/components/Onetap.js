import { useGoogleOneTapLogin } from '@react-oauth/google';
import api from '../api/data';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/user/userSlice';
import { useEffect } from 'react';

const Onetap = ({ isProfile }) => {
  const dispatch = useDispatch(); 

  useEffect(() => {
    if (!isProfile) {
      clearSession();
    }
  }, [isProfile]);

  const clearSession = () => {
    // Get all existing cookie attributes 

    const cookieAttributes = document.cookie.split(';');
  
    // Iterate over each attribute and set it to expire immediately
    cookieAttributes.forEach(attribute => {
      const cookieName = attribute.split('=')[0].trim();
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    });
  };

  useGoogleOneTapLogin({
    onSuccess: async (credentialResponse) => {
   
      const USER_CREDENTIAL = credentialResponse;

      try {
        const response = await api.post("/api/login", { USER_CREDENTIAL }, { withCredentials: true });
        dispatch(setUser(response.data));
       // console.log(response.data);
      } catch (error) {
        console.error('Error during login:', error);
      }
    },
    onError: (error) => {
      console.log('Login Failed', error);
    },
    use_fedcm_for_prompt: true,
  });

  return null;
};

export default Onetap;
