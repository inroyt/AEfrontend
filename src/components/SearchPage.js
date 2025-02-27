import { useNavigate,useParams } from "react-router-dom";
import { useState,useEffect,useRef } from "react";
import api from '../api/data';
import { setSuggestions,setSearchPageNumber,resetSearchPage } from "../redux/post/postSlice";
import { useDispatch, useSelector } from 'react-redux';
import PostExcerpt from "../redux/post/PostExcerpt";
const SearchPage = () => {
  //const [suggestions, setSuggestions] = useState([]);
  const suggestions=useSelector(state=>state.post.searchResults);
  const page=useSelector(state=>state.post.searchPage);
  const {searchTerm}=useParams();

  const postContainerRef = useRef(null);
  const lastPostRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isNoPost, setIsNoPost] = useState(false);

  const dispatch = useDispatch();
  const fetchSuggestions = async (page) => {
    //const searchTerm=searchText;
    try {
      const response = await api.get(`/api/fullSearch?searchTerm=${searchTerm}&page=${page}`);
  
      const newSuggestions = response.data;
      dispatch(setSuggestions(newSuggestions));
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };
  

  
  useEffect(() => {
    if (searchTerm.trim() !== '') {
      fetchSuggestions(page);
    } else {
      setTimeout(() => {
        setSuggestions([]);
        setIsLoading(false);
        dispatch(resetSearchPage());
      }, 500);
    }
    
  }, [page,searchTerm,dispatch]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        
        if (entries[0].isIntersecting && !isLoading) {
          if (suggestions.length >= page * 5) {
            setIsLoading(true);
            setTimeout(() => {
              setIsLoading(false);
              dispatch(setSearchPageNumber()) // Increment page number
            }, 2000);
          }
        }
      },
      { threshold: 1 } // Trigger when at least 50% of the last post is visible
    );
  
    if (lastPostRef.current) {
      observer.observe(lastPostRef.current);
    }
  
    return () => {
      observer.disconnect();
    };
  }, [isLoading, suggestions, page,dispatch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (suggestions.length === 0) {
        setIsNoPost(true);
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [suggestions]);

  if(isNoPost){
    return (
      <div className="flex w-screen h-screen gap-4 mx-auto bg-inherit dark:bg-gray-600 rounded-md items-center justify-center mb-2">
            <span >No Search Results for `{searchTerm}`</span>
          </div>
    )
  }

  return (
    <div className="min-w-full py-16 min-h-screen ">
     {suggestions.length >= 1 ? (
        <div
          ref={postContainerRef}
          className="flex flex-grow  items-center justify-center flex-col gap-2  h-full w-full"
        >
          {suggestions.map((post, index) => {
            const currentDate = new Date(post.timestamp);
            const prevPost = suggestions[index - 1];
            const prevDate = prevPost ? new Date(prevPost.timestamp) : null;

            const showDate =
              !prevDate || currentDate.toDateString() !== prevDate.toDateString();

            if (index === suggestions.length - 1) {
              // Last post, attach ref
              return (
                <div
                  ref={lastPostRef}
                  key={index}
                  className="xl:w-1/2 w-[98%] h-full bg-white rounded-lg mb-4 shadow-xl"
                >
                  <PostExcerpt post={post}/>
                </div>
              );
            }

            return (
              <div key={index} className="xl:w-1/2 w-[98%] bg-white h-full rounded-lg mb-4 shadow-xl">
               <PostExcerpt post={post}/>
              </div>
            );
          })}
          {isLoading ? (
            <div className="flex flex-row gap-4 mx-auto bg-inherit  items-center justify-center">
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
              <span >Loading...</span>
            </div>
          ) : (
            <></>
          )}
        </div>
      ) : (
        <div className="flex w-screen gap-4 mx-auto min-h-screen bg-inherit   items-center justify-center">
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
          <span >Loading...</span>
        </div>
      )}
    </div>
  )
}

export default SearchPage
