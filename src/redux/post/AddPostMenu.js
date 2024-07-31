import React from 'react'
import {  useParams,Link} from 'react-router-dom';
const AddPostMenu = () => {
 const  {linkname}=useParams();
  return (
    <div className="min-w-min h-screen flex flex-col gap-4 items-center px-2 justify-center bg-blue-700 dark:bg-gray-500 py-8">
        <Link to={`/profile/${linkname}/addPost`} className=" flex items-center justify-center shadow-lg   h-[10%] px-4 rounded-lg  bg-white hover:bg-blue-50 dark:bg-slate-600 font-bold text-blue-500 hover:text-blue-700   ">
         Post a Job/Notification/Result  
        </Link>
        <div className="text-white">Or</div>
        <Link to={`/profile/${linkname}/addPostSocial`} className=" flex items-center justify-center shadow-lg  h-[10%] px-4 rounded-lg  bg-white hover:bg-blue-50 dark:bg-slate-600 font-bold text-blue-500 hover:text-blue-700   ">
         Post an Opinion/Article/News
        </Link>
        
    </div>
  )
}

export default AddPostMenu
