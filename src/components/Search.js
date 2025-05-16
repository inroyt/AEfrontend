import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import useWindowSize from '../hooks/useWindowSize';
import api from '../api/data';
import { clearSuggestions, resetSearchPage } from "../redux/post/postSlice";
import { useDispatch, } from 'react-redux';
const Search = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [page, setPage] = useState(1);
  const windowSize = useWindowSize();
  const postContainerRef = useRef(null);
  const lastPostRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const history = useNavigate();
  const dispatch = useDispatch();
  const fetchSuggestions = async (searchTerm, page) => {
    try {
      const response = await api.get(`/api/search?searchTerm=${searchTerm}&page=${page}`);

      const newSuggestions = response.data;
      if (page === 1) {
        // If it's the first page, replace the suggestions with the new ones
        setSuggestions(newSuggestions);
      } else {
        // If it's not the first page, append the new suggestions to the existing ones
        setSuggestions(prevSuggestions => [...prevSuggestions, ...newSuggestions]);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };


  useEffect(() => {
    if (searchInput.trim() !== '') {
      fetchSuggestions(searchInput, page);
    } else {
      setTimeout(() => {
        setSuggestions([]); // Clear suggestions after a short delay
        setIsLoading(false);
        setPage(1);
      }, 500);
    }

  }, [searchInput, page]);

  useEffect(() => {
    if (searchInput.trim() === '') {
      setTimeout(() => {
        setSuggestions([]); // Clear suggestions after a short delay
        setIsLoading(false);
        setPage(1);
      }, 500);
    }
  }, [searchInput])
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        console.log('Intersection observed');
        if (entries[0].isIntersecting && !isLoading) {
          if (suggestions.length >= page * 5) {
            setIsLoading(true);
            setTimeout(() => {
              setIsLoading(false);
              setPage((prevPage) => prevPage + 1); // Increment page number
            }, 1000);
          }
        }
      },
      { threshold: 0.5 } // Trigger when at least 50% of the last post is visible
    );

    if (lastPostRef.current) {
      observer.observe(lastPostRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [isLoading, suggestions, page]);



  const handleInputChange = (event) => {
    setSearchInput(event.target.value);
    setPage(1);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchInput(suggestion.title); // Set the input field value to the suggestion's title
    // Navigate to the specified link
    history(suggestion.link); // Assuming `history` is from `useNavigate` hook
    setTimeout(() => {
      setSuggestions([]); // Clear suggestions after a short delay
    }, 500); // Clear suggestions

  };


  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && searchInput.trim() !== '') {
      dispatch(clearSuggestions());
      dispatch(resetSearchPage());
      // dispatch(setSearch(searchInput));
      history(`/searchResults/${searchInput}`);

      setTimeout(() => {
        setSuggestions([]); // Clear suggestions after a short delay
        setIsLoading(false);
        //setSearchInput('');
        setPage(1);
      }, 500);
    }
  };
  return (
    windowSize.width > 768 ? <div className="bg-slate-100 shadow-inner dark:border-gray-300 min-w-[15%] h-8 rounded-md flex justify-between items-center py-[6px] dark:bg-gray-100">

      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#9ca3af" className="w-5 h-5 my-auto mx-1 text-gray-900">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
      </svg>
      <input
        type='text'
        placeholder='Search...'
        className="h-full w-full focus:outline-none bg-slate-100 dark:bg-inherit dark:text-gray-900"
        value={searchInput}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
      />
      {suggestions.length > 0 && searchInput.trim() !== '' && (
        <div ref={postContainerRef} className="absolute z-10 top-14 w-[524px] h-[150px] rounded-md bg-slate-50 dark:bg-gray-600 dark:text-gray-100 shadow-md flex flex-col flex-grow overflow-y-auto">
          {suggestions.map((suggestion, index) => {
            if (index === suggestions.length - 1) {
              return (
                <div
                  ref={lastPostRef}  // Assign the ref to the last post element
                  key={index}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  onClick={() => { handleSuggestionClick(suggestion) }}
                >
                  {suggestion.title}
                </div>
              )
            }
            return (
              <div
                key={index}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                onClick={() => { handleSuggestionClick(suggestion) }}
              >
                {suggestion.title}
              </div>
            )
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
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
              </svg>
              <span >Loading...</span>
            </div>
          ) : (
            <></>
          )}
        </div>
      )

      }
    </div> : <>

      {!isOpen ? <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-7 h-7 absolute right-14 text-blue-700 dark:text-gray-100">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
      </button> : <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-7 h-7 absolute right-14 text-blue-500 dark:text-gray-100"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" >
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
      </button>}
      <div
        className={`md:hidden flex fixed py-1 left-0 top-0 h-14 w-[75%] bg-white dark:bg-slate-700 transform ease-in transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        style={{ zIndex: 10 }}
      >
        <input
          type='text'
          className='w-3/4 h-full px-2 border-2 border-blue-700 outline-none' placeholder="Search..."
          value={searchInput}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        {suggestions.length > 0 && (
          <div ref={postContainerRef} className="absolute z-10 top-14 w-full h-[300px] rounded-md p-2 border-2 bg-slate-50 dark:bg-gray-600 dark:text-gray-100 shadow-md flex flex-col flex-grow overflow-y-auto">
            {suggestions.map((suggestion, index) => {
              if (index === suggestions.length - 1) {
                return (
                  <div
                    ref={lastPostRef}  // Assign the ref to the last post element
                    key={index}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                    onClick={() => { handleSuggestionClick(suggestion) }}
                  >
                    {suggestion.title}
                  </div>
                )
              }
              return (
                <div
                  key={index}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  onClick={() => { handleSuggestionClick(suggestion) }}
                >
                  {suggestion.title}
                </div>
              )
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
                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                </svg>
                <span >Loading...</span>
              </div>
            ) : (
              <></>
            )}
          </div>
        )

        }
        <button
          onKeyDown={handleKeyDown}
          onClick={handleKeyDown}
          className='w-1/4 h-full bg-blue-700 text-white rounded-tr-md rounded-br-md'>Search</button>

      </div>
    </>
  )
}
export default Search;
/**
 *  <button className="absolute block lg:hidden mt-3 ml-[73%] " onClick={(e)=>{setSearchVisible(!searchVisible);e.preventDefault()}}>
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
<path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
</svg>

  </button>
  <label className={`${searchVisible? "absolute block mb-1 mt-1 lg:mt-1 ml-[13%] lg:ml-[30%] w-[57%] lg:w-auto":"absolute hidden lg:block ml-[35%] mt-[6px]"}`}> 
  <span className="sr-only">Search</span>
  <span className={`${!searchVisible?"absolute inset-y-0 left-0 flex items-center pl-1 transition-all":"hidden lg:flex absolute inset-y-0 left-0 items-center pl-1 transition-all"}`}>
 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="gray" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
</svg>
  </span>
  <input className="placeholder:italic placeholder:text-gray-500 block text-inherit dark:text-white bg-white dark:bg-gray-700 w-full border border-slate-300 rounded-md py-2 pl-9 pr-3 shadow-lg focus:outline-none focus:border-blue-500 focus:ring-blue-500 focus:ring-1 lg:text-lg" placeholder="Search for anything..." type="text" name="search" onKeyDown={handleKeyDown}/>
</label>
 */