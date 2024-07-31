import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {Link} from 'react-router-dom';
import { generateColor } from '../../components/ColourMap';
import { getFollowers,clearFollowers } from './userSlice';
const Followers = () => {

  const dispatch = useDispatch();
  const profile = (useSelector((state) => state.user)).user;
  const otherProfile = (useSelector((state) => state.user)).otherUser;
  const otherProfileId=otherProfile._id;
  const profileId=profile._id;
  const followers = (useSelector((state) => state.user.followers));
  const isOwnProfile=Boolean(profileId===otherProfileId);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const followerContainerRef = useRef(null);
  const lastFollowerRef = useRef(null);
  const [isNoFollower, setIsNoFollower] = useState(false);

  useEffect(()=>{
    dispatch(clearFollowers());
  },[dispatch]);
  useEffect(() => {
    if(isOwnProfile)
      dispatch(getFollowers(profileId,page));
     else
      dispatch(getFollowers(otherProfileId,page));
  }, [dispatch,profileId,otherProfileId,page]);

  
  useEffect(() => { 
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading) {
          if (followers.length >= page * 5) {
            setIsLoading(true);
            setTimeout(() => {
              setIsLoading(false);
              setPage((prevPage) => prevPage + 1);
            }, 1000);
          }
        }
      },
      { threshold:1 }
    );

    if (lastFollowerRef.current) {
      observer.observe(lastFollowerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [isLoading,page,followers]);
  useEffect(() => {
    const timer = setTimeout(() => {
      if (followers.length === 0) {
       setIsNoFollower(true);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [followers]);


  return (
    <div className="flex flex-col h-full w-[100%] ">
      {followers.length>0 && !isNoFollower ? (
          <ul ref={followerContainerRef}>
            {followers.map((follower,index) => {
                if (index === followers.length - 1) {
                  return (
                    <li 
                    key={index} 
                    ref={lastFollowerRef}
                    className="flex flex-grow justify-between py-2 px-4 bg-blue-50 hover:bg-blue-100 dark:hover:bg-slate-600 dark:bg-slate-500">
                    <div className="flex gap-2 ">
                    {follower.picture && follower.picture.length > 0 ? (
                    <img src={follower.picture} className="object-cover h-7 w-7 my-auto rounded-full"/>
                    ) : (
                   <div className={`${generateColor(follower?.name?.slice(0,1).toUpperCase())} h-7  w-7  my-auto rounded-full text-white flex items-center justify-center`}>
                     {follower?.name?.slice(0,1).toUpperCase()}
                   </div>
                     )}
    
                    <Link to={`/profile/${follower.linkname}`} className="hover:text-blue-500">{follower.name}</Link>
                    </div>
                    <Link to={`/profile/${profile.linkname}/message/${follower.linkname}`}
                    className="flex items-center justify-center gap-2 px-2 py-2 bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-600 hover:to-indigo-800 text-white rounded-lg w-42 h-8">
                    <div className="w-5 h-5">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="my-auto w-6 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                    </div>
                    <p>message</p>
                    </Link>
                  </li>
                  );
                }
                return(    
                 <li 
                  key={index} 
                  className="flex flex-grow justify-between py-2 px-4 bg-blue-50 hover:bg-blue-100 dark:hover:bg-slate-600 dark:bg-slate-500">
                  <div className="flex gap-2 ">
                  {follower.picture && follower.picture.length > 0 ? (
                  <img src={follower.picture} className="object-cover h-7 w-7 my-auto rounded-full" />
                  ) : (
                 <div className={`${generateColor(follower?.name?.slice(0,1).toUpperCase())} h-7  w-7  my-auto rounded-full text-white flex items-center justify-center`}>
                   {follower?.name?.slice(0,1).toUpperCase()}
                 </div>
                   )}
  
                  <Link to={`/profile/${follower.linkname}`} className="hover:text-blue-500">{follower.name}</Link>
                  </div>
                  <Link to={`/profile/${profile.linkname}/message/${follower.linkname}`}
                  className="flex items-center justify-center gap-2 px-2 py-2 bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-600 hover:to-indigo-800 text-white rounded-lg w-42 h-8">
                  <div className="w-5 h-5">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="my-auto w-6 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                  </div>
                  <p>message</p>
                  </Link>
                </li>)
            })}
             {isLoading ? (
              <div className="flex min-w-screen h-full gap-4 m-auto  bg-inherit rounded-md items-center justify-center"><svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
          </svg>
          <span className="sr-only"></span>Loading...</div>
            ) : (
              <></>
            )}
          </ul>
        ) :isNoFollower? (
          <p className="flex items-center justify-center my-44">
            Follower list is empty
          </p>
        ):(<div className="flex min-w-screen h-full gap-4 m-auto  bg-inherit rounded-md items-center justify-center"><svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
    </svg>
    <span className="sr-only"></span>Loading...</div>)}
      </div>
  );
}

export default Followers;
/**
 *   const test=()=>{
    const follower="hemanta";
    api.get(`/profile/${follower}`,).then((response)=>{
       console.log(response.data);
    }).catch((error)=>{console.log(error)})
  }
 * <button onClick={test}>test</button>
 * 
 */