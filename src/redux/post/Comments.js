import React from 'react';
import {Link} from 'react-router-dom';

const Comments = ({post}) => {
  const postId = post._id;
  const commentCount = post.comments;
  return (
    <Link to={`/post/${postId}`}  className="flex items-center justify-center w-[40%] h-full border-r-2 dark:border-r-[1px] dark:border-r-gray-400 hover:text-blue-500 cursor-pointer dark:text-gray-100">
      <div className="flex items-center justify-center gap-1">
             <button className="w-6 h-6">
                <svg data-slot="icon" aria-hidden="true" fill="none" strokeWidth="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.238.364.466.037.893.281 1.153.671L12 21l2.652-3.978c.26-.39.687-.634 1.153-.67 1.09-.086 2.17-.208 3.238-.365 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" strokeLinecap="round" strokeLinejoin="round"></path>
                 </svg>
            </button>
            {commentCount>1?<p>{commentCount} Comments</p>
     :commentCount===1?<p>{commentCount} Comment</p>
     :<p>Comment</p>}
       </div>
      </Link>
  )
}

export default Comments;
