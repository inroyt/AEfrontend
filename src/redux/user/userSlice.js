import { createSlice } from '@reduxjs/toolkit';
import api from '../../api/data';
const initialState = {               //do not mutate objects in reducers because objects are not premitive data type in javascript
  user: {},
  otherUser: {},
  followers:[],
  following:[],
  activeTab:1,
  savedPosts:[],
  savedPostPage:1,
  ownPosts:[],
  ownPostPage:1,
  comments:[],
  isDarkMode:false,
  successMessage:null,
};
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setDarkMode:(state,action) => {
      state.isDarkMode = action.payload;
    },
    setActiveTab:(state,action) => {
      state.activeTab = action.payload;
    },
    setSavedPage: (state,action) =>{
      state.savedPostPage=state.savedPostPage+1;
     },
    setSavedPosts: (state, action) => {
      const uniquePosts = new Set([...state.savedPosts.map(post => JSON.stringify(post)), ...action.payload.map(post => JSON.stringify(post))]);
      state.savedPosts = Array.from(uniquePosts).map(post => JSON.parse(post));
    },
    clearSavedPosts(state, action) {
      state.savedPosts = []; 
    },
    setOwnPostPage: (state,action) =>{
      state.ownPostPage=state.ownPostPage+1;
     },
    setOwnPosts: (state, action) => {
      const uniquePosts = new Set([...state.ownPosts.map(post => JSON.stringify(post)), ...action.payload.map(post => JSON.stringify(post))]);
      state.ownPosts = Array.from(uniquePosts).map(post => JSON.parse(post));
    },
    clearOwnPosts(state, action) {
      state.ownPosts = []; 
    },
    setOwnComments: (state, action) => {
      const payloadArray = Array.isArray(action.payload) ? action.payload : [action.payload];
      const uniqueComments = new Set([...state.comments.map(comment => JSON.stringify(comment)), ...payloadArray.map(comment => JSON.stringify(comment))]);
      state.comments = Array.from(uniqueComments).map(comment => JSON.parse(comment));
    },
    clearComments(state, action) {
      state.comments = []; 
    },
    setSocial: (state, action) => {
      state.social = { ...state.social, ...action.payload };
    },
    clearSocial: (state) => {
      state.social = {};
    },
    setUser: (state, action) => {
      state.user ={ ...state.user,...action.payload};
    },
    clearUser: (state) => {
      state.user ={};
    },
    setOtherUser: (state, action) => {
      state.otherUser = {...state.otherUser,...action.payload};
    },
    clearOtherUser: (state) => {
      state.otherUser ={};
    },
    setFollowers: (state, action) => {
      const payloadArray = Array.isArray(action.payload) ? action.payload : [action.payload];
      const uniqueFollowers = new Set([...state.followers.map(follower => JSON.stringify(follower)), ...payloadArray.map(follower => JSON.stringify(follower))]);
      state.followers = Array.from(uniqueFollowers).map(follower => JSON.parse(follower));
    },
    clearFollowers:(state) => {
      state.followers=[];
    },
    setFollowing: (state, action) => {
      const payloadArray = Array.isArray(action.payload) ? action.payload : [action.payload];
      const uniqueFollowing = new Set([...state.following.map(following => JSON.stringify(following)), ...payloadArray.map(following => JSON.stringify(following))]);
      state.following = Array.from(uniqueFollowing).map(following => JSON.parse(following));
    },
    clearFollowing:(state) => {
      state.following=[];
    },
    addFollowingAsync: (state, action) => {
      state.user = {
        ...state.user,
        following: [...state.user.following, action.payload],
      };
    },
    removeFollowingAsync: (state, action) => {
      state.user = {
        ...state.user,
        following: state.user.following.filter(following => following !== action.payload),
      };
    },
    addOtherFollowersAsync: (state, action) => {
      state.otherUser = {
        ...state.otherUser,
        followers: [...state.otherUser.followers, action.payload],
      };
    },
    removeOtherFollowersAsync: (state, action) => {
      state.otherUser = {
        ...state.otherUser,
        followers: state.otherUser.followers.filter(follower => follower !== action.payload),
      };
    },
    removeBlock: (state, action) => {
      state.user = {
        ...state.user,
        blockedUsers: state.user.blockedUsers.filter(blockedUser => blockedUser !== action.payload),
      };
    },
  setSuccessMessage: (state, action) => {
    state.successMessage = action.payload;
  },
  addPostLikes: (state, action) => {
    state.user = {
      ...state.user,
      likedPosts: [...state.user.likedPosts, action.payload],
    };
  },
  removePostLikes: (state, action) => {
    console.log('initial state removeLike function', state.user);
    state.user = {
      ...state.user,
      likedPosts: state.user.likedPosts.filter(id => id !== action.payload),
    };
    
  },
  addSavedPost: (state, action) => {
    state.user = {
      ...state.user,
      savedPosts: [...state.user.savedPosts, action.payload],
    };
  },
  removeSavedPost: (state, action) => {
    const postIdToRemove = action.payload;
    state.user = {
      ...state.user,
      savedPosts: state.user.savedPosts.filter(id => id !== postIdToRemove),
    }; 
    
    state.savedPosts = state.savedPosts.filter(posts => posts._id !== postIdToRemove);
  },
  icrLikes: (state, action) => {
    const post = state.savedPosts.find(post => post._id === action.payload);
    if (post) {
        post.likes++;
    }
  },
  dcrLikes: (state, action) => {
    const post = state.savedPosts.find(post => post._id === action.payload);
    if (post) {
        post.likes--;
    }
  },
  },
});   //use the sate(s) associated with these functions in the components required to re-render everytime the state(s) associated with the function is updated
export const {icrLikes,dcrLikes,setDarkMode, setUser,clearUser,setOtherUser,clearOtherUser,setSocial,
  setFollowers,clearFollowers,setFollowing,clearFollowing,addFollowingAsync,addPostLikes, removePostLikes,
  removeFollowingAsync,addOtherFollowersAsync,removeOtherFollowersAsync,successMessage,setSuccessMessage,removeBlock,
  setSavedPosts,setSavedPostPage,clearSavedPosts,addSavedPost,removeSavedPost,setOwnPosts,setOwnPostPage,clearOwnPosts,setOwnComments,clearComments,
  saveEditedComment,eraseComment,setActiveTab} = userSlice.actions;

  export const handleProfile = async (dispatch) => {
        try {
          const response = await api.get('/api/profile',{ withCredentials: true });
          //console.log(response.data); 
          const isProfile=typeof(response.data)==="object"?Boolean(Object.keys(response.data).length>1):false;
          if (isProfile) {
            dispatch(setUser(response.data));
          }
        } catch (error) {
          console.log(error);
        }
};


// Create the actual asynchronous action creators
export const addFollowing = (profileId, otherProfileId) => {
  if(profileId !== undefined && otherProfileId !== undefined)
    return async (dispatch) => {
      try {//{ withCredentials: true} is set as third argument in axios PUT requests to send the cookies along with the the request
        const response = await api.put(`/api/profile/${profileId}/add-following/${otherProfileId}`,{},{ withCredentials: true });
        dispatch(addFollowingAsync(response.data.otherProfileId));
        dispatch(addOtherFollowersAsync(response.data.profileId));
        console.log(response.data);
      } catch (error) {
        console.error(error);
        // You might want to dispatch an error action here if needed
      }
    };
  
};

export const removeFollowing = (profileId, otherProfileId) => {
  if(profileId !== undefined && otherProfileId !== undefined)
    return async (dispatch) => {
      try {
        const response = await api.put(`/api/profile/${profileId}/remove-following/${otherProfileId}`,{},{ withCredentials: true });
        dispatch(removeFollowingAsync(response.data.otherProfileId));
        dispatch(removeOtherFollowersAsync(response.data.profileId)); //
        dispatch(setSuccessMessage('Unfollowed successfully.'));
        
      } catch (error) {
        console.error(error);
        
      }
    };
  
   
};
export const getFollowers=(profileId,page)=>{ 
  if(profileId!==undefined && page!==undefined)
   return async (dispatch)=>{
    try {
      const response = await api.get(`/api/profile/${profileId}/followers?page=${page}`,{withCredentials:true});
            if(response.status===200){
               dispatch(setFollowers(response.data));
            }
    } catch (error) {
      console.log('Error fetching following data:', error);
       // Reset the followingNames state to an empty array on error.
    }
   }
}
export const getFollowing=(profileId,page)=>{ 
  if(profileId!==undefined && page!==undefined)
    return async (dispatch)=>{
     try {
      const response = await api.get(`/api/profile/${profileId}/following?page=${page}`,{withCredentials:true});
            if(response.status===200){
               dispatch(setFollowing(response.data));
            }
    } catch (error) {
      console.log('Error fetching following data:', error);
       // Reset the followingNames state to an empty array on error.
    }
   }
}
export const blockUser=(profileId,otherProfileId) => {
  if(profileId !== undefined && otherProfileId !== undefined)
    return async (dispatch) => {
        try{
        const response1 = await api.post(`/api/add-blocked-users/${profileId}/${otherProfileId}`,{},{ withCredentials: true });
      
        if (response1.status === 200) {
        
          const data = response1.data; 
        // dispatch(clearOtherUser()); //clear the blocked user
          // Update the user data in Redux after blocking the user
        dispatch(setUser(data.profile));

          // Set the success message
          dispatch(setSuccessMessage('User blocked successfully.'));
        return;
        } else {
            console.error('Failed to block user');
          }
        } catch (error) {
            console.error('Error blocking user', error);
          }
        }  
  }
export const addLikesToPost=(postId)=>{
   return (dispatch)=>{
   ;
     dispatch(addPostLikes(postId));
    
   }
}
export const removeLikesToPost=(postId)=>{
    return (dispatch)=>{
       dispatch(removePostLikes(postId));
       
     }

}
export const incrementLikes1=(postId)=>{
  return (dispatch)=>{
    dispatch(icrLikes(postId))
  }
}
export const decrementLikes1=(postId)=>{
    return (dispatch)=>{
      dispatch(dcrLikes(postId))
    }
  }
export const addToSavedPosts=(postId)=>{
  return (dispatch)=>{
   
    dispatch(addSavedPost(postId));
   
  }
}
export const removeSavedPosts=(postId)=>{
   return (dispatch)=>{
      dispatch(removeSavedPost(postId));
      
    }

}
export const getSavedPost=(profileId,page)=>{ 
    if(page!==undefined&&profileId!==undefined){        //undefined parameter in http link cause the backend to crash 
      return async (dispatch)=>{
        try{
          const response= await api.get(`/api/savedPosts/${profileId}?page=${page}`); 
          if(response.status===200){
            dispatch(setSavedPosts(response.data))
          }else{
            console.log("server error, unable to get posts");
          }
        }catch(e){
            console.error(e);
        }
     }
    }
}
export const getOwnPost=(profileId,page)=>{ 
    if(page!==undefined&&profileId!==undefined){        //undefined parameter in http link cause the backend to crash 
      return async (dispatch)=>{
        try{
          const response= await api.get(`/api/ownPosts/${profileId}?page=${page}`); 
          if(response.status===200){
            dispatch(setOwnPosts(response.data))
          }else{
            console.log("server error, unable to get posts");
          }
        }catch(e){
            console.error(e);
        }
     }
    }
}
export const getOwnComment=(profileId,page)=>{ 
    if(page!==undefined&&profileId!==undefined){        //undefined parameter in http link cause the backend to crash 
      return async (dispatch)=>{
        try{
          const response= await api.get(`/api/ownComments/${profileId}?page=${page}`); 
          if(response.status===200){
            dispatch(setOwnComments(response.data));
          }else{
            console.log("server error, unable to get Comments");
          }
        }catch(e){
            console.error(e);
        }
     }
    }
}
export const setSavedPostPageState=()=>{
  return(dispatch) => dispatch(setSavedPostPage());
 }
 export const setOwnPostPageState=()=>{
  return(dispatch) => dispatch(setOwnPostPage());
 }
 export const setActiveProfileTab=(tab)=>{
  return(dispatch) => dispatch(setActiveTab(tab));
 }


export default userSlice.reducer;