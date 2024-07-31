import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { getOwnComment, clearComments } from './userSlice';
import CommentExerpt from './CommentExcerpt';
const CommentList = () => {
  const otherProfile = useSelector((state) => state.user, shallowEqual).otherUser;
  
  const dispatch = useDispatch();
  
  const profileId = otherProfile._id;
  const comments = useSelector((state) => state.user.comments);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const commentContainerRef = useRef(null);
  const lastCommentRef = useRef(null);
  const [showNoComments, setShowNoComments] = useState(false);

  const formatRelativeTime = (timestamp) => {
    const currentTime = new Date();
    const commentTime = new Date(timestamp);
    const timeDifference = currentTime - commentTime;
    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    switch (true) {
        case seconds < 60:
            return `${seconds} seconds ago`;
        case minutes < 60:
            return `${minutes} minutes ago`;
        case hours === 1 && minutes >= 60 && minutes < 120:
            return `1 hour ago`; // Modified condition for 1 hour
        case hours < 24:
            return `${hours} hours ago`;
        case days === 1:
            return 'yesterday';
        case days < 7:
            return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][commentTime.getDay()];
        case weeks === 1:
            return 'last week';
        case weeks < 4:
            return `${weeks} weeks ago`;
        case months === 1:
            return 'last month';
        case months < 12:
            return `${months} months ago`;
        case years === 1:
            return 'last year';
        default:
            return `${years} years ago`;
    }
};


  useEffect(()=>{
    dispatch(clearComments());
  },[dispatch]);

  useEffect(() => {
    dispatch(getOwnComment(profileId, page));
    //getComment();
  }, [dispatch,profileId, page]);

  useEffect(() => {
    window.scrollTo(0, 0);
    commentContainerRef.current?.scrollTo(0, 0);
  }, []);

  useEffect(() => { 
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading) {
          if (comments.length >= page * 5) {
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

    if (lastCommentRef.current) {
      observer.observe(lastCommentRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [isLoading,page,comments]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (comments.length === 0) {
        setShowNoComments(true);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [comments]);

  return (
    <div className="flex  flex-col   py-4  w-full h-full">
        {comments.length >= 1 ? (
          <div
            ref={commentContainerRef}
            className="flex  flex-col  items-center w-full"
          >
            {comments
            .slice() // Make a copy of the array to avoid mutating the original
            .sort((a, b) => b.timestamp - a.timestamp) // Sort the array by timestamp in descending order
            .map((comment, index) => {
              const showDate =formatRelativeTime(comment.timestamp);
              if (index === comments.length - 1) {
                return (
                  <div
                    ref={lastCommentRef}
                    key={index}
                    className=" w-full  bg-gray-100 dark:bg-gray-500 rounded-lg  mb-2 "
                  >
                     <CommentExerpt comment={comment}  showDate={showDate} />
                  
                </div>
                );
              }

              return (
                <div key={index} className=" w-full bg-gray-100 dark:bg-gray-500 rounded-lg  mb-2 ">
                  <CommentExerpt comment={comment}  showDate={showDate}   />
                  
                </div>
              );
            })}

            {isLoading ? (
              <div className="flex flex-row w-full h-full gap-4 mx-auto mb-4 bg-inherit dark:bg-gray-600 rounded-md items-center justify-center">
                <svg
                  aria-hidden="true"
                  className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                </svg>
                <span>Loading...</span>
              </div>
            ) : (
              <></>
            )}
          </div>
         ) : showNoComments ? (
          
          <div className="flex w-full gap-4 mx-auto h-full bg-inherit dark:bg-gray-600 rounded-md items-center justify-center mb-2">
            <span >No comments yet</span>
          </div>
         ) : (
          <div className="flex w-full gap-4 mx-auto  h-full bg-inherit dark:bg-gray-600 rounded-md items-center justify-center">
            <svg
              aria-hidden="true"
              className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
            </svg>
            <span>Loading...</span>
          </div>
        )}
      </div>
      
   
  );
};

export default CommentList;
