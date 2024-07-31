import React, { useState, useEffect } from 'react';
import { Link} from 'react-router-dom';
import useWindowSize from '../../hooks/useWindowSize';
import LikeButton from './LikeButton';
import Comments from '../post/Comments';
import Share from './Share';
const randomColor = () => {
  const colors = [
    'gradient-to-r from-red-500 to-red-400',
    'gradient-to-r from-green-500 to-green-400',
    'gradient-to-r from-blue-500 to-blue-400',
    'gradient-to-r from-purple-500 to-purple-400',
    'gradient-to-r from-yellow-500 to-yellow-400',
    'gradient-to-r from-indigo-500 to-indigo-400',
    'gradient-to-r from-lime-500 to-lime-400',
    'gradient-to-r from-teal-500 to-teal-400',
    'gradient-to-r from-cyan-500 to-cyan-400'
  ];
  
  const color = colors[Math.floor(Math.random() * colors.length)];
  return color;
};
const formatTimestamp=(timestamp)=> {
  const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  const date = new Date(timestamp);

  const day = date.getDate().toString().padStart(2, '0');
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  const strHours = hours.toString().padStart(2, '0');

  return `${day} ${month} ${year} ${strHours}:${minutes} ${ampm}`;
}
const SavedPostExcerpt = ({ post }) => {
  const [color, setColor] = useState('');
  const windowSize=useWindowSize();
  const postId=post._id;
  // Using the regex to match text between > and <
  const regex = />([^<]+)</g;
  useEffect(() => {
        setColor(randomColor()); // Set the color when the component mounts
        }, []); // Empty dependency array means this effect runs once on mount
  
  
  const description=(post) => {
          const matches=post.details.match(regex)||[];
          // Cleaning the results to remove '>' and '<'
          let cleanText = matches.map((text) => text.slice(1, -1).trim());
          if(windowSize.width<768){
            return cleanText.join(' ').substring(0,225);
          }else{
            return cleanText.join(' ').substring(0,300);
          }
  };

  const link=(post)=>{
    if(post.link){
      const url = post.link
  
      // Define regex pattern to extract domain name
      const pattern = /https?:\/\/(?:www\.)?([^\/?]+)/;
      
      // Use regex to extract domain name
      const match = url.match(pattern);
      
      if (match) {
          const domainName = match[1];
          console.log(domainName);
          return domainName;
      } else {
          console.log("Domain name not found in the URL.");
      }
  
    }
  }
  
  
  
  return (
    <div className="h-full w-full flex flex-col gap-2 rounded-lg lg:flex-grow bg-slate-50 lg:bg-white dark:bg-slate-600">
    <div className={`bg-${color} shadow-inner h-full w-full flex lg:flex-grow items-center justify-between  p-4 rounded-tl-lg rounded-tr-lg text-white`}> {/* Use the state variable here */}
     {post.isSocial? <div className="w-full h-full items-center flex justify-between">
       
       <div className="w-full h-full">
           <div className="text-xl lg:text-2xl font-bold  ">
             <Link to={`/post/${postId}`}>{post.title}</Link>
           </div>
           {post.link&&<div className="flex justify-start items-start flex-grow"> <a target='_blank' rel="noopener noreferrer" className="flex  gap-2 items-center py-1"
              href={`${post.link}`}
              >
              <p className="mb-1">{link(post)}</p>
               <div className="flex justify-start items-start flex-grow border-2 border-gray-100 rounded-xl p-1">
              
              <p className="mb-1">Open</p>
               </div>
              </a></div>}
       </div>
       { post.imageUrl!==undefined &&<a target='_blank' rel="noopener noreferrer"
           href={`${post.link}`} className="flex items-center w-24 h-24 ">
            <img src={post.imageUrl} className="rounded-lg"/>
         </a>}
    </div>:<div className="w-full h-full items-center flex justify-start gap-2">
    <div className="w-full h-full items-center flex justify-start gap-2">
       <div className="lg:w-[8%] w-[15%]">
         <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center">
            {post.imageUrl&&<img src={`${post.imageUrl}`} alt={`${post.title}`} className="rounded-full"/>}
         </div>
       </div>
        <div className="lg:w-[92%] w-[85%]">
            <p className="text-xl lg:text-2xl font-bold  "> <Link to={`/post/${postId}`}>{post.title}</Link></p>
        </div>
     </div>
  
      </div>}
    </div>
   
    <div className="h-full w-full flex flex-col gap-1 dark:bg-slate-600  text-gray-700 dark:text-gray-100 lg:flex-grow text-lg">
    {post?.organization?.length>0&& <div className="flex items-center gap-1 px-4">
          <div className="flex items-center gap-1">
            <div className="lg:w-8 w-6 lg:h-8 h-6">
              <svg data-slot="icon" aria-hidden="true" fill="none" strokeWidth="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" strokeLinecap="round" strokeLinejoin="round"></path>
             </svg>
            </div>
            <p className="font-semibold ">Organization:</p>
           </div>
            <p className="font-bold">{post.organization}</p>
        </div>}
        
      {post?.qualification?.length>0&&<div className="flex items-center gap-1 px-4">
        <div className="flex items-center gap-1">
          <div className="lg:w-8 w-6 lg:h-8 h-6">
             <svg data-slot="icon" aria-hidden="true" fill="none" strokeWidth="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" strokeLinecap="round" strokeLinejoin="round"></path>
             </svg>
          </div>
        <p className="font-semibold ">Qualification:</p>
        </div>
        <p className="font-bold">{post.qualification}</p>
      </div>}
     
      {post?.vacancy&&<div className="flex items-center gap-1 px-4">
        <div className="flex items-center gap-1">
          <div className="lg:w-8 w-6 lg:h-8 h-6">
            <svg data-slot="icon" aria-hidden="true" fill="none" strokeWidth="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" strokeLinecap="round" strokeLinejoin="round"></path>
            </svg>
          </div>
        <p className="font-semibold ">Vacancy:</p>
        </div>
        <p className="font-bold">{post.vacancy}</p>
      </div>}

      {post?.date?.length>0&&<div className="flex items-center gap-1 px-4">
        <div className="flex items-center gap-1">
          <div className="lg:w-8 w-6 lg:h-8 h-6">
          <svg data-slot="icon" aria-hidden="true" fill="none" strokeWidth="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
             <path d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" strokeLinecap="round" strokeLinejoin="round"></path>
          </svg>
          </div>
        <p className="font-semibold ">Last Date:</p>
        </div>
        <p className="font-bold">{post.date}</p>
      </div>}

     {description(post)&&<div className="flex px-4 text-md">
          <p > 
            {description(post)}...
            <Link to={`/post/${postId}`}  className="font-bold text-blue-500 dark:text-blue-200">+Read more</Link>
          </p>
      </div>}
      <div className={`flex gap-2 px-4 items-center justify-start w-full h-full text-md`} >
         {post.postedByName==='Prabin Roy'?<div > 
         Post by: 
         <span className="text-blue-500 dark:text-blue-200 italic" > admin</span>
         </div>:<Link to={`/profile/${post.postedById}`}> 
         Post by: 
         <span className="text-blue-500 dark:text-blue-200 italic" > {post.postedByName}</span>
         </Link>}
         <p > {formatTimestamp(post.timestamp)}</p>
      </div>
      </div>

<div className="flex w-full lg:w-1/2  h-full lg:h-full lg:flex-grow border-t-2 dark:border-t-[1px] dark:border-t-gray-400 lg:border-t-0 rounded-br-lg rounded-bl-lg  p-4 lg:gap-2 items-center dark:text-gray-100 ">
<LikeButton post={post}/>
<Comments post={post}/>
<Share post={post}/>
</div>
  </div>
  );
};

export default SavedPostExcerpt;
