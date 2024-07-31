import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useWindowSize from '../../hooks/useWindowSize';
import LikeButton from './LikeButton';
import Comments from './Comments';
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
const SocialExcerpt = ({ post }) => {
  const [color, setColor] = useState('');
  const windowSize=useWindowSize();
  const postId=post._id;
  // Using the regex to match text between > and <
  const regex = />([^<]+)</g;
  useEffect(() => {
        setColor(randomColor()); // Set the color when the component mounts
        }, []); // Empty dependency array means this effect runs once on mount
  
  
  const description=(post) => {
    const matches=post.details.match(regex);
         if(matches){
          
          // Cleaning the results to remove '>' and '<'
          let cleanText = matches.map((text) => text.slice(1, -1).trim());
          if(windowSize.width<768){
            return cleanText.join(' ').substring(0,225);
          }else{
            return cleanText.join(' ').substring(0,300);
          }
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
    <div className="h-full w-full flex flex-col rounded-lg lg:flex-grow bg-slate-50 lg:bg-white dark:bg-slate-600">
      <div className={`bg-${color} shadow-inner h-full w-full flex lg:flex-grow items-center justify-between p-4 p rounded-tl-lg rounded-tr-lg text-white`}> {/* Use the state variable here */}
       <div className="w-full h-full items-center flex justify-between">
         
          <div className="w-full h-full">
              <div className="text-xl lg:text-2xl  font-bold ">
                <Link to={`/post/${postId}`}>{post.title}</Link>
              </div>
              {post.link&&<div className="flex justify-start items-start flex-grow"> <a target='_blank' rel="noopener noreferrer" className="flex  gap-2 items-center py-1"
              href={`${post.link}`}
              >
              <p >{link(post)}</p>
               <div className="flex justify-start items-start flex-grow border-2 border-gray-100 rounded-xl p-1">
              
              <p >Open</p>
               </div>
              </a></div>}
          </div>
          { post.imageUrl&&post.link&&<a target='_blank' rel="noopener noreferrer"
              href={`${post.link}`} className="flex items-center w-24 h-24 ">
               <img src={post.imageUrl} className="rounded-md"/>
            </a>}
       </div>
    
      </div>
      { post.imageUrl&&!post.link&&<div 
              className="w-full h-full flex items-center justify-center p-4">
               <img src={post.imageUrl} className="rounded-md w-full"/>
            </div>}
      <div className="h-full w-full flex flex-col gap-1   dark:bg-slate-600 p-4 text-gray-700 dark:text-gray-100 lg:flex-grow">
     
       {description(post)&&<div className="flex justify-start text-md">
            <p>
              {description(post)}...
              <Link to={`/post/${postId}`}  className="font-bold text-blue-500 dark:text-blue-200">+Read more</Link>
            </p>
           
           
        </div>}
        <div className={`flex gap-2 items-center justify-start w-full h-full text-md`} >
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

export default SocialExcerpt;