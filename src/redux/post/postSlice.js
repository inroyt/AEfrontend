import { createSlice } from '@reduxjs/toolkit';

import api from '../../api/data';
const initialState = {
    posts:[],
    socialPosts:[],
    savedPosts:[],
    ownPosts:[],
    page:1,
    socialPage:1,
    postSelected:{},
    commentThread:[],
    isTopReached:false, // this is for the issue of conflicting menu z index and single post page header z index
    isSocial:false,
    searchTerm:'',
    searchResults:[],
    searchPage:1
}
const postSlice=createSlice({
    name:'post',
    initialState,
    reducers:{
      setPage: (state,action) =>{
       state.page=state.page+1;
      },
      setSocialPage: (state,action) =>{
        state.socialPage=state.socialPage+1;
       },
      setSearchPage: (state,action) =>{
      state.searchPage=state.searchPage+1;
      },
      clearSearchPage: (state,action) =>{
        state.searchPage=1;
      },
      setPosts: (state, action) => {
        const uniquePosts = new Set([...state.posts.map(post => JSON.stringify(post)), ...action.payload.map(post => JSON.stringify(post))]);
        state.posts = Array.from(uniquePosts).map(post => JSON.parse(post));
      },
      setSocialPosts: (state, action) => {
        const uniquePosts = new Set([...state.socialPosts.map(post => JSON.stringify(post)), ...action.payload.map(post => JSON.stringify(post))]);
        state.socialPosts = Array.from(uniquePosts).map(post => JSON.parse(post));
      },
       clearPosts(state, action) {
        state.posts = []; // Adjust accordingly to how your state is structured
      },
      setSearchResults: (state, action) => {
        const uniquePosts = new Set([...state.searchResults.map(post => JSON.stringify(post)), ...action.payload.map(post => JSON.stringify(post))]);
        state.searchResults = Array.from(uniquePosts).map(post => JSON.parse(post));
      },
      clearSearchResults(state, action) {
        state.searchResults = []; // Adjust accordingly to how your state is structured
      },
      setPostSelected:(state,action) => {
       state.postSelected = {...state.postSelected,...action.payload}
      },
      clearPostSelected:(state, action) => {
        state.postSelected={};
      },
      setIsTopReached:(state,action) =>{  
         state.isTopReached = action.payload
      },
      setIsSocial:(state, action) =>{
        state.isSocial = action.payload
      },
      icrCommentCount: (state, action) => {
        return {
          ...state,
          postSelected: {
            ...state.postSelected,
            comments: (state.postSelected.comments || 0) + 1
          }
        };
      },
      decrCommentCount: (state, action) => {
        return {
          ...state,
          postSelected: {
            ...state.postSelected,
            comments: (state.postSelected.comments || 0) - 1
          }
        };
      },
       icrLikes: (state, action) => {
        const post = state.posts.find(post => post._id === action.payload);
        if (post) {
            post.likes++;
        }
      },
      dcrLikes: (state, action) => {
        const post = state.posts.find(post => post._id === action.payload);
        if (post) {
            post.likes--;
        }
      },
    
      setCommentThread: (state, action) => {
        const payloadArray = Array.isArray(action.payload) ? action.payload : [action.payload];
        const uniqueComments = new Set([...state.commentThread.map(comment => JSON.stringify(comment)), ...payloadArray.map(comment => JSON.stringify(comment))]);
        state.commentThread = Array.from(uniqueComments).map(comment => JSON.parse(comment));
      },
      
       clearCommentThread:(state) => {
        state.commentThread=[];
      },
      saveEditedComment:(state,action) => {
          const { commentId, newText } = action.payload;
          const comment = state.commentThread.find(comment => comment._id === commentId);
              if(comment){
                comment.text=newText;
              }
      },
      eraseComment: (state, action) => {
        const  commentId  = action.payload;
        state.commentThread = state.commentThread.filter(comment => comment._id !== commentId);
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    clearSearchTerm: (state, action) => {
      state.searchTerm ='';
    }

    }
})
export const { setPosts,setSocialPosts,setSavedPosts,setOwnPosts,icrLikes,dcrLikes,setPostSelected,clearPostSelected,
  setCommentThread,clearCommentThread,clearPosts,setIsTopReached,
  setIsSocial, saveEditedComment,eraseComment,icrCommentCount,decrCommentCount,setPage,setSocialPage,setSearchPage,clearSearchPage,
  setSearchTerm,clearSearchTerm,setSearchResults,clearSearchResults} = postSlice.actions;
export const getPost=(page)=>{ console.log(api.defaults.baseURL);

    if(page!==undefined){        //undefined parameter in http link cause the backend to crash 
      return async (dispatch)=>{
        try{
            const response= await api.get(`/api/posts/?page=${page}`); 
          if(response.status===200){
            dispatch(setPosts(response.data))
          }
        }catch(e){
            console.error(e);
        }
     }
    }
}
export const getSocialPost=(page)=>{ console.log("get post is running");
    if(page!==undefined){        //undefined parameter in http link cause the backend to crash 
      return async (dispatch)=>{
        try{
          const response= await api.get(`/api/socialPosts/?page=${page}`); 
          if(response.status===200){
            dispatch(setSocialPosts(response.data))
          }
        }catch(e){
            console.error(e);
        }
     }
    }
}
export const incrementLikes=(postId)=>{
  return (dispatch)=>{
    dispatch(icrLikes(postId))
  }
}
export const decrementLikes=(postId)=>{
    return (dispatch)=>{
      dispatch(dcrLikes(postId))
    }
  }
export const setSinglePost=(post)=>{
  return (dispatch)=>{
    dispatch(setPostSelected(post))
  }
}
export const addComment = (comment) => {
  return async (dispatch) => {
    try {
      const response=await api.post('/api/addComment',comment,{ withCredentials: true }); 
      if(response.status===200)
         {
          dispatch(setCommentThread([comment]));
          dispatch(icrCommentCount());
        }
    } catch (error) {
      console.error(error);
      // You might want to dispatch an error action here if needed
    }
  };
};

export const getComments = (postId,page) => {
  if(postId !== undefined&&page !== undefined){
    return async (dispatch) => {
       try {
         const response=await api.get(`/api/getComments/${postId}?page=${page}`,{ withCredentials: true });
         if(response.status===200){
           
           const comments = response.data;
           dispatch(setCommentThread(comments));
         }
       } catch (error) {
         console.error(error);
         // You might want to dispatch an error action here if needed
       }
     };
  }
};
export const editComment=(comment,commentId)=>{
  return (dispatch) => {
    dispatch(saveEditedComment({ commentId, newText: comment }));
  }
}
export const deleteComment=(commentId)=>{
  return (dispatch) => {
    dispatch(eraseComment(commentId));
    dispatch(decrCommentCount());
  }
}
export const setPageState=()=>{
 return(dispatch) => dispatch(setPage());
}
export const setSocialPageState=()=>{
  return(dispatch) => dispatch(setSocialPage());
 }

export const setSearch=(text)=>{
return (dispatch) => dispatch(setSearchTerm(text));
}
export const clearSearch=()=>{
  return (dispatch) => dispatch(clearSearchTerm());
  }

export const setSuggestions=(post)=>{
   return (dispatch) => dispatch(setSearchResults(post));
}
export const clearSuggestions=()=>{
  return (dispatch) => dispatch(clearSearchResults());
}

export const setSearchPageNumber=()=>{
     return (dispatch) => dispatch(setSearchPage());
}
export const resetSearchPage=()=>{
    return (dispatch) => dispatch(clearSearchPage());
}
export default postSlice.reducer;


/*
 icrLikes:(state,action)=>{
        state.posts.map(post=>{
            if(post._id===action.payload){
                post.likes++;
            }
        })
       },
       dcrLikes:(state,action)=>{
        state.posts.map(post=>{
            if(post._id===action.payload){
                post.likes--;
            }
        })
       },
*/