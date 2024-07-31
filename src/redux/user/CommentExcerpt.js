import React from 'react';
import {Link} from 'react-router-dom';

const CommentExerpt = ({comment,showDate}) => {
    
    const postId=comment.postId;
   
  return (
    <Link to={`/post/${postId}`} target='_blank' className="flex w-full gap-2 hover:bg-blue-100 dark:bg-gray-700 dark:hover:bg-gray-800 rounded-lg px-2 py-1">
      
                  <div className="flex w-full flex-col">
                  <div className="flex flex-row w-full ">
                    {<p className="text-blue-500 dark:text-blue-100">{comment.postTitle}</p>}
                     
                    </div>
                    <div className="flex w-full flex-row justify-start items-center gap-2">
                    
                      <p className="text-sm dark:text-gray-200">{showDate}</p>
                    </div>
                    <p className="flex flex-grow dark:text-gray-200">{comment.text}</p>
                    
                  </div>
    </Link>
  )
}

export default CommentExerpt