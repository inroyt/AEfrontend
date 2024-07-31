import { useState,useEffect,useCallback } from "react"
import api from '../api/data';
import {useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/user/userSlice';
import { useSelector } from 'react-redux';
const SignUp = () => {
  const profile=useSelector((state) => state.user.user);
  const [isNoProfile, setIsNoProfile] = useState(false);
  const [username,setUserName] = useState('');
  const [password,setPassword] = useState('');
  const [email,setEmail] = useState('');
  const [errMessage, setErrMessage] = useState('');
  const emailRegex=/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const passwordRegex=/(?=^.{8,}$)((?=.*\d)(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;
  const [isPasswordError, setIsPasswordError] = useState(false);
  const [isEmailError, setIsEmailError]=useState(false);
  const [isUserFocused, setIsUserFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const validEmail=emailRegex.test(email);
  const canSave= [username,password,email,validEmail].every(Boolean)&&!isPasswordError&&!isEmailError;
  const loginData= {name:username,password:password,email:email};
  // Dynamically adjust label styles based on focus or if the input has value
  const userNameStyle = isUserFocused || username ? 'top-[-15px] text-sm font-bold dark:text-gray-100  px-1 ' : 'top-1/2 transform -translate-y-1/2  px-1 text-lg text-gray-500 dark:text-gray-300';
  const passwordStyle = isPasswordFocused || password ? 'top-[-15px] text-sm font-bold dark:text-gray-100  px-1' : 'top-1/2 transform -translate-y-1/2  px-1 text-lg text-gray-500 dark:text-gray-300';
  const emailStyle = isEmailFocused || email ? 'top-[-15px] text-sm font-bold dark:text-gray-100  px-1' : 'top-1/2 transform -translate-y-1/2  px-1 text-lg text-gray-500 dark:text-gray-300';
  const history=useNavigate();
  const dispatch = useDispatch();
  const onUsernameChange=(e)=>setUserName(e.target.value);
  const onPasswordChange=(e)=>{
    const value=e.target.value;
    setPassword(value);
    value.length>0? setIsPasswordError(!passwordRegex.test(value)):setIsPasswordError(false);
  }
  const onEmailChange=(e)=>{
    const value=e.target.value;
    setEmail(value);
    value.length>0? setIsEmailError(!emailRegex.test(value)):setIsEmailError(false);
  }
 
  
  
  const googleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) =>{// it cost 2weeks to find out why session persistence issues were happening,because {withCredentials:true} option was not specified in POST request
    api.post('/api/login',{tokenResponse},{ withCredentials: true })
    .then((response) =>{
        
        dispatch(setUser(response.data));
       // setProfiler(response.data);
       //localStorage.setItem('user', JSON.stringify(response.data));
    })
    .catch((err) => console.log(err));},
    onError: (error) => console.log('Login Failed:', error),
});
const handleSignup = async (loginData) => {
  try {
    const response = await api.post('/api/login', {loginData}, { withCredentials: true }); 
     if(response.status===200){
      dispatch(setUser(response.data));

     }
   
  } catch (error) {
    if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
        
        if (error.response.status === 400) {
            // Handle wrong password or other bad requests specifically
            setErrMessage(error.response.data.message);
        } else {
            // Handle other types of errors (like 500, etc.)
            setErrMessage("An unexpected error occurred");
        }
    } else if (error.request) {
        // The request was made but no response was received
        console.log(error.request);
        setErrMessage("No response from server");
    } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
        setErrMessage("Error in sending request");
    }
}
};
const handleNavigation = useCallback(() => {
       
  if (profile.linkname !== undefined) {
     
      history(`/profile/${profile.linkname}`);
      setIsNoProfile(false);
  } else {
      setIsNoProfile(true);
  }
}, [history,profile]);

useEffect(() => {
  handleNavigation();
}, [handleNavigation]);
  return (
    <div className={` max-w-full bg-blue-700 dark:bg-gray-500 flex flex-grow items-center justify-center mx-auto  font-roboto  lg:px-2 py-10 mt-12 h-screen z-0} `}>
    {isNoProfile && ( <div className={`h-screen  w-full lg:w-[25%] bg-white rounded-lg  dark:bg-gray-600 shadow-2xl  p-6 space-y-4 `}>
  <h2 className="text-2xl font-bold text-center text-blue-700 dark:text-gray-100 mt-10">Create a Profile</h2>
                <div className="relative bg-inherit w-full h-[8%]  border-2 border-blue-700 dark:border-gray-500 p-2 rounded-lg">
                  <label
                    htmlFor="username"
                    className={`absolute bg-inherit  text-blue-700  left-2 transition-all ${userNameStyle} `}
                  >
                    Username {isUserFocused ? `*`:``}
                  </label>
                  <input
                    type="text"
                    id="username"
                    onFocus={() => setIsUserFocused(true)}
                    onBlur={() => setIsUserFocused(false)}
                    onChange={onUsernameChange}
                    value={username} 
                    className="outline-none bg-inherit w-full  p-2 text-blue-700 dark:text-gray-100"
                  />
                  </div>

            <div className={`relative bg-inherit w-full h-[8%]  border-2 ${isEmailError?`text-pink-500 border-pink-500`:`text-blue-700 border-blue-700`}  dark:text-gray-100  dark:border-gray-500 p-2 rounded-lg`}>
                  <label
                    htmlFor="email"
                    className={`absolute left-2 bg-inherit  transition-all ${emailStyle} `}
                  >
                    Email {isEmailFocused ? `*`:``}
                  </label>
                  <input
                    type="email"
                    id="email"
                    onFocus={() => setIsEmailFocused(true)}
                    onBlur={() => setIsEmailFocused(false)}
                    onChange={onEmailChange}
                    value={email} 
                    className="outline-none bg-inherit  w-full transition-opacity p-2"
                  />
                </div>
              {isEmailError && (
        <p className=" text-pink-600 dark:text-pink-200 text-sm ">
          *Please provide a valid email address
        </p>
      )}
  <div className={`relative bg-inherit w-full h-[8%]  border-2 ${isPasswordError?`text-pink-500 border-pink-500`:`text-blue-700 border-blue-700`}  dark:text-gray-100  dark:border-gray-500 p-2 rounded-lg`}>
                  <label
                    htmlFor="password"
                    className={`absolute left-2 bg-inherit  transition-all ${passwordStyle} `}
                  >
                    Password {isPasswordFocused ? `*`:``}
                  </label>
                  <input
                    type="password"
                    id="password"
                    onFocus={() => setIsPasswordFocused(true)}
                    onBlur={() => setIsPasswordFocused(false)}
                    onChange={onPasswordChange}
                    value={password} 
                    className="outline-none bg-inherit  w-full transition-opacity p-2"
                  />
                </div>
 <div className="flex flex-col">
 {isPasswordError && (
        <p className="text-pink-600 dark:text-pink-200 text-sm">
          Password should be at least 8 characters long and include at least one special character,one lowercase letter,one uppercase letter and one digit.
        </p>
      )}
      {errMessage&&<p className="text-pink-600 text-sm dark:text-pink-200">{errMessage}</p>}
 </div>
 <div >
  <p className="text-blue-700 dark:text-gray-100 text-sm">By clicking Sign Up or Sign Up with Google you agree to our <a href='/terms' target="_blank" className="font-bold underline">Terms of Service</a> and that you have read our   <a href='/privacy' target="_blank" className="font-bold underline">Privacy Policy</a></p>
 </div>
  <div className=" focus-within:border-blue-700 flex flex-col gap-[2px] items-center">
  <button disabled={!canSave} onClick={() => handleSignup(loginData)} className="flex justify-center items-center py-2 shadow-md bg-blue-700 hover:bg-blue-600 dark:bg-gray-100  dark:hover:bg-blue-200 text-white dark:text-blue-700 dark:hover:text-gray-700  rounded-lg transition-opacity p-2 text-lg w-[50%]">Sign Up</button>
  
  <p className="text-blue-700 dark:text-gray-100">Or</p>
  <button className="border-[1px] border-blue-700 flex flex-row  bg-white dark:bg-gray-100 hover:bg-slate-100 rounded-lg text-black p-2 text-lg w-[70%]"onClick={() => googleLogin()}><span className="mx-auto flex flex-row gap-1 text-blue-700">Sign Up with Google <svg className=' h-5 w-5 my-auto' xmlns="http://www.w3.org/2000/svg" width="2443" height="2500" preserveAspectRatio="xMidYMid" viewBox="0 0 256 262" id="google"><path fill="#4285F4" d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"></path><path fill="#34A853" d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"></path><path fill="#FBBC05" d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"></path><path fill="#EB4335" d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"></path></svg></span></button>
  </div>
</div>)}
  </div>
  )
}

export default SignUp;
