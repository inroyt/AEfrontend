import { NavLink,Link,useNavigate } from "react-router-dom";
import React,{useState,useEffect,useCallback,useMemo,useRef} from 'react';
import DarkMode from "./DarkMode";
import Search from "./Search";
import { useSelector,useDispatch,shallowEqual } from 'react-redux';
import { setUser,clearUser,clearOtherUser} from '../redux/user/userSlice';
import api from '../api/data';
import Onetap from "./Onetap";
import {googleLogout} from '@react-oauth/google';
import Tooltip from "./Tooltip";
import { generateColor } from './ColourMap';
const Header = () => {
 // const [isDark, setIsDark] = useState(false); 
  const isDark=useSelector((state) => state.user.isDarkMode); 
  const profile=(useSelector((state) => state.user,shallowEqual)).user;
  const isProfile = useMemo(() => Boolean(Object.keys(profile).length > 1), [profile]);
  const isPicture = useMemo(() => profile.hasOwnProperty('picture'), [profile]);
  const profilePicture = useMemo(() => profile.picture, [profile]);

  const [profileToolTip,setProfileTooltip] = useState(false);

  const buttonRef = useRef(null);
  const history=useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const logOut = async () => {
    try{
      googleLogout();
      const response=await api.get('/api/logout', { withCredentials: true });//console.log(response)
      if(profile===undefined){
        history('/Login');
      }
      if(response.status===200){
        dispatch(clearUser());
        dispatch(clearOtherUser());
        history('/Login');
        setProfileTooltip(!profileToolTip)
      }
    }catch(err){
      console.error(err); 
    }
  }
{ /* useEffect(()=>{
    console.log('isDark:', isDark);
  },[isDark])*/}
    useEffect(() => {
      const handleDocumentClick = (event) => {
        if (profileToolTip) {
          // Check if the clicked element is not the button itself
          if (buttonRef.current && !buttonRef.current.contains(event.target)) {
            // Close the tooltip if it's open and the click is outside the button
           setProfileTooltip(false);
          }
        }
      };
    
      document.addEventListener('click', handleDocumentClick);
    
      return () => {
        document.removeEventListener('click', handleDocumentClick);
      };
    }, [profileToolTip]);
 

    const handleProfile = useCallback(async () => {
      try {
        const response = await api.get('/api/profile', { withCredentials: true });
        if (response.status === 200) {
          dispatch(setUser(response.data));
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }, [dispatch]);
  
    useEffect(() => {
      handleProfile();
    }, [handleProfile]);
   
  return (
    <header className="fixed top-0 bg-white dark:bg-slate-700 min-w-full h-14 my-auto flex items-center justify-between drop-shadow-md z-10  text-gray-600 ">
        {/*Header Title */}
        {!loading && !isProfile && <Onetap isProfile={isProfile} />}
         <div className='w-full flex space-x-0 lg:mx-10 sm:mx-4 mx-2'>
         <div alt="Logo"  className="object-cover rounded-full h-8 w-8 my-auto ">
         <svg version="1.1" id="Layer_1"  xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
	 width="100%" viewBox="0 0 538 549" fill="#1d4ed8" >
<path fill={`${isDark?`#334155`:`white`}`} opacity="1.000000" stroke="none" 
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
<path fill={`${isDark?`white`:`#1d4ed8`}`} opacity="1.000000" stroke="none" 
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
<path fill={`${isDark?`#334155`:`white`}`} opacity="1.000000" stroke="none" 
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
<path fill={`${isDark?`#334155`:`white`}`} opacity="1.000000" stroke="none" 
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
          <NavLink to="/" className="font-kaushan text-xl my-auto text-blue-700 dark:text-gray-100">
            AssamEmployment</NavLink>
         </div>
         {/*Primary Search Component*/}
         <Search/>
   <div className="hidden md:flex items-center w-full justify-center lg:gap-4 gap-2 mx-16 md:mx-10 ">

    <div className="hidden md:flex items-center justify-evenly lg:gap-4 gap-2 ">
      
    
{/*Inbox */}
      <button 
        onClick={()=>{
        profile.linkname!==undefined
        ? history(`/profile/${profile.linkname}/inbox`)
        : history('/login');}}
       title="Inbox" className="w-7 h-7 rounded-full flex justify-center items-center transition-opacity hover:bg-slate-100 dark:text-gray-300 dark:hover:text-black">
      <div className=" h-5 w-5 ">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" >
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
       </svg>
      </div>
      </button>
    {/*DarkMode*/}
  <DarkMode />
    {/*Login and Profile icons*/}
      {isPicture&&isProfile? 
      (
        <div title="Profile" className="flex justify-between items-center">
          <Link to={`/profile/${profile.linkname}`}>
            <div className="w-7 h-7 rounded-full flex justify-center items-center transition-opacity hover:bg-slate-100 dark:text-gray-300 dark:hover:text-black">
            <img src={profilePicture} className="object-cover h-5 w-5  my-auto rounded-full "/>
            </div>
           
            </Link>
          <button onClick={()=>{setProfileTooltip(!profileToolTip);}} ref={buttonRef} 
             className="my-auto w-5 h-5 hover:bg-slate-200 mx-2 rounded-full dark:text-gray-300 hover:dark:text-gray-900">
            <svg aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5"  viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
           <path d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" strokeLinecap="round" strokeLinejoin="round"></path>
          </svg>
          </button>
        </div>
      )
      :isProfile?
      (
        <div title="Profile" className="flex">
      <Link to={`/profile/${profile.linkname}`} className={'transition duration-300 ease-out my-auto w-5 h-5 text-gray-900 dark:text-gray-300 flex items-center justify-center'}>
      <div className={`${generateColor(profile?.name?.[0]?.toUpperCase())} object-fill  h-5  w-5  rounded-full text-white flex items-center justify-center text-center`}
                   
                   >
                   {profile?.name?.[0]?.toUpperCase()}
                  </div>
      </Link>
      <button onClick={()=>{setProfileTooltip(!profileToolTip);}} ref={buttonRef} 
             className="my-auto w-5 h-5 hover:bg-slate-200 mx-2 rounded-full dark:text-gray-300 hover:dark:text-gray-900">
            <svg aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5"  viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
           <path d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" strokeLinecap="round" strokeLinejoin="round"></path>
          </svg>
          </button>
      </div>
      ):
      (
        <Link title="Login" to="/login"  className={'transition-opacity  w-8 h-8 hover:bg-slate-100  dark:hover:text-black rounded-full flex justify-center items-center dark:text-gray-300'}>
<div className="w-5 h-5">
<svg aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" strokeLinecap="round" strokeLinejoin="round"></path>
</svg>
</div>
      </Link>
      )}
    </div>
    {/*Profile ToolTip */}
   
<Tooltip profileToolTip={profileToolTip} setProfileTooltip={setProfileTooltip}
    logOut={logOut}  profile={profile} />
    {/*Navbar items*/}
     <div className="flex items-center justify-evenly gap-2 lg:gap-8 mt-[6px]">
     <NavLink to="/"  className={(navData) => (navData.isActive ? 
     'flex  border-b-2 border-blue-700 dark:border-gray-200 text-blue-700 dark:text-white dark:bg-inherit transition duration-300 ease-out py-3 px-1 gap-1 z-10 ' 
     :"flex py-3 px-1 hover:text-blue-700 transition duration-300 border-b-2 border-transparent gap-1 z-10  dark:text-gray-300  dark:hover:text-white")}>
      <svg aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="mx-auto w-5 h-5" xmlns="http://www.w3.org/2000/svg">
      <path d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" strokeLinecap="round" strokeLinejoin="round"></path>
      </svg>
      <p>Home</p></NavLink>
     <NavLink to="/social"    className={(navData) => (navData.isActive ? 
     'flex  border-b-2 border-blue-700 dark:border-gray-200 text-blue-700 dark:text-white dark:bg-inherit transition duration-300 ease-out py-3 px-1 gap-1 z-10 ' 
     :"flex py-3 px-1 hover:text-blue-700 transition duration-300 border-b-2 border-transparent gap-1 z-10  dark:text-gray-300  dark:hover:text-white")}>
     <svg aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"  className="mx-auto w-5 h-5" xmlns="http://www.w3.org/2000/svg">
     <path d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" strokeLinecap="round" strokeLinejoin="round"></path>
     </svg>
      <p>Social</p></NavLink>
    {/*<NavLink to="/service"    className={(navData) => (navData.isActive ? 
     'flex  border-b-2 border-blue-700 dark:border-gray-200 text-blue-700 dark:text-white dark:bg-inherit transition duration-300 ease-out py-3 px-1 gap-1 z-10 ' 
     :"flex py-3 px-1 hover:text-blue-700 transition duration-300 border-b-2 border-transparent gap-1 z-10  dark:text-gray-300  dark:hover:text-white")}>
    <svg aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"  className="mx-auto w-5 h-5" xmlns="http://www.w3.org/2000/svg">
  <path d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" strokeLinecap="round" strokeLinejoin="round"></path>
</svg>
    <p>Resources</p></NavLink>*/}
    <NavLink to="/about"    className={(navData) => (navData.isActive ? 
     'flex  border-b-2 border-blue-700 dark:border-gray-200 text-blue-700 dark:text-white dark:bg-inherit transition duration-300 ease-out py-3 px-1 gap-1 z-10 ' 
     :"flex py-3 px-1 hover:text-blue-700 transition duration-300 border-b-2 border-transparent gap-1 z-10  dark:text-gray-300  dark:hover:text-white")}>
      <p>About</p></NavLink>
     </div>
    </div>
    {/*Secondary search Box and button */}

    {/*Sliding NavBar when viewed on small screen devices*/}
  
  </header>
  )
}

export default React.memo(Header);

/**
 * 
 *  
 */