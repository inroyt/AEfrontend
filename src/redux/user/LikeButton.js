import { useNavigate } from "react-router-dom";
import {useState,useEffect} from 'react'
import { useDispatch,useSelector,shallowEqual } from "react-redux";
import { incrementLikes,decrementLikes } from "../post/postSlice";
import { incrementLikes1,decrementLikes1,addLikesToPost,removeLikesToPost } from "./userSlice";
import api from '../../api/data'
const LikeButton = ({post}) => {
    const [isCLicked,setIsClicked]=useState(false);
    const history=useNavigate();
    const dispatch=useDispatch();
    const postId=post._id;
    const [likes,setLikes]=useState(0);
    const profile = useSelector((state) => state.user, shallowEqual).user;
    const profileId = profile._id;
    const isLikedBefore=profile?.likedPosts?.includes(postId);
    const isDark=useSelector(state=>state.user.isDarkMode);
   

    useEffect(()=>{
      setLikes(post.likes);
    },[post.likes])
    useEffect(() =>{//console.log("isLikedBefore",profile.likedPosts,isLikedBefore);
      if (isLikedBefore){
        setIsClicked(true);
      }
    },[profile]);
    const handleClick=async ()=> {
      if(profile.linkname===undefined){
        history(`/login`);
      }
      try{
        if(isCLicked) {
          setIsClicked(false);
          if(post.likes>0){
            setLikes(prev=>prev-1);
          };
          const response = await api.post(`/api/decrementLikes/${profileId}/${postId}`, {}, {
            withCredentials: true // Include this option in the request configuration object
          }); //in axios post routes,credentials object is the third parameter,
          if(response.status===200){
            dispatch(removeLikesToPost(postId));
            dispatch(decrementLikes(postId));
            dispatch(decrementLikes1(postId));
            }else{
            console.log(response.error);
            }
         }else{
          setIsClicked(true);
          setLikes(prev=>prev+1);
          const response=await api.post(`/api/incrementLikes/${profileId}/${postId}`,{},{ withCredentials: true });
          if(response.status===200){
            dispatch(addLikesToPost(postId));
            dispatch(incrementLikes(postId));
            dispatch(incrementLikes1(postId));
          }else{
            console.log(response.error);
          }
        }
      }catch(e){
       console.error(e);
      }
       
    }
  return (
    <div onClick={()=>handleClick()} className="flex items-center justify-start w-[25%] h-full gap-1 border-r-2 dark:border-r-[1px] dark:border-r-gray-400 cursor-pointer hover:text-blue-500">
      <div className="w-6 h-6">
        <svg data-slot="icon" aria-hidden="true" fill={`${isCLicked&&!isDark?`#57534e`:isDark&&isCLicked?`#3b82f6`:`white`}`} strokeWidth="1.5" stroke={`${isCLicked&&!isDark?`#57534e`:isDark&&isCLicked?`#3b82f6`:`currentColor`}`} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" strokeLinecap="round" strokeLinejoin="round"></path>
        </svg>
     </div>
     {likes>1?<p>{likes} Likes</p>
     :likes===1?<p>{likes} Like</p>
     :<p>Like</p>}
 </div>
  )
}

export default LikeButton;
