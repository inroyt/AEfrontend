import React,{ useState,useRef, useEffect,useMemo } from 'react';
import {googleLogout} from '@react-oauth/google';
import api from '../../api/data';
import { useSelector,shallowEqual } from 'react-redux';
import { useDispatch } from 'react-redux';
import { clearUser,clearOtherUser,setOtherUser,addFollowing,removeFollowing,blockUser,setActiveProfileTab } from './userSlice';
import {  useParams,useNavigate,Link} from 'react-router-dom';
import Prompt from './Prompt';
import Followers from './Followers';
import Following from './Following';
import SavedPostList from './SavedPostList';
import OwnPostList from './OwnPostList';
import CommentList from './CommentList';
const TabContent = ({ children, isActive }) => {
  return isActive ? <div className="w-full h-full overflow-y-auto bg-white dark:bg-gray-600  px-2">{children}</div> : null;
};
const ProfilePage = () => {
  const { linkname } = useParams(); 
  const { user: profile, otherUser: otherProfile } = useSelector(state => state.user, shallowEqual);
  const profileId = profile._id;
  const otherProfileId = otherProfile._id
  const followersCount = useMemo(() => profile?.followers?.length ?? 0, [profile]);
  const followingCount = useMemo(() => profile?.following?.length ?? 0, [profile]);
  const OFollowersCount = useMemo(() => otherProfile?.followers?.length ?? 0, [otherProfile]);
  const OFollowingCount = useMemo(() => otherProfile?.following?.length ?? 0, [otherProfile]);
  const isOwnProfile = useMemo(() => Boolean(profileId === otherProfileId), [profileId, otherProfileId]);
  const isFollowing = useMemo(() => (profile?.following || []).includes(otherProfile?._id), [profile, otherProfile]);
  const isLoading=useMemo(() => (otherProfile.linkname===linkname),[otherProfile,linkname]);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [followingTooltip,setFollowingTooltip]=useState(false);
  const [isProfileTooltip,setProfileToolTip]=useState(false);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const activeTab=useSelector(state=>state.user.activeTab);
  const [activeTabF, setActiveTabF] = useState('');
  const buttonRef = useRef(null);
  const profileButtonRef= useRef(null);
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
    // Function to open the modal
  const openModal_forBlock = (e) => {
    e.stopPropagation();
    setIsBlockModalOpen(true);
   
  };

  // Function to close the modal
  const closeModal_forBlock = () => {
    dispatch(blockUser(profile._id,otherProfile._id));
    setIsBlockModalOpen(false);
    history(`/profile/${profile.linkname}`);

  };
  const cancelBlockModal=() => {
    setIsBlockModalOpen(false);
  }
  const handleTabChange = (tab) => {
       setActiveTabF(tab);
  } 

 //console.log("check own profile:",isOwnProfile,profile,otherProfile);
 useEffect(() => {
  const fetchAndSetOtherProfile = async () => {
    setIsProfileLoading(true);
    try {
      if (isOwnProfile) {
        dispatch(setOtherUser(profile));
      }
      if (linkname !== undefined) {
        const response = await api.get(`/api/profile/${linkname}`, { withCredentials: true });
        if (response.status === 200) {
          dispatch(clearOtherUser());
          dispatch(setOtherUser(response.data));
        }
      }
    } catch (error) {
      console.log(error);
    }finally {
      setIsProfileLoading(false);
    }
  };

  fetchAndSetOtherProfile();
}, [linkname,isOwnProfile, dispatch]);


  useEffect(() => {// to close the tooltip upon clicking anywhere in the page
    const handleDocumentClick = (event) => {
      if (followingTooltip) {
        // Check if the clicked element is not the button itself
        if (buttonRef.current && !buttonRef.current.contains(event.target)) {
          // Close the tooltip if it's open and the click is outside the button
         setFollowingTooltip(false);
        }
      }
    };
  
    document.addEventListener('click', handleDocumentClick);
  
    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, [followingTooltip]);

  useEffect(() => {// to close the tooltip upon clicking anywhere in the page
    const handleDocumentClick = (event) => {
      if (isProfileTooltip) {
        // Check if the clicked element is not the button itself
        if (profileButtonRef.current && !profileButtonRef.current.contains(event.target)) {
          // Close the tooltip if it's open and the click is outside the button
          setProfileToolTip(false)
        }
      }
    };
  
    document.addEventListener('click', handleDocumentClick);
  
    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, [isProfileTooltip]);

  const handleTabClick = (tabIndex) => {
    dispatch(setActiveProfileTab(tabIndex));
  };
  const Tab = ({ label, isActive, onClick }) => {
    return (
      <button
        className={`px-4 py-2 ${isActive ? 'text-blue-700 dark:text-white border-b-2 border-blue-700 dark:border-white transition-transform duration-300' : 'border-b-2 border-transparent dark:text-gray-300 dark:hover:text-white hover:text-blue-800 '}`}
        onClick={onClick}
      >
        {label}
      </button>
    );
  };
  useEffect(()=>{
    if(isOwnProfile) {return setActiveTabF('');}
  if (isProfileLoading) return;
    if(!isOwnProfile) { 
      dispatch(setActiveProfileTab(2));
    }
    return ()=>{
      //dispatch(setActiveProfileTab(1));
      setActiveTabF('');
    }
  },[isOwnProfile,isProfileLoading,dispatch]);
  const contentRef = useRef(null);

  // State to manage dynamic height for animation
  const [maxHeight, setMaxHeight] = useState('0');
    useEffect(() => {
        if (contentRef.current) {
          setMaxHeight(`${contentRef.current.scrollHeight}px`); // Set max height dynamically based on content
        }
      }, [followingTooltip]);
  return (
    <div className="min-w-min lg:max-w-[60%] mx-auto  h-screen  lg:py-14 lg:flex lg:items-center">
    {isLoading?
    <div className="w-full h-full bg-white dark:bg-gray-600  shadow-lg rounded-md overflow-hidden flex flex-col mt-14">
        <div className="flex flex-col gap-1 justify-start px-3 py-4 bg-gradient-to-r from-blue-500 dark:from-slate-600 via-blue-600 dark:via-slate-700 to-blue-700 dark:to-slate-800 ">
            {otherProfile?.picture? <img className="h-16 w-16 object-cover rounded-full" src={isOwnProfile?profile?.picture:otherProfile?.picture} alt="user " />:
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
               </svg> 
               }
            <div className="flex  gap-4 ">
              <p className="text-white text-start font-bold ">{isOwnProfile?profile.name:otherProfile.name}</p>
                {!isOwnProfile&& <>
                {isFollowing?<div><button onClick={()=>{setFollowingTooltip(!followingTooltip)}}  ref={buttonRef}  className=" rounded-lg flex  bg-blue-700 hover:bg-blue-800 text-white text-base w-32 h-7 items-center justify-center gap-2">
                
                      <span >Following</span>
                      <div  className={`transform ease-in transition-transform duration-300 h-6 w-6 ${followingTooltip ? 'rotate-180':'rotate-0'}`}>
                      <svg aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19.5 8.25l-7.5 7.5-7.5-7.5" strokeLinecap="round" strokeLinejoin="round"></path> 
                      </svg></div>
                      
</button>
<div
  ref={contentRef}
  style={{
  maxHeight: followingTooltip  ? maxHeight : '0', // Apply dynamic height
  transition: 'max-height 300ms ease-in-out, opacity 300ms ease-in-out',
  opacity: followingTooltip  ? '1' : '0'
  }}
  className="overflow-hidden bg-blue-50 dark:bg-gray-700 rounded-md mt-1 absolute w-32" 
  >
    <div className="flex flex-col justify-between items-center gap-4 my-6">
      <button
        onClick={() => {
          dispatch(removeFollowing(profileId, otherProfileId));
          setFollowingTooltip(false);
        }}
        className="w-[100px] h-7 text-center rounded-lg py-auto hover:bg-blue-200 flex gap-2 mx-auto justify-center text-blue-900 dark:text-white dark:hover:text-gray-900"
      >
        Unfollow
      </button>
      <button
        onClick={(e) => openModal_forBlock(e)}
        className="w-[100px] h-7 text-center rounded-lg py-auto hover:bg-blue-200 flex gap-2 mx-auto justify-center text-blue-900 dark:text-white dark:hover:text-gray-900"
      >
        Block
      </button>
      <Prompt
        isOpen={isBlockModalOpen}
        message={"Do you want to block this user?"}
        closeModal={closeModal_forBlock}
        cancelModal={cancelBlockModal}
      />
    </div>
  </div>

</div>
                      :<button  onClick={()=>{
                        if(profileId){
                          dispatch(addFollowing(profileId, otherProfileId));setFollowingTooltip(false);
                          }else{
                            history('/login')
                          }}} className="border-[1px] border-blue-400 rounded-lg flex py-auto bg-blue-700 hover:bg-blue-700 text-white text-base w-32 h-7 items-center justify-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="my-auto w-6 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                          </svg><span>Follow</span>
                          </button>}
                        
                          <button
                          onClick={()=>{
                          profile.linkname!==undefined
                          ? history(`/profile/${profile.linkname}/message/${otherProfile.linkname}`)
                          : history('/login');
                          }}
                          className=" rounded-lg  flex bg-white hover:bg-blue-50 text-blue-700 text-base w-32 h-7 items-center  justify-center gap-2">
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="my-auto w-6 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                 </svg>
                                   Message
                          </button>
                            </>}
                         </div>
                        {profile.education&& <div className="flex gap-1 items-center ">
                             <div className="w-5 h-5 text-gray-100">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" >
                                 <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                              </svg>
                             </div>
                             <h3 className="text-gray-100 font-sm">{profile.education}</h3>
                         </div>}
                         {profile.organization&& <div className="flex gap-1 items-center ">
                             <div className="w-5 h-5 text-gray-100">
                             <svg data-slot="icon" aria-hidden="true" fill="none" strokeWidth="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" strokeLinecap="round" strokeLinejoin="round"></path>
                            </svg>
                             </div>
                             <h3 className="text-gray-100 font-sm">{profile.organization}</h3>
                         </div>}
                         {profile.location&&<div className="flex gap-1  items-center">
                             <div className="w-5 h-5 text-gray-100">
                               <svg  data-slot="icon" aria-hidden="true" fill="none" strokeWidth="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" strokeLinecap="round" strokeLinejoin="round"></path>
                                 <path d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" strokeLinecap="round" strokeLinejoin="round"></path>
                               </svg>
                             </div>
                             <h3 className="text-gray-100 font-sm">{profile.location}</h3>
                         </div>}
            <div className="flex items-center gap-4  ">
                <button  
                className={`flex font-bold h-full py-1 ${activeTabF==="followers"?`text-white border-b-2 `:`text-gray-200`} hover:text-white `}  onClick={() => handleTabChange('followers')}>
                  {isOwnProfile?`${followersCount} ${followersCount<=1? 'Follower':'Followers' }`:`${OFollowersCount} ${OFollowersCount<=1? 'Follower':'Followers' }`}
                </button>
                <button  
                className={`flex font-bold h-full py-1 ${activeTabF==="following"?`text-white border-b-2`:`text-gray-200`} hover:text-white `} onClick={() => handleTabChange('following')}>
                {isOwnProfile? `${followingCount}`:`${OFollowingCount}`} Following</button>
               
               {isOwnProfile&&<Link to={`/profile/${profile.linkname}/addPostMenu`} className="h-full py-1 text-gray-200 font-bold hover:text-white  flex items-center border-b-2 border-transparent">  
               <div className="w-6 h-6 flex items-center">  <svg data-slot="icon" aria-hidden="true" fill="none" strokeWidth="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 4.5v15m7.5-7.5h-15" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg></div>Post</Link>}
   
            </div>
            {activeTabF.length!==0
            &&<button className="flex items-center gap-2 px-1 py-2  text-gray-100 hover:text-white"
            onClick={()=>setActiveTabF('')}
            >
               <div className="w-6 h-6 ">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
               </svg>
                </div>
             <p>Back</p>
            </button>}
        </div>
  
   {activeTabF==="followers"?<Followers/>:activeTabF==="following"?<Following/>
    : <div className="flex flex-col h-full w-full  overflow-y-auto ">
       <div className="flex flex-col h-full w-full">
          <div className="flex h-[10%] sticky shadow-lg  justify-between">
            <div className="flex">
            {isOwnProfile&&<Tab label="Saved Posts"  isActive={activeTab === 1} onClick={() => handleTabClick(1)} />}
            <Tab label="Posts" isActive={activeTab === 2}  onClick={() => handleTabClick(2)} />
            <Tab label="Comments" isActive={activeTab === 3}  onClick={() => handleTabClick(3)} />
            </div>
            <div className="flex">
            {
                  isOwnProfile&&<div className=" px-2 flex items-center justify-between">
                  <button ref={profileButtonRef} onClick={() =>{setProfileToolTip(!isProfileTooltip)}}
                      className="my-auto w-5 h-5  mx-2 rounded-full hover:bg-blue-100 dark:text-gray-300 hover:dark:text-gray-900">
                      <svg aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5"  viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" strokeLinecap="round" strokeLinejoin="round"></path>
                    </svg>
                  </button>
                   
                  </div>}
                  {isProfileTooltip&&
                    (
                      <div className={`absolute  dark:border-0 w-32 ${profile.name==='Prabin Roy'? 'h-52':'h-32'} right-2 lg:right-0 top-14 lg:top-12 bg-blue-600 dark:bg-gray-500 rounded-lg z-10`}>
                        <div className="absolute w-4 h-4 bg-inherit border-inherit transform rotate-45 -top-1 left-3/4"
                            style={{ marginLeft: '-1px' }} // Corrected to use an object for inline styles
                        ></div>
                        <div className="flex flex-col flex-grow justify-between items-center gap-4 my-6">
                        <Link to={`/profile/${profile.linkname}/edit`} className="text-gray-100 flex hover:text-blue-700 hover:bg-white p-1 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className='w-6 h-6'>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                            </svg>Edit profile</Link>
                        <button className="text-gray-100 flex hover:text-blue-700 hover:bg-white p-1 rounded-lg" onClick={logOut}>
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                    </svg> Log out</button>
                       {profile.name==="Prabin Roy"&&<Link 
                        to={`/profile/${profile.linkname}/supportQuery`}
                       className="text-gray-100 flex hover:text-blue-700 hover:bg-white p-1 rounded-lg" >
                        <svg data-slot="icon" aria-hidden="true" fill="none" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6"  viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z" strokeLinecap="round" strokeLinejoin="round"></path>
                      </svg>
                   Queries
                   </Link>}
                      
                   {profile.name==="Prabin Roy"&&<Link 
                        to={`/profile/${profile.linkname}/applyList`}
                       className="text-gray-100 flex hover:text-blue-700 hover:bg-white p-1 rounded-lg" >
                        <svg data-slot="icon" aria-hidden="true" fill="none" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6"  viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z" strokeLinecap="round" strokeLinejoin="round"></path>
                      </svg>
                  Apply List
                   </Link>}

                        </div>
                        
                      </div>
                    )}
            </div>
          </div>
          <div className="h-[90%]">
            {isOwnProfile&&<TabContent isActive={activeTab === 1}><SavedPostList/></TabContent>}
            <TabContent isActive={activeTab === 2}><OwnPostList/></TabContent>
            <TabContent isActive={activeTab === 3}><CommentList/></TabContent>
          </div>
      </div>
    </div>}

   
   
    </div>: <div className="flex min-w-full h-full gap-4  mx-auto  bg-inherit  rounded-md items-center justify-center"><svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-white fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
    </svg>
    <span className="sr-only"></span>Loading...</div>}
    </div>
  )
}
export default React.memo(ProfilePage);
