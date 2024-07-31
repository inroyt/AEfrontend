import DarkMode from "./DarkMode";
import { NavLink,Link,useNavigate } from "react-router-dom";
import React,{useState,useEffect,useMemo,useRef} from 'react';
import { useSelector,useDispatch,shallowEqual } from 'react-redux';
import api from '../api/data';
import {googleLogout} from '@react-oauth/google';
import { clearUser,clearOtherUser } from '../redux/user/userSlice';
import { generateColor } from './ColourMap';


const Menu = () => {
    const genericHamburgerLine = `h-[2px] w-7 my-1 rounded-full bg-blue-700  dark:bg-gray-100 transition ease transform duration-300`;
    const buttonRef = useRef(null);
    const [profileToolTip,setProfileTooltip] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const profile=(useSelector((state) => state.user,shallowEqual)).user;
    const isProfile = useMemo(() => Boolean(Object.keys(profile).length > 1), [profile]);
    const isPicture = useMemo(() => profile.hasOwnProperty('picture'), [profile]);
    const profilePicture = useMemo(() => profile.picture, [profile]);
    const isTopReached = useSelector((state) => state.post.isTopReached)
    const history=useNavigate();
    const dispatch = useDispatch();
    const logOut = async() => {
      try{
        googleLogout();
        const response=await api.get('/api/logout', { withCredentials: true })
        if(response.status===200){
          dispatch(clearUser());
          dispatch(clearOtherUser());
          history('/login');
        }else{
          console.log("Error in logging out")
        }
      }catch(err){
        console.error(err);
      }
   
      
  };
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
  return (
    <div className={`fixed top-1 right-0 transition-transform ease-in duration-300 ${isTopReached?'z-10':'z-20'}`} >
        
          <div className=" text-3xl md:hidden focus:outline-none right-2   ">
           <button className="flex flex-col h-12 w-12  justify-center items-center my-auto" onClick={() =>setIsOpen(!isOpen)}>
             <div className={`${genericHamburgerLine} ${isOpen
                  ? "rotate-45 translate-y-[10px] opacity-90 group-hover:opacity-100"
                  : "opacity-90 group-hover:opacity-100"
          }`}
      />
      <div className={`${genericHamburgerLine} ${isOpen ? "opacity-0" : "opacity-90 group-hover:opacity-100"}`} />
      <div className={`${genericHamburgerLine} ${
              isOpen
                  ? "-rotate-45 -translate-y-[10px] opacity-90 group-hover:opacity-100"
                  : "opacity-90 group-hover:opacity-100"
          }`}
      />
  </button>
         </div>
         {isOpen && (
  <div className="fixed z-[-10] md:hidden inset-0 min-h-screen bg-black opacity-20 transition-opacity ease-in duration-300 " onClick={() => setIsOpen(!isOpen)}></div>
)}

<div
  className={`md:hidden fixed right-0 top-0 min-h-screen  w-64 bg-slate-50 dark:bg-gray-600 transform ease-in transition-transform duration-300 ${
    isOpen ? 'translate-x-0 ' : 'translate-x-full'
  }`}
  style={{zIndex:-10 }}
>
      
  
      
        <nav className="pt-16 px-4 flex flex-col gap-3" >
        
        <div className="flex flex-col items-center justify-evenly  gap-8 ">
          <DarkMode />
      {isPicture&&isProfile? 
      (
        <div className="flex justify-between items-center gap-2 dark:text-gray-300  dark:hover:text-white">
          <Link to={`/profile/${profile.linkname}`} onClick={()=>setIsOpen(!isOpen)}>
            <div className="h-7 w-7 my-auto">
            <img src={profilePicture} className="object-cover rounded-full"/>
            </div>
           
            </Link>
          <button onClick={()=>setProfileTooltip(!profileToolTip)} ref={buttonRef}  className="my-auto w-5 h-7 hover:bg-slate-200 dark:text-white dark:hover:text-gray-900 mx-2 rounded-full">
         
            <svg aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5"  viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
           <path d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" strokeLinecap="round" strokeLinejoin="round"></path>
          </svg>
          
          
          </button>
        </div>
      )
      :isProfile?
      (
        <div title="Profile" className="flex">
      <Link to={`/profile/${profile.linkname}`} onClick={()=>setIsOpen(!isOpen)} className={'transition duration-500 ease-out my-auto w-7 h-7 text-gray-900 dark:text-gray-300 flex items-center justify-center'}>
      <div className={`${generateColor(profile?.name?.[0]?.toUpperCase())} object-fill  h-7  w-7  rounded-full text-white flex items-center justify-center text-center`}
                   
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
        <Link to="/login"  className={'flex transition duration-500 ease-out gap-1 my-auto dark:text-gray-300 hover:text-blue-700 dark:hover:text-white'} onClick={()=>setIsOpen(!isOpen)}>
     <svg aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="my-auto w-5 h-5" xmlns="http://www.w3.org/2000/svg">
  <path d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" strokeLinecap="round" strokeLinejoin="round"></path>
</svg> <p>Login</p>
      </Link>
      )}

{profileToolTip&& <div  className="absolute  border-2  dark:border-gray-500 w-48 h-56 top-28  bg-white dark:bg-gray-600 rounded-lg rounded-tr-none">
    <div className=" flex flex-col justify-between items-center gap-4 my-6">
        <Link to={`/profile/${profile.linkname}`}  onClick={()=>{setProfileTooltip(!profileToolTip);setIsOpen(!isOpen)}}
          className=" w-32 h-8 text-center rounded-lg py-[2px] hover:bg-slate-100 flex gap-2 mx-auto justify-center dark:text-white dark:hover:text-gray-900">
          <div className="h-5 w-5 my-auto">
          <svg aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" strokeLinecap="round" strokeLinejoin="round"></path>
          <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round"></path>
          </svg>
          </div>
          <p> View Profile</p>
        </Link>
        <Link to={`/profile/${profile.linkname}/edit`}  onClick={()=>{;setIsOpen(!isOpen)}}
          className=" w-32 h-8 text-center rounded-lg py-[2px] hover:bg-slate-100 flex gap-2 mx-auto justify-center  dark:text-white dark:hover:text-gray-900">
          <div className="h-5 w-5 my-auto">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
          </svg>
          </div>
          <p>Edit Profile</p>
        </Link>
        <Link to={`/profile/${profile.linkname}/followers`}  onClick={()=>{;setIsOpen(!isOpen)}}
          className=" w-32 h-8 text-center rounded-lg py-[2px] hover:bg-slate-100 flex gap-2 mx-auto justify-center  dark:text-white dark:hover:text-gray-900">    
          <div className="h-5 w-5 my-auto">
          <svg aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" strokeLinecap="round" strokeLinejoin="round"></path>
         </svg>
          </div>
          <p>Followers</p>
          </Link>
        <button onClick={()=>{logOut();setIsOpen(!isOpen);}}
        className=" w-28 h-8 text-center rounded-lg py-[2px] hover:bg-slate-100 flex gap-2 mx-auto justify-center dark:text-white dark:hover:text-gray-900">    
        <div className="h-5 w-5 my-auto">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
         </svg>
        </div>
        <p>Logout</p></button>
    </div>
    </div>}
    
   <Link to={`/profile/${profile.linkname}/inbox`} onClick={()=>setIsOpen(!isOpen)}
   className="my-auto flex gap-1 dark:text-gray-300 hover:text-blue-700 dark:hover:text-white">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"  className="my-auto h-5 w-5" strokeWidth="1.5" stroke="currentColor" >
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
       </svg>
       <p>Inbox</p>
      </Link>
      
    </div>
        <div className="flex flex-col items-center justify-evenly gap-2 lg:gap-8 mt-[6px]">
     <NavLink to="/" onClick={()=>setIsOpen(!isOpen)}  className={(navData) => (navData.isActive ? 
     'flex  border-b-2 border-blue-700  dark:border-white text-blue-700 dark:text-white dark:bg-inherit transition duration-500 ease-out py-3 px-1 gap-1' 
     :"flex py-3 px-1 hover:text-blue-700 dark:text-gray-300 dark:hover:text-white transition duration-500 border-b-2 border-transparent gap-1")}>
      <svg aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="mx-auto w-5 h-5" xmlns="http://www.w3.org/2000/svg">
      <path d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" strokeLinecap="round" strokeLinejoin="round"></path>
      </svg>
      <p>Home</p></NavLink>
     <NavLink to="/social" onClick={()=>setIsOpen(!isOpen)}  className={(navData) => (navData.isActive ? 
     'flex border-b-2 border-blue-700 dark:border-white text-blue-700 dark:text-white dark:bg-inherit transition duration-500 ease-out  py-3 px-1 gap-1' 
     :"flex  py-3 px-1 hover:text-blue-700  dark:text-gray-300 dark:hover:text-white transition duration-500 border-b-2 border-transparent gap-1")}>
     <svg aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"  className="mx-auto w-5 h-5" xmlns="http://www.w3.org/2000/svg">
     <path d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" strokeLinecap="round" strokeLinejoin="round"></path>
     </svg>
      <p>Social</p></NavLink>
    {/*<NavLink to="/service" onClick={()=>setIsOpen(!isOpen)}  className={(navData) => (navData.isActive ? 
     'flex border-b-2 border-blue-700  dark:border-white text-blue-700 dark:text-white  dark:bg-inherit transition duration-500 ease-out  py-3 px-1 gap-1' 
     :"flex  py-3 px-1 hover:text-blue-700  dark:text-gray-300 dark:hover:text-white transition duration-500 border-b-2 border-transparent gap-1")}>
    <svg aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"  className="mx-auto w-5 h-5" xmlns="http://www.w3.org/2000/svg">
  <path d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" strokeLinecap="round" strokeLinejoin="round"></path>
</svg>
    <p>Resources</p></NavLink>*/}
    <NavLink to="/about" onClick={()=>setIsOpen(!isOpen)}  className={(navData) => (navData.isActive ? 
     'flex border-b-2 border-blue-700  dark:border-white text-blue-700 dark:text-white  dark:bg-inherit transition duration-500 ease-out  py-3 px-1' 
     :" flex  py-3 px-1 hover:text-blue-700  dark:text-gray-300 dark:hover:text-white transition duration-500 border-b-2 border-transparent")}>About</NavLink>
     </div>
        </nav>
      </div>
      
         </div>
  )
}

export default Menu;
/**
 *  {isOpen && (
        <div className="fixed inset-0 min-h-screen bg-black opacity-30" onClick={() => setIsOpen(!isOpen)}></div>
      )}//for shadow bg
 *     <div
      className={`${
        menuTransitionClass
      } min-w-[75%] min-h-screen rounded-sm drop-shadow-md bg-zinc-50  overflow-hidden m-auto flex md:hidden flex-col gap-4 justify-center text-xl items-center `}
    >
  <div className="flex items-center justify-evenly gap-6">
       <div className="my-auto h-5 w-5" onClick={()=>{setIsOpen(!isOpen)}}>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" >
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
       </svg>
      </div>
      <DarkMode /> 
      
      {isPicture&&isProfile? 
      (
        <div className="flex">
          <NavLink to={`/profile/${profile.linkname}`} onClick={()=>{setIsOpen(!isOpen)}}><img src={profilePicture} className="h-7 w-7 object-cover rounded-full my-auto"/></NavLink>
          <button className="my-auto w-3 h-7 hover:bg-slate-200 mx-2 rounded-lg">
          <svg aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5" className="my-auto w-7 h-7 -mx-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
           <path d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" strokeLinecap="round" strokeLinejoin="round"></path>
          </svg>
          </button>
        </div>
      )
      :isProfile?
      (
        <div className="flex">
      <NavLink to={`/profile/${profile.linkname}`} onClick={()=>{setIsOpen(!isOpen)}} className={'transition duration-500 ease-out my-auto w-7 h-7'}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" >
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
       </svg>
      </NavLink>
      <button className="my-auto w-3 h-7 hover:bg-slate-200 mx-2 rounded-lg">
          <svg aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5" className="my-auto w-7 h-7 -mx-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
           <path d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" strokeLinecap="round" strokeLinejoin="round"></path>
          </svg>
          </button>
      </div>
      
      ):
      (
        <NavLink to="/login" onClick={()=>{setIsOpen(!isOpen)}} className={'transition duration-500 ease-out my-auto w-5 h-5'}>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
      </svg>
      </NavLink>
      )}
  
    </div>

  <NavLink to="/" onClick={()=>{setIsOpen(!isOpen)}} className={(navData) => (navData.isActive ? 
     'flex  border-b-2 border-blue-700 text-blue-700 dark:bg-inherit transition duration-500 ease-out py-3 px-1 gap-1' 
     :"flex py-3 px-1 hover:text-blue-700 transition duration-500 border-b-2 border-transparent gap-1")}>
      <svg aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="mx-auto w-5 h-5" xmlns="http://www.w3.org/2000/svg">
      <path d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" strokeLinecap="round" strokeLinejoin="round"></path>
      </svg>
      <p>Home</p></NavLink>
     <NavLink to="/about" onClick={()=>{setIsOpen(!isOpen)}}  className={(navData) => (navData.isActive ? 
     'flex border-b-2 border-blue-700 text-blue-700 dark:bg-inherit transition duration-500 ease-out  py-3 px-1 gap-1' 
     :"flex  py-3 px-1 hover:text-blue-700 transition duration-500 border-b-2 border-transparent gap-1")}>
     <svg aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"  className="mx-auto w-5 h-5" xmlns="http://www.w3.org/2000/svg">
     <path d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" strokeLinecap="round" strokeLinejoin="round"></path>
     </svg>
      <p>Social</p></NavLink>
    <NavLink to="/service" onClick={()=>{setIsOpen(!isOpen)}}  className={(navData) => (navData.isActive ? 
     'flex border-b-2 border-blue-700 text-blue-700   dark:bg-inherit transition duration-500 ease-out  py-3 px-1 gap-1' 
     :"flex  py-3 px-1 hover:text-blue-700 transition duration-500 border-b-2 border-transparent gap-1")}>
    <svg aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"  className="mx-auto w-5 h-5" xmlns="http://www.w3.org/2000/svg">
  <path d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" strokeLinecap="round" strokeLinejoin="round"></path>
</svg>
      <p>Resources</p></NavLink>
    <NavLink to="/contact" onClick={()=>{setIsOpen(!isOpen)}}  className={(navData) => (navData.isActive ? 
     'flex border-b-2 border-blue-700 text-blue-700   dark:bg-inherit transition duration-500 ease-out  py-3 px-1' 
     :" flex  py-3 px-1 hover:text-blue-700 transition duration-500 border-b-2 border-transparent")}>About</NavLink>
</div>

 */