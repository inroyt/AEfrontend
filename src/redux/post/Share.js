import { useNavigate } from "react-router-dom";
import {useState,useEffect} from 'react'
import { useDispatch,useSelector,shallowEqual } from "react-redux";
import { addToSavedPosts,removeSavedPosts } from "../user/userSlice";
import { FaFacebook,FaWhatsapp,FaBookmark } from 'react-icons/fa';
import api from '../../api/data'

const Share = ({ post }) => {
  // Extract post data
  const { title } = post;
  const postId=post._id;
  const url=`https://wwww.assamemployment.org/post/${postId}`;

  const [isClicked,setIsClicked]=useState(false);//Save post button click state
  const history=useNavigate();
  const dispatch=useDispatch();
  const profile = useSelector((state) => state.user, shallowEqual).user;
  const profileId = profile._id;
  const isSavedBefore=profile?.savedPosts?.includes(postId)||false;
  // Generate share URLs
  const whatsappShareUrl = `whatsapp://send?text=Check out this post: ${title} ${url}`;
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
  
  useEffect(() =>{
  if (isSavedBefore){
    setIsClicked(true);
  }
},[profile,isSavedBefore]);
const handleClick=async ()=> {
        if(profile.linkname===undefined){
          history(`/login`);
        }
        try{
          if(isClicked&&profileId&&postId) {
            setIsClicked(false);
            const response = await api.post(`/removeSavedPost/${profileId}/remove/${postId}`,{},{withCredentials: true }); 
            //in axios post routes,credentials object is the third parameter,
            // Include this option in the request configuration object
            if(response.status===200){
              dispatch(removeSavedPosts(postId));
            }
           } else if(profileId&&postId){
            setIsClicked(true);
            const response=await api.post(`/addSavedPost/${profileId}/add/${postId}`,{},{ withCredentials: true });
            if(response.status===200){
              dispatch(addToSavedPosts(postId));
              
           }
          }
        }catch(e){
        console.error(e);
        }
      }
  return (
    <div className="flex items-center justify-evenly mx-4 lg:mx-auto w-[30%] h-full gap-1  cursor-pointer text-gray-600">
      <a href={whatsappShareUrl} target="_blank" rel="noopener noreferrer" className="lg:hidden hover:text-blue-500 dark:text-gray-100">
     
      <FaWhatsapp size="23"/>
        
      </a>
      <a href={facebookShareUrl} title="Share this post on facebook" target="_blank" className="hover:text-blue-500  dark:text-gray-100" rel="noopener noreferrer" >
      <FaFacebook size="23"/>
      </a>

      <div onClick={()=>handleClick()} title="Save this post" className={` ${isClicked? `text-blue-500`:`dark:text-gray-100`} `}>
      <FaBookmark size="20"/>
      </div>
    </div>
  );
}

export default Share;

