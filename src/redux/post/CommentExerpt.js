import React,{ useState } from 'react';
import {Link} from 'react-router-dom';
import { generateColor } from '../../components/ColourMap';
import EditCommentTT from './EditCommentTT'
const CommentExerpt = ({comment,userId,userLink,showDate}) => {
    const [isEditOpen, setIsEditOpen] = useState(false);
    const commenterId=comment.userId;
    const isOwnComment = Boolean(userId===commenterId);
  return (
    <div className="flex w-full gap-2 dark:bg-gray-600 rounded-lg p-1">
      <Link to={`/profile/${userLink}`} className="flex h-8 w-8">
                    {!comment.user?.picture || comment.user?.picture === undefined ? (
                      <div className={`${generateColor(comment.user?.name?.[0].toUpperCase())}  h-7  w-7   my-auto rounded-full text-white flex items-center justify-center`}>
                        {comment.user?.name?.[0].toUpperCase()}
                      </div>
                    ) : (
                      <img src={comment.user?.picture} className="object-cover  h-7  w-7   my-auto rounded-full "/>
                    )}
                  </Link>
                  <div className="flex w-full flex-col">
                    <div className="flex w-full flex-row justify-start items-center gap-2">
                      <Link to={`/profile/${userLink}`} className="text-blue-500 dark:text-blue-100 font-semibold">{comment.user?.name}</Link>
                      <p className="text-sm dark:text-gray-100">{showDate}</p>
                    </div>
                    {isEditOpen?<EditCommentTT isOpen={isEditOpen} comment={comment} setIsOpen={setIsEditOpen}/>
                               :<p className="flex flex-grow dark:text-gray-100">{comment.text}</p>}
                    {userId!==undefined&&<div className="flex flex-row w-full justify-end">
                    {!isEditOpen&&isOwnComment&&<button 
                    onClick={()=>setIsEditOpen(!isEditOpen)}
                    className="text-blue-500 font-semibold mr-2"
                    >Edit</button>}
                     
                    </div>}
                  </div>
    </div>
  )
}

export default CommentExerpt
