import React, { useState, useEffect,useRef } from 'react';
import { useSelector,useDispatch } from 'react-redux';
import { useParams, Link, useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';
import CommentThread from './CommentThread';
import LikeButton from './LikeButton';
import Comments from './Comments';
import Share from './Share';
import api from '../../api/data';
import useWindowSize from '../../hooks/useWindowSize';
import { setSinglePost,clearPostSelected,setIsTopReached, } from "../../redux/post/postSlice";
import { FaEdit } from 'react-icons/fa';
const SinglePostPage = () => {
  const { postId } = useParams();
  const dispatch = useDispatch();
  const postSelected = useSelector((state) => state.post.postSelected);
  const profile=useSelector(state=>state.user.user);
  const profileName=profile.name;
  const windowSize = useWindowSize();
  const isTopReached = useSelector((state) => state.post.isTopReached);
  const [sanitizedDetails, setSanitizedDetails] = useState('');
  const [headerList, setHeaderList] = useState([]);
  const ref = useRef(null);
  const history=useNavigate();
  useEffect(() => {
      const handleScroll = () => {
          if (ref.current) {
              const { top } = ref.current.getBoundingClientRect();
              dispatch(setIsTopReached(top < 40));
          }
      };

      window.addEventListener('scroll', handleScroll);
      return () => {
          window.removeEventListener('scroll', handleScroll);
      };
  }, [dispatch, isTopReached]);

  const styledHtmlContent = (htmlString) => {
      const regex = /<h([1-6])\s*[^>]*>(.*?)<\/h\1>/gi;
      let sectionCounter = 1;
      let headers = [];

      const styledHtml = htmlString.replace(regex, (match, level, content) => {
          const id = `section-${sectionCounter++}`;
          headers.push({ id, content });
          return `<section id="${id}"><h${level} class="w-full bg-gradient-to-r from-cyan-500 to-indigo-500 px-2 py-4 flex flex-grow items-center justify-start text-white rounded-lg">${content}</h${level}></section>`;
      });

      setHeaderList(headers);
      return styledHtml;
  };

  useEffect(() => {
    const fetchPost = async () => {
        dispatch(clearPostSelected());
        try {
            if (postId !== undefined) {
                const response = await api.get(`/api/post/${postId}`, { withCredentials: true });
                if (response.status === 200) {
                    if (response.data.details) {
                        // Remove leading and trailing quotes
                        const contentWithoutQuotes = response.data.details.replace(/^"|"$/g, '');

                        // Style the HTML content (if needed)
                        const styledContent = styledHtmlContent(contentWithoutQuotes);

                        // Sanitize HTML content
                        const sanitizedHTML = DOMPurify.sanitize(styledContent);

                        // Fix href attributes and add target="_blank"
                        const sanitizedHtml = sanitizedHTML
                            .replace(/href="\\&quot;([^"]*)\\&quot;"/g, 'href="$1"') // Fix escaped quotes in href
                            .replace(/<a\s+(?![^>]*target=)[^>]*>/gi, '<a target="_blank" rel="noreferrer">'); // Add target="_blank" and rel="noreferrer"

                        setSanitizedDetails(sanitizedHtml);
                    }
                    dispatch(setSinglePost(response.data));
                }
            }
        } catch (error) {
            console.error('Error fetching post:', error);
        }
    };

    if (postId !== undefined) {
        fetchPost();
    }

}, [dispatch, postId]);


  useEffect(() => {
      window.scrollTo(0, 0);
      ref.current?.scrollTo(0, 0);
  }, []);

  const formatTimestamp = (timestamp) => {
      const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
      const date = new Date(timestamp);

      const day = date.getDate().toString().padStart(2, '0');
      const month = months[date.getMonth()];
      const year = date.getFullYear();

      let hours = date.getHours();
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';

      hours = hours % 12;
      hours = hours ? hours : 12;
      const strHours = hours.toString().padStart(2, '0');

      return `${day} ${month} ${year} ${strHours}:${minutes} ${ampm}`;
  };

  if (Object.keys(postSelected).length === 0) {
      return <div className="flex w-screen h-screen gap-4 m-auto bg-inherit dark:bg-gray-600 rounded-md items-center justify-center">
          <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
          </svg>
          <span className="sr-only"></span>Loading...
      </div>;
  }

  const link = (postSelected) => {
      if (postSelected.link) {
          const url = postSelected.link;
          const pattern = /https?:\/\/(?:www\.)?([^\/?]+)/;
          const match = url.match(pattern);
          if (match) {
              return match[1];
          } else {
              console.log("Domain name not found in the URL.");
          }
      }
  };

  const handleEdit=()=>{
    dispatch(clearPostSelected()); 
    dispatch(setSinglePost(postSelected));
    postSelected.isSocial
    ?history(`/post/editSocialPost/${postId}`)
    :history(`/post/edit/${postId}`);
  }

    return (
      
        <div ref={ref} className={`inset-0  ${Boolean(windowSize.width<768)?'sticky z-10':''} flex flex-grow text-gray-500  justify-center min-h-screen min-w-min mt-14 mb-14 lg:mt-20 lg:rounded-lg font-roboto`}>
            <div className="h-full w-full lg:w-[60%] flex flex-col items-center justify-start bg-white dark:bg-gray-500 dark:lg:bg-slate-700 shadow-lg rounded-lg">
                <div className={`flex flex-col items-center ${postSelected.isSocial?`gap-0`:`gap-2`} justify-center flex-grow w-full h-full border-b-2 border-gray-200 dark:border-gray-400 rounded-tr-lg rounded-tl-lg`}>
                   {postSelected.link?<div className={`${Boolean(windowSize.width<768)?'sticky top-0':''} h-full flex flex-grow flex-row items-center gap-2 justify-center w-full p-2 bg-slate-100 lg:bg-white dark:bg-slate-600 lg:rounded-tr-lg lg:rounded-tl-lg  shadow-lg`}>
                   <a target='_blank' rel="noopener noreferrer"
              href={`${postSelected.link}`} className="w-full">
              <p className="md:text-lg text-base font-semibold lg:font-bold ">{postSelected.title}</p>
              
               {postSelected.link!==undefined &&<div className="flex justify-start items-start flex-grow"> <a target='_blank' rel="noopener noreferrer" className="flex  gap-2 items-center p-1"
              href={`${postSelected.link}`}
              >
              <p >{link(postSelected)}</p>
               <div className="flex justify-start items-start flex-grow border-2 rounded-xl p-1">
               <p className="w-5 h-5"><svg data-slot="icon" aria-hidden="true" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" stroke-linecap="round" stroke-linejoin="round"></path>
              </svg> </p>
              <p>Open</p>
               </div>
              </a></div>}
          </a>
          { postSelected.imageUrl!==undefined &&<a target='_blank' rel="noopener noreferrer"
              href={`${postSelected.link}`} className="flex items-center w-24 h-24 ">
               <img src={postSelected.imageUrl} className="rounded-md"/>
            </a>}
                   </div>
                   : <div className={`${Boolean(windowSize.width<768)?'sticky top-0':''} h-full flex flex-grow flex-row items-center gap-2 justify-center w-full px-4 py-2 bg-slate-100 lg:bg-white dark:bg-slate-600 lg:rounded-tr-lg lg:rounded-tl-lg  shadow-lg`}>
                        {postSelected.imageUrl&&postSelected.link===undefined&&<div className="h-full ">
                            <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center">
                                <img src={`${postSelected.imageUrl}`}  alt={`${postSelected.title}`} className="rounded-full"/>
                            </div>
                        </div>}
                          <p className="font-roboto font-bold text-xl lg:text-4xl bg-gradient-to-r from-cyan-500 to-indigo-500  text-transparent bg-clip-text">
                              {postSelected.title.toUpperCase()}
                          </p>
                    </div>
                    }
              { postSelected.imageUrl&&!postSelected.link&&postSelected.isSocial&&<div 
              className="w-full h-full flex items-center justify-center p-2 ">
               <img src={postSelected.imageUrl} className="rounded-md w-full"/>
            </div>}
                    {/*we removed this css from the element below: ${isLongPost?'h-screen':'h-full'} */}
                    {sanitizedDetails&&<div className={`flex flex-col flex-grow w-full text-md text-gray-600  dark:text-white px-4 py-2 lg:px-4`} dangerouslySetInnerHTML={{ __html: sanitizedDetails }} />}
                   
                    <div className={`flex gap-2 px-4 py-2 items-center justify-start w-full h-full text-gray-600`} >
                    {postSelected.postedByName==='Prabin Roy'?<div className="dark:text-gray-100"> 
           Post by: 
           <span className="text-blue-500 dark:text-blue-200 italic" > admin</span>
           </div>:<Link to={`/profile/${postSelected.postedById}`} className="dark:text-gray-100"> 
           Post by: 
           <span className="text-blue-500 dark:text-blue-200 italic" > {postSelected.postedByName}</span>
           </Link>}
                     <p className="dark:text-gray-100 text-sm"> {formatTimestamp(postSelected.timestamp)}</p>
                     {profileName==='Prabin Roy'&& <button onClick={handleEdit} className="hover:text-blue-500 dark:text-gray-100">
                                <FaEdit size="23"/>
                          </button>}
                    </div>
                    {postSelected.isSocial===undefined&&postSelected.category===('Government job'||'Private job'||'Entrance Examination')&&<Link
                    to={`/post/${postId}/applyNow`}
                     className="px-4 py-2 mb-4 shadow-lg bg-gradient-to-r from-cyan-500 to-indigo-500 text-white rounded-lg"
                    >
         Apply Now
        </Link>}
       
                </div>
           
                <div className="flex justify-start flex-grow w-full h-full ">
                    <div className="flex w-full lg:w-1/2 h-full   rounded-br-lg rounded-bl-lg px-4 py-2  lg:gap-2 items-center justify-between">
                        <LikeButton post={postSelected} />
                        <Comments post={postSelected} />
                        <Share post={postSelected} />
                    </div>
                </div>
                <CommentThread post={postSelected} />
            </div>
           {postSelected.isSocial===undefined&& <div className="hidden lg:flex lg:w-[324px] lg:flex-col lg:sticky lg:top-20 lg:h-screen lg:px-4">
                    <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-lg">
                        <h2 className="text-xl font-bold mb-4 text-blue-700 dark:text-white">On this page</h2>
                        <ul className="list-disc list-inside space-y-2">
                            {headerList.map(header => (
                                <li key={header.id}>
                                    <a href={`#${header.id}`} className="text-blue-500 hover:underline hover:text-blue-700 dark:text-gray-100 dark:hover:text-white">
                                        {header.content.replace(/(<([^>]+)>)/gi, "")}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>}
        </div>
    );
};

export default SinglePostPage;
