import React, { useState, useEffect, useCallback,useRef, useMemo } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { useSelector, shallowEqual } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/data';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/user/userSlice';
import useWindowSize from '../hooks/useWindowSize';
function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isNoProfile, setIsNoProfile] = useState(false);
    const [errMessage, setErrMessage] = useState('');
    const dispatch = useDispatch();
    const history = useNavigate();
    const profile = useSelector((state) => state.user, shallowEqual).user;
    const isInboxClicked = useSelector((state) => state.messages.isInboxOpen);
    const windowSize=useWindowSize();//console.log("windowSize: " + windowSize.width<768);
    const isDark=useSelector((state) => state.user.isDarkMode);
    const [isLoading ,setIsLoading]=useState(false)
    const [isUserFocused, setIsUserFocused] = useState(false);
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);
    const onUsernameChange = (e) => setUsername(e.target.value);
    const onPasswordChange = (e) => setPassword(e.target.value);
    const canSave = useMemo(() => [username, password].every(Boolean), [username, password]);
    const loginData = useMemo(() => ({ name: username, password: password }), [username, password]);
    const ref = useRef(null);
       //set the contnents to the top when it first loads
       useEffect(() => {
        window.scrollTo(0, 0); // For whole page scrolling
        // or for a specific container:
        ref.current?.scrollTo(0, 0);
      }, []);
    // Dynamically adjust label styles based on focus or if the input has value
    const userNameStyle = isUserFocused || username ? 'top-[-15px] text-sm font-bold dark:text-gray-100  px-1 ' : 'top-1/2 transform -translate-y-1/2  px-1 text-lg text-gray-500 dark:text-gray-300'
    const passwordStyle = isPasswordFocused || password ? 'top-[-15px] text-sm font-bold dark:text-gray-100  px-1 ' : 'top-1/2 transform -translate-y-1/2  px-1 text-lg text-gray-500 dark:text-gray-300'
    // Google OAuth login
    const login = useGoogleLogin({
        onSuccess: (tokenResponse) => {
            api.post('/api/login', { tokenResponse }, { withCredentials: true }) 
                .then((response) => {
                    
                    dispatch(setUser(response.data));
                    setIsLoading(true);
                })
                .catch((err) => console.log(err));
        },
        onError: (error) => console.log('Login Failed:', error),
    });

    const handleLogin = async () => {
      try {
          const response = await api.post('/api/login', { loginData }, { withCredentials: true });
          if (response.status===200){
         
          dispatch(setUser(response.data));
          setIsLoading(true);
          }
          
      } catch (error) {
        console.error(error);
          if (error.response) {
          
              
              if (error.response.status === 400) {
                  // Handle wrong password or other bad requests specifically
                  setErrMessage(error.response.data.message);
              } else {
                  // Handle other types of errors (like 500, etc.)
                  setErrMessage("An unexpected error occurred");
              }
          } else if (error.request) {
              // The request was made but no response was received
             
              setErrMessage("No response from server");
          } else {
              // Something happened in setting up the request that triggered an Error
             
              setErrMessage("Error in sending request");
          }
      }
    
  };
  

    const handleNavigation = useCallback(() => {
       
        if (profile.linkname !== undefined) {
            if (isInboxClicked) {
                history(`/profile/${profile.linkname}/inbox`);
                return;
            }
            history(`/profile/${profile.linkname}`);
            setIsNoProfile(false);
        } else {
            setIsNoProfile(true);
        }
    }, [history, isInboxClicked, profile]);

    useEffect(() => {
        handleNavigation();
    }, [handleNavigation]);
   
   if(isLoading) {
    return <div className="flex w-screen h-screen gap-4 m-auto  bg-inherit dark:bg-gray-600 rounded-md items-center justify-center"><svg aria-hidden="true" class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
</svg>
<span class="sr-only"></span>Loading...</div>;
   }//value={username} onChange={onUsernameChange} value={password} onChange={onPasswordChange}
    return (
    <div ref={ref} className={` max-w-full bg-blue-700 dark:bg-gray-500 flex items-center justify-center flex-grow mx-auto font-roboto  lg:px-2 py-10 lg:py-4 min-h-screen z-0} `}>
            {isNoProfile && <div className="h-full  w-full lg:w-[25%] bg-white rounded-lg  dark:bg-gray-600 shadow-2xl  p-6  space-y-6 lg:mt-12">
                
                <div className="flex flex-col items-center justify-center space-y-1">
                <div alt="Logo"  className="object-cover rounded-full h-24 w-24">
         <svg version="1.1" id="Layer_1"  xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
	 width="100%" viewBox="0 0 538 549" fill="blue" >
<path fill={`${isDark?`#4b5563`:`white`}`} opacity="1.000000" stroke="none" 
d="M345.000000,550.000000 
	C231.525970,550.000000 118.551926,549.981201 5.577993,550.085327 
	C1.975468,550.088623 0.891710,549.507812 0.894363,545.579895 
	C1.016040,365.454712 1.015277,185.329437 0.894008,5.204280 
	C0.891497,1.475514 1.810384,0.911234 5.293886,0.913184 
	C181.753265,1.011951 358.212677,1.010466 534.672058,0.921805 
	C538.057068,0.920105 539.115967,1.344288 539.113220,5.170268 
	C538.983337,185.462051 538.986389,365.753967 539.099915,546.045776 
	C539.102112,549.560242 538.282043,550.096313 534.955811,550.089905 
	C471.804047,549.968018 408.652008,550.000000 345.000000,550.000000 
z"/>
<path fill={`${isDark?`#d1d5db`:`#2563eb`}`} opacity="1.000000" stroke="none" 
	d="
M254.969162,114.825836 
	C257.940582,106.083260 264.383881,100.109711 269.425903,93.204147 
	C271.732544,90.044937 273.073059,92.870041 274.319641,94.341370 
	C283.795837,105.525871 293.211823,116.761444 302.632385,127.993027 
	C327.895447,158.112778 353.080414,188.298706 378.504364,218.282013 
	C381.519653,221.838028 381.226379,223.514603 377.812988,226.358383 
	C368.184509,234.380112 368.203796,234.622025 360.230774,225.160736 
	C335.326599,195.607971 310.511536,165.980133 285.657410,136.385193 
	C285.044250,135.655090 284.378387,134.969284 282.834900,134.608261 
	C283.869873,140.712738 284.868744,146.823578 285.945251,152.920700 
	C302.160004,244.758347 318.245941,336.619263 334.810333,428.393829 
	C336.577759,438.186340 330.207092,443.719360 326.753662,450.885071 
	C325.644257,453.187012 323.765442,451.071228 322.530182,450.361206 
	C300.143250,437.493469 277.803406,424.543854 255.443405,411.629272 
	C224.858047,393.963898 194.293594,376.261902 163.647522,358.702423 
	C157.957535,355.442261 152.063553,352.492950 146.267899,349.456665 
	C142.185425,347.317871 142.182480,345.937073 143.889709,342.459137 
	C159.086655,311.500458 174.159088,280.480652 189.278107,249.483673 
	C211.117630,204.708344 232.965469,159.937042 254.969162,114.825836 
z"/>
<path fill={`${isDark?`#4b5563`:`white`}`} opacity="1.000000" stroke="none" 
	d="
M249.904205,268.054871 
	C262.779327,275.469635 275.316803,282.739624 287.928741,289.878082 
	C290.717041,291.456268 292.371857,293.346954 292.949341,296.684479 
	C300.016357,337.528168 307.223694,378.347534 314.387085,419.174561 
	C314.641357,420.623932 314.817230,422.087036 315.060455,423.754974 
	C312.760101,424.291901 311.391144,422.861633 309.945923,422.028076 
	C263.335205,395.145172 216.773621,368.176880 170.107925,341.389893 
	C166.568314,339.358063 166.488312,337.646606 168.106735,334.357727 
	C181.933914,306.259003 195.677902,278.118744 209.274200,249.907745 
	C210.918137,246.496719 212.204926,246.090988 215.450073,248.042633 
	C226.726074,254.824066 238.196747,261.281830 249.904205,268.054871 
z"/>
<path fill={`${isDark?`#4b5563`:`white`}`} opacity="1.000000" stroke="none" 
	d="
M284.862671,251.164490 
	C285.812286,256.960846 286.705017,262.328247 287.795685,268.885956 
	C280.716858,264.814392 274.581818,261.293488 268.454224,257.759674 
	C253.320206,249.031815 238.203125,240.274384 223.042633,231.592712 
	C220.826447,230.323608 219.251007,229.384476 220.776840,226.285370 
	C235.034134,197.327499 249.155014,168.302475 263.327026,139.302582 
	C263.465210,139.019791 263.761139,138.814102 264.741577,137.748291 
	C271.508545,175.855072 278.157135,213.295303 284.862671,251.164490 
z"/>
</svg>
         </div>
                  <h2 className="text-2xl font-bold text-center text-blue-700 dark:text-gray-100 mt-10">Login to Assam Employment</h2>
                </div>
                
                
                <div className="relative bg-inherit w-full h-[10%]  border-2 border-blue-700 dark:border-gray-500 p-2 rounded-lg">
                  <label
                    htmlFor="username"
                    className={`absolute bg-inherit  text-blue-700 dark:text-gray-100 left-2 transition-all ${userNameStyle} `}
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
                 

               <div className="relative bg-inherit w-full h-[10%]  border-2 border-blue-700 dark:border-gray-500 p-2 rounded-lg">
                  <label
                    htmlFor="password"
                    className={`absolute left-2 bg-inherit text-blue-700 dark:text-gray-100 transition-all ${passwordStyle} `}
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
                    className="outline-none bg-inherit text-blue-700 dark:text-gray-100 w-full transition-opacity p-2"
                  />
                </div>
              <div className="flex flex-col gap-1 flex-grow">

            <div className="flex justify-start items-start flex-grow">
            <Link className="text-blue-700 dark:text-gray-100 hover:font-bold" to="/forgotPassword">Forgot your password?</Link>
            </div>
              {errMessage && <p className="text-red-500">{errMessage}</p>}
              </div>
                <section className=" focus-within:border-blue-700 flex flex-col flex-grow gap-2 items-center">
                    <div className='flex flex-row w-[100%] gap-2 justify-center'>
                        <button className="flex justify-center items-center py-2 shadow-md bg-blue-700 hover:bg-blue-600 dark:bg-gray-100  dark:hover:bg-blue-200 text-white dark:text-blue-700 dark:hover:text-gray-700  rounded-lg transition-opacity p-2 text-lg w-[30%]"
                         onClick={handleLogin} 
                         disabled={!canSave}
                         >Login</button>
                        <Link to="/signup" className="flex justify-center items-center py-2 shadow-md bg-blue-700 hover:bg-blue-600 dark:bg-gray-100  dark:hover:bg-blue-200 text-white dark:text-blue-700 dark:hover:text-gray-700  rounded-lg transition-opacity p-2 text-lg w-[30%] ">
                           Sign Up
                        </Link>
                    </div>
                    <p className="text-blue-700 dark:text-gray-100">Or</p>
                    <button className=" text-lg   flex flex-row   w-[70%] justify-center items-center  py-2 border-[1px] border-blue-700 bg-white dark:bg-gray-100 hover:bg-blue-100 dark:hover:bg-blue-200 text-blue-700 hover:text-blue-900 rounded-lg transition-opacity" onClick={() => login()}>
                      <span className="mx-auto flex flex-row gap-1">Login with Google
                       <svg className=' h-5 w-5 my-auto' xmlns="http://www.w3.org/2000/svg" width="2443" height="2500" preserveAspectRatio="xMidYMid" viewBox="0 0 256 262" id="google"><path fill="#4285F4" d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"></path>
                       <path fill="#34A853" d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"></path><path fill="#FBBC05" d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"></path><path fill="#EB4335" d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"></path></svg></span></button>
                </section>
                <p className="text-blue-700 dark:text-gray-100 text-sm">By continuing with login or sign up process, you agree to our <a href='/terms' target="_blank" className="font-bold underline">Terms of Service</a> and that you have read our   <a href='/privacy' target="_blank" className="font-bold underline">Privacy Policy</a></p>
            </div>}
        </div>
    );
}

export default React.memo(Login);
