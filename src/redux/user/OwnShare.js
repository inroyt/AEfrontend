import { useNavigate } from "react-router-dom";
import {useMemo} from 'react'
import { useDispatch,useSelector,shallowEqual } from "react-redux";
import { setSinglePost,clearPostSelected } from "../../redux/post/postSlice";
import { FaWhatsapp,FaFacebook,FaEdit } from "react-icons/fa";
const OwnShare = ({ post }) => {
  // Extract post data
  const { title } = post;
  const postId=post._id;
  const url=`https://assamemployment.org/post/${postId}`;
  const isSocialPost=post.hasOwnProperty('isSocial');
 // const [isClicked,setIsClicked]=useState(false);//Save post button click state
  const history=useNavigate();
  const dispatch=useDispatch();
  const { user: profile, otherUser: otherProfile } = useSelector(state => state.user, shallowEqual);
  const isOwnProfile = useMemo(() => Boolean(profile?._id === otherProfile?._id), [profile, otherProfile]);
 
  // Generate OwnShare URLs
  const whatsappShareUrl = `whatsapp://send?text=Check out this post: ${title} ${url}`;
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
  const handleEdit=()=>{
    dispatch(clearPostSelected()); 
    dispatch(setSinglePost(post));
    isSocialPost
    ?history(`/post/editSocialPost/${postId}`)
    :history(`/post/edit/${postId}`);
  }

  return (
    <div className="flex items-center justify-evenly mx-4 lg:mx-auto w-[30%] h-full gap-1  cursor-pointer text-gray-600">
      <a href={whatsappShareUrl} target="_blank" rel="noopener noreferrer" className="lg:hidden hover:text-blue-500 dark:text-gray-100">
     
     <FaWhatsapp size="23"/>
       
     </a>
     <a href={facebookShareUrl} title="Share this post on facebook" target="_blank" className="hover:text-blue-500 dark:text-gray-100" rel="noopener noreferrer" >
     <FaFacebook size="23"/>
     </a>

     {isOwnProfile&& <button onClick={handleEdit} className="hover:text-blue-500 dark:text-gray-100">
      <FaEdit size="23"/>
      </button>}
    </div>
  );
}

export default OwnShare;

