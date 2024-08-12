import React, { useState, useEffect, useCallback,useRef,useMemo } from 'react';
import { sendMessage, getMessages,clearMessageThread } from '../redux/user/messageSlice'
import { useNavigate,Link,useParams } from 'react-router-dom';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { setInbox,fetchInbox,setMessageThread,deleteChat } from '../redux/user/messageSlice';
import { blockUser } from '../redux/user/userSlice';
import Prompt from '../redux/user/Prompt';
import { generateColor } from './ColourMap';
import useWindowSize from '../hooks/useWindowSize';
const Inbox = ({socket}) => {
const [isProfile, setIsProfile] = useState('')
const {linkname} = useParams();
const history=useNavigate();
const dispatch=useDispatch();
const profile = useSelector((state) => state.user, shallowEqual).user;
const isPicture = useMemo(() => profile.hasOwnProperty('picture'), [profile]);
const inbox=useSelector((state) => state.messages.inbox)||[];
const messageThread = useSelector((state) => state.messages.messageThread);//console.log("messages:",messageThread);
const [newMessage, setNewMessage] = useState('');
const [page,setPage] = useState(1);
const [isLoading,setIsLoading] = useState(false);
const [receiver,setReceiver] = useState('');
const [receipent,setReceipent] = useState({});
const conversationContainerRef = useRef(null);
const [previousScrollHeight, setPreviousScrollHeight] = useState(0);
const windowSize=useWindowSize();
const [chatList, setChatList] = useState([]);
const [activeChatItem, setActiveChatItem] = useState(null);
const [receipentTooltip,setReceipentTooltip]=useState(false);
const buttonRef = useRef(null);
const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
const canSend=profile?.blockedUsers?.includes(receipent._id);

// Function to open the modal for blocking
const openModal_forBlock = (e) => {
  e.stopPropagation();
  setIsBlockModalOpen(true);

};
// Function to open the modal for deleting conversations
const openModal_forDelete = (e) => {
  e.stopPropagation();
  setIsDeleteModalOpen(true);

};
// Function to close the modal for blocking
const closeModal_forBlock = () => {
  dispatch(blockUser(profile._id,receipent._id));
  setIsBlockModalOpen(false);
  history(`/profile/${profile.linkname}/inbox`);
};
// Function to close the modal for conversations
const closeModal_forDelete = () => {
 
  dispatch(deleteChat(profile.linkname,receipent.linkname));
  setReceipent({});
  setReceiver('');
  history(`/profile/${profile.linkname}/inbox`);
  setIsDeleteModalOpen(false);
};
const cancelBlockModal=() => {
  setIsBlockModalOpen(false);
  setIsDeleteModalOpen(false);
}
  // Function to toggle the active state of a chat item
  const setActiveChat = (userId) => {
    setActiveChatItem(userId);
  };

const formatTime = (timestamp) => {
      const date = new Date(timestamp);
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
      };
const handleLinkClick = (event) => {//prevent clicks to blocked user
      // Prevent the default navigation behavior
      if( canSend){
        event.preventDefault();
      }
      

      // You can add any additional logic here if needed
      // For example, display a message or perform some other action

      // For demonstration purposes, you can log a message
     // console.log("Link click prevented.");
};

const selectThread = (message) => {
  const newPage = 1; 
  setPage(newPage);/*React state updates are not guaranteed to be synchronous, so when you set the page state to 1 directly as 'setPage(1)' and immediately dispatch getMessages, there's no guarantee that getMessages will use the updated page value. */
  dispatch(clearMessageThread());
  setReceiver(message.linkname);
  setReceipent({name:message.name,linkname:message.linkname,_id:message._id,picture:message.picture}); //
  dispatch(getMessages(linkname, message.linkname, newPage)); 
  // Set unreadCount to 0 for the selected chat item
  const updatedChatList = chatList.map((chat) => {
    if (chat.linkname === message.linkname) {
      return { ...chat, unreadCount:0 };
    }
    return chat;
  });
  setChatList(updatedChatList);

}
// Function to update the last message in the chat list
const updateChatListLastMessage = (sender, lastMessage) => {
  setChatList((prevChatList) => {
    // Create a new copy of the chat list with the updated message
    const updatedChatList = prevChatList.map((chat) => {
      if (chat.linkname === sender && receiver.length>0) {
        const timestamp = Date.now();
        return { ...chat,lastMessage, timestamp };
    
      } else if(chat.linkname === sender){       //update the unread message count only if the receiver in chaList is not active
        const timestamp = Date.now();
        const count=chat.unreadCount+1;
        return { ...chat,unreadCount:count, lastMessage, timestamp };
    
      } else{

      }
      return chat;
    });
   
    // Return the updated chat list
    return updatedChatList;
  });
};


// Handle sending a message
const handleSendMessage = () => {
  if (newMessage.trim() !== '') {
    if (socket) {
      socket.send(JSON.stringify({
        text: newMessage,
        sender: linkname,
        receiver: receiver,
        timestamp: Date.now(),
      }));
    }
    dispatch(
      sendMessage({
        text: newMessage,
        sender: linkname,
        receiver: receiver,
        timestamp: Date.now(),
      })
    )
      // Update the last message in the chat list
      updateChatListLastMessage(receiver, newMessage);
     
    setNewMessage('');
  }
};
 const handleNavigation = useCallback(() => {
 if (profile.linkname===undefined) {
   dispatch(setInbox(true));
   setTimeout(()=>history(`/login`),300);
   setIsProfile(false);
  }else{
    setIsProfile(true);
  }
 },[history, profile,dispatch]);
const getInbox=useCallback(()=>{
  if(linkname!==undefined) 
   dispatch(fetchInbox(linkname))}
  ,[linkname,dispatch]);

  const handleScroll = (e) => {
    const element = e.target;
    if (element.scrollTop === 0) {
      // Load more messages only if there are more messages to load
      if (messageThread.length >= page * 5) {
        setPage((prevPage) => prevPage + 1);
        setIsLoading(true);
        // Fetch the new page of messages
        dispatch(getMessages(linkname, receiver, page + 1));
        setTimeout(() => setIsLoading(false),300);
        //
      }
    }
  };

  // Create a ref for the receiver
const receiverRef = useRef(receiver);
// Update the ref value whenever receiver changes
useEffect(() => {
  receiverRef.current = receiver;
}, [receiver]);
   useEffect(() => {
  //let ws = null; // Declare the WebSocket outside of the useEffect

  // Create a WebSocket connection when the component mounts
  if (socket!==null) {
    
    socket.onmessage = (event) => { 
      const receivedMessage = event.data;
  
      
      try {
        const parsedMessage = JSON.parse(receivedMessage);
        // Update the messageThread state with the received message
        if (parsedMessage.sender === receiverRef.current) {
          // Update the messageThread state with the received message
        
          dispatch(setMessageThread(parsedMessage))
         
        }
        updateChatListLastMessage(parsedMessage.sender, parsedMessage.text);
       

      } catch (error) {
        console.error('Error parsing JSON:', error);
      }
    };
   
  };
}, [linkname]);
  

const sortChatListByTimestamp = (chatList) => {
  return chatList.slice().sort((a, b) => {
    const lastMessageA = a.timestamp;
    const lastMessageB = b.timestamp;
    return lastMessageB - lastMessageA;
  });
};


useEffect(() => {
  // Initialize chatList with inbox data from Redux store
  const sortedChatList = sortChatListByTimestamp(inbox);
  setChatList(sortedChatList);
}, [inbox]); // Run this effect whenever inbox changes

  useEffect(() => {
    // Calculate the difference in scroll height after new messages are loaded
    if (conversationContainerRef.current) {
      const newScrollHeight = conversationContainerRef.current.scrollHeight;
      const scrollDifference = newScrollHeight - previousScrollHeight;
      conversationContainerRef.current.scrollTop += scrollDifference;
      setPreviousScrollHeight(newScrollHeight);
    }
  }, [messageThread]);
useEffect(() => {handleNavigation()},[handleNavigation]);
useEffect(() => {getInbox()},[getInbox]);
useEffect(() => {
  const handleDocumentClick = (event) => {
    if (receipentTooltip) {
      // Check if the clicked element is not the button itself
      if (buttonRef.current && !buttonRef.current.contains(event.target)) {
        // Close the tooltip if it's open and the click is outside the button
       setReceipentTooltip(false);
      }
    }
  };

  document.addEventListener('click', handleDocumentClick);

  return () => {
    document.removeEventListener('click', handleDocumentClick);
  };
}, [receipentTooltip]);

const [isChatListEmpty,setIsChatListEmpty]=useState(false);
useEffect(() => {
  if (inbox.length === 0) {
    const timeoutId = setTimeout(() => {
      setIsChatListEmpty(true);
    }, 2000);

    return () => {
      clearTimeout(timeoutId);
    };
  } else {
    setIsChatListEmpty(false);
  }
}, [chatList]);


  return (
    <div>
      {/*for mobile browsers */}
       {windowSize.width<768&& 
      <div className="min-w-min h-screen mt-14  items-center bg-white dark:bg-gray-600 dark:group-hover:text-inherit shadow-lg   dark:border-gray-600 overflow-hidden flex flex-col  mx-auto ">
      <  div className="w-full  flex flex-col h-full ">
           <div className="w-full dark:border-gray-500 h-[8%] lg:h-[10%] flex gap-2  items-center justify-center bg-gradient-to-r from-slate-500 to-slate-700 dark:from-slate-700 dark:to-slate-800 ">
              <Link to={`/profile/${linkname}`} className="flex gap-1 items-center justify-center  text-white hover:text-blue-500">
              {isPicture?<img src={profile.picture} className="object-cover h-7 w-7  my-auto rounded-full "/>
              :  <div className={`${generateColor(profile?.name?.[0].toUpperCase())}  h-7 hover:h-8 w-7 hover:w-8  my-auto rounded-full text-white flex items-center justify-center`}>
              {profile?.name?.[0].toUpperCase()}
            </div>}
              <p>{profile.name}</p>
              </Link>
       </div>
   
      {chatList.length>0? (
         <div className="w-full dark:border-gray-500 h-full flex flex-col bg-slate-300 dark:bg-slate-600">
             {
          chatList.map((message,index)=>{
            const currentDate = new Date(message.timestamp);
            const prevMessage = message[index - 1];
            const prevDate = prevMessage
              ? new Date(prevMessage.timestamp)
              : null;
            const showDate =
            !prevDate ||
            currentDate.toDateString() !== prevDate.toDateString();
            const isActive = message.linkname === activeChatItem;
            return (
              <Link
              to={`/profile/${profile.linkname}/message/${message.linkname}`}
                key={index}
                className={`w-full flex flex-col ${
                  isActive ? 'bg-slate-50 dark:bg-gradient-to-r from-slate-500 to-slate-700  dark:text-gray-200 border-l-2 border-blue-500 border-r-2 dark:border-r-0' 
                  : 'hover:bg-white dark:hover:bg-gray-600 dark:hover:text-white  border-b-2 text-gray-700 dark:text-gray-300 dark:border-gray-500'
                }`}
              >
                <div
                  className="flex  cursor-pointer p-2"
                >
                  <div className="flex h-full w-10">
                  {
                    !message.picture||message.picture===undefined ?
                    <div className={`${generateColor(message?.name?.[0].toUpperCase())}  h-7 hover:h-8 w-7 hover:w-8  my-auto rounded-full text-white flex items-center justify-center`}>
                    {message?.name?.[0].toUpperCase()}
                   </div>: <img src={message.picture} className="object-cover h-7 w-7  my-auto rounded-full "/>
                    
                }
                   
                  </div>
                    <div className="flex flex-col h-full w-[90%]">
                      <div className="flex justify-between">
                        <p>{message.name}</p>
                        <p>{formatTime(message.timestamp)}</p>
                      </div>
                      <div className="flex justify-between">
                        <p className={`${message.unreadCount>0&&`font-semibold`}`}>{message.lastMessage.length>25?(message.lastMessage).substring(0,30)+'...':message.lastMessage}</p>
                        {message.unreadCount>0&&<p className="font-semibold">{message.unreadCount} new</p>}
                      </div>
                  </div>
                </div>
              </Link>
            );
          })
        }</div>):isChatListEmpty?(
          <div  className="w-full dark:border-gray-500 h-[90%] flex flex-col gap-2 bg-slate-300 dark:bg-slate-600 items-center justify-center">
             <p>Inbox is empty! To start a conversation</p> 
             <Link to={`/profile/${linkname}/followers`} className="w-24 h-8 bg-blue-500 hover:bg-blue-700 flex items-center justify-center text-white rounded-md ">
              <p>
              Click here
                </p></Link>
            </div>
       ):(
        <div className="flex  w-full gap-4 mx-auto h-[550px] bg-inherit dark:bg-gray-600 rounded-md items-center justify-center"><svg aria-hidden="true" class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
    </svg>
    <span class="sr-only"></span>Loading...</div>
        )}</div>
      </div>}
      {/*for desktop browsers*/}
      
      <div className="hidden sm:block py-20" >
     {isProfile?
      <div className=" bg-white dark:bg-gray-600 dark:group-hover:text-inherit shadow-lg rounded-md  dark:border-gray-600 overflow-hidden flex w-[90%] h-[550px] mx-auto ">
      {/*left side*/}
       <div className="w-[40%]  flex flex-col h-full">
     <div className="w-full  dark:border-gray-500 h-[10%] flex gap-2 items-center justify-center bg-gradient-to-r from-slate-500 to-slate-700 dark:from-gray-600 dark:to-gray-700 ">
       
        <Link to={`/profile/${linkname}`} className="flex gap-1 items-center justify-center text-white hover:text-blue-400">
        {isPicture?<img src={profile.picture} className="object-cover h-7 w-7  my-auto rounded-full "/>
        :  <div className={`${generateColor(profile?.name?.[0].toUpperCase())}  h-7 hover:h-8 w-7 hover:w-8  my-auto rounded-full text-white flex items-center justify-center`}
                   
        >
        {profile?.name?.[0].toUpperCase()}
       </div>}
        <p>{profile.name}</p>
        </Link>
       </div>
   
      {chatList.length>0? (
         <div className="w-full dark:border-gray-500 h-[90%] flex flex-col bg-slate-300 dark:bg-slate-700 overflow-y-auto">
             {
          chatList.map((message,index)=>{
            const currentDate = new Date(message.timestamp);
            const prevMessage = message[index - 1];
            const prevDate = prevMessage
              ? new Date(prevMessage.timestamp)
              : null;
            const showDate =
            !prevDate ||
            currentDate.toDateString() !== prevDate.toDateString();
            const isActive = message.linkname === activeChatItem;
            return (
              <div
                key={index}
                className={`w-full flex flex-col ${
                  isActive ? 'bg-slate-100 dark:bg-gradient-to-r from-slate-500 to-slate-700 dark:from-slate-300 dark:to-slate-400 dark:text-gray-800 border-l-2 border-l-blue-500  dark:border-r-0'  
                  : 'hover:bg-slate-400 hover:text-gray-100 dark:hover:bg-slate-600 dark:hover:text-white  border-b-[1px] border-b-gray-400 text-gray-700 dark:text-gray-200 '
                }`}
              >
                <div
                  onClick={() => {
                    setActiveChat(message.linkname);
                    selectThread(message);
                  }}
                  className="flex  cursor-pointer p-2"
                >
                  <div className="flex h-full w-10">
                  {
                    !message.picture||message.picture===undefined ?
                    <div className={`${generateColor(message?.name?.[0].toUpperCase())}  h-7 hover:h-8 w-7 hover:w-8  my-auto rounded-full text-white flex items-center justify-center`}>
                    {message?.name?.[0].toUpperCase()}
                   </div>: <img src={message.picture} className="object-cover  h-7 hover:h-8 w-7 hover:w-8  my-auto rounded-full "/>
                    
                }
                   
                  </div>
                    <div className="flex flex-col h-full w-[90%]">
                      <div className="flex justify-between">
                        <p>{message.name}</p>
                        <p>{formatTime(message.timestamp)}</p>
                      </div>
                      <div className="flex justify-between">
                        <p className={`${message.unreadCount>0&&`font-semibold`}`}>{message.lastMessage.length>25?(message.lastMessage).substring(0,30)+'...':message.lastMessage}</p>
                        {message.unreadCount>0&&<p className="font-semibold">{message.unreadCount} new</p>}
                      </div>
                
                  </div>
                </div>
              </div>
            );
          })
        }</div>):isChatListEmpty?(<div className=" bg-inherit dark:bg-gray-600 dark:group-hover:text-inherit shadow-lg rounded-md  dark:border-gray-600 overflow-hidden flex flex-col w-[60%] h-[550px] mx-auto ">
          <div className="w-full  dark:border-gray-500 h-[10%] flex gap-2 items-center justify-center bg-gradient-to-r from-slate-500 to-slate-700 dark:from-slate-700 dark:to-slate-800 ">
             
             <Link to={`/profile/${linkname}`} className="flex gap-1 items-center justify-center text-white hover:text-blue-500">
             {isPicture?<img src={profile.picture} className="object-cover h-7 w-7  my-auto rounded-full "/>
             :  <div className={`${generateColor(profile?.name?.[0].toUpperCase())}  h-7 hover:h-8 w-7 hover:w-8  my-auto rounded-full text-white flex items-center justify-center`}>
             {profile?.name?.[0].toUpperCase()}
            </div>}
             <p>{profile.name}</p>
             </Link>
            </div>
            <div  className="w-full dark:border-gray-500 h-[90%] flex flex-col gap-2 bg-slate-300 dark:bg-slate-600 items-center justify-center">
               <p>Inbox is empty! To start a conversation</p> 
               <Link to={`/profile/${linkname}`} className="w-24 h-8 bg-blue-500 hover:bg-blue-700 flex items-center justify-center text-white rounded-md ">
                <p>
                Click here
                  </p></Link>
              </div>
          </div>):(<div className="flex  w-full gap-4 mx-auto h-[550px] bg-inherit dark:bg-gray-600 rounded-md items-center justify-center"><svg aria-hidden="true" class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
    </svg>
    <span class="sr-only"></span>Loading...</div>)}</div>
        {/*Right side*/}
      
      {
        receiver.length>1 ? (
        <div className="w-[60%]  flex flex-col h-full">
          <div  className="w-full  dark:border-gray-500 h-[10%] flex items-center justify-end gap-[45%] bg-gradient-to-r from-slate-500 to-slate-700 dark:from-gray-600 dark:to-gray-800">
       
              {!canSend?<Link to={`/profile/${receipent.linkname}`} onClick={handleLinkClick} className="flex gap-1 items-center justify-center text-white hover:text-blue-400">
              {
                    !receipent.picture||receipent.picture===undefined ?
                    <div className={`${generateColor(receipent?.name?.[0].toUpperCase())}  h-7 hover:h-8 w-7 hover:w-8  my-auto rounded-full text-white flex items-center justify-center`}
                   
                    >
                    {receipent?.name?.[0].toUpperCase()}
                   </div>: <img src={receipent.picture} className="object-cover  h-7 hover:h-8 w-7 hover:w-8  my-auto rounded-full "/>
                    
                }
                <p>{receipent.name}</p>
                </Link>:<div className="flex items-center justify-between gap-2 text-white">
                  <div className={`${generateColor(receipent?.name?.[0].toUpperCase())}  h-7 hover:h-8 w-7 hover:w-8  my-auto rounded-full text-white flex items-center justify-center`}>
                   {receipent?.name?.[0].toUpperCase()}
                  </div> 
                  <p>{receipent?.name}</p>
                 </div>}
                <button  onClick={()=>{setReceipentTooltip(!receipentTooltip)}}  ref={buttonRef}
                    className="my-auto w-5 h-5 hover:bg-slate-500 mx-2 rounded-full text-white">
                    <svg aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5"  viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                  </button>
                  {receipentTooltip && (
                    <div className="absolute  w-32 h-32 top-[16%] lg:right-20 right-[5px] bg-white dark:bg-gray-600 rounded-lg">
                      <div
                        className="absolute w-4 h-4 bg-inherit border-inherit transform rotate-45 -top-1 left-3/4"
                        style={{ marginLeft: '-1px' }} // Corrected to use an object for inline styles
                       ></div>
                      <div className="flex flex-col justify-between items-center gap-2 my-4">
                        <Link to={`/profile/${receipent.linkname}`}
  
                          className=" w-[100px] h-7 text-center rounded-lg py-auto hover:bg-slate-500 dark:hover:bg-slate-50 hover:text-slate-50 flex gap-2 mx-auto justify-center text-blue-900 dark:text-white dark:hover:text-gray-900"
                        >
                          Visit profile
                        </Link>
                        <button
                          onClick={(e) => openModal_forDelete(e)}
                          className=" w-[100px] h-7 text-center rounded-lg py-auto hover:bg-slate-500 dark:hover:bg-slate-50 hover:text-slate-50 flex gap-2 mx-auto justify-center text-blue-900 dark:text-white dark:hover:text-gray-900"
                        >
                          Delete chat
                        </button>
                        <Prompt
                          isOpen={isDeleteModalOpen}
                          message={"Do you want to delete this conversation?"}
                          closeModal={closeModal_forDelete}
                          cancelModal={cancelBlockModal}
                        />
                        <button
                          onClick={(e) => openModal_forBlock(e)}
                          className=" w-[100px] h-7 text-center rounded-lg py-auto hover:bg-slate-500 dark:hover:bg-slate-50 hover:text-slate-50 flex gap-2 mx-auto justify-center text-blue-900 dark:text-white dark:hover:text-gray-900"
                        >
                          Block
                        </button>
                        <Prompt
                          isOpen={isBlockModalOpen}
                          message={"Do you want to block this user?"}
                          closeModal={closeModal_forBlock}
                          cancelModal={cancelBlockModal}
                        />
                      </div>
                    </div>
)}
              </div>
           <div className="flex flex-col w-full h-[90%]  dark:border-gray-500 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-300 to-slate-400 dark:from-slate-500 dark:to-slate-600">
           {messageThread.length>0?(<div onScroll={handleScroll}  ref={conversationContainerRef} className="flex-grow flex-col p-4 overflow-y-auto h-[500px]">
         {isLoading?(<div className="flex  w-full gap-4 mx-auto  bg-inherit  rounded-md items-center justify-center"><svg aria-hidden="true" class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
    </svg>
    <span class="sr-only"></span>Loading...</div>):(<></>)}
          {messageThread.map((message, index) => {
            const currentDate = new Date(message.timestamp);
            const prevMessage = message[index - 1];
            const prevDate = prevMessage
              ? new Date(prevMessage.timestamp)
              : null;

            const showDate =
              !prevDate ||
              currentDate.toDateString() !== prevDate.toDateString();

            return (
              <div
                key={index}
                className={`mb-2 ${
                  message.sender === linkname ? 'ml-auto' : 'mr-auto'
                }`}
                style={{
                  minWidth: '50px',
                  maxWidth: '70%',
                  width: 'fit-content',
                }}
              >
                {showDate && (
                  <p className="text-xs mb-1 text-center text-gray-100 dark:text-gray-200">
                    {currentDate.toDateString()}
                  </p>
                )}
                <div
                  className={`mb-2 ${
                    message.sender === linkname
                      ? 'bg-gradient-to-r from-indigo-400 to-blue-400 text-gray-50 text-left'
                      : 'bg-gray-50 dark:bg-gray-200 text-left text-gray-800'
                  } ${
                    message.sender === linkname
                      ? 'rounded-tl-none'
                      : 'rounded-tr-none'
                  } rounded-md p-2`}
                >
                  <p className={`text-xs mb-1 ${
                      message.sender === linkname
                        ? 'text-right text-gray-300'
                        : 'text-left text-gray-500'
                    }`}>
                    {formatTime(message.timestamp)}
                  </p>
                  <p>{message.text}</p>
                </div>
              </div>
            );
          })}
        </div>):(<div className="flex  w-full gap-4 mx-auto h-[550px] bg-inherit dark:bg-gray-600 rounded-md items-center justify-center"><svg aria-hidden="true" class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
    </svg>
    <span class="sr-only"></span>Loading...</div>)}
        <div className="p-4 flex items-center w-full">
          <input
            type="text"
            className="flex-grow p-2 border dark:border-gray-700 focus:outline-none rounded-lg mr-2 dark:bg-gray-600 w-[80%]"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button
            className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-600 hover:to-indigo-800 text-white rounded-lg w-28"
            onClick={handleSendMessage}
            disabled={canSend}
          >
            <div className="w-5 h-5">
            <svg className="svg-icon" viewBox="0 0 20 20" fill="white">
							<path d="M17.218,2.268L2.477,8.388C2.13,8.535,2.164,9.05,2.542,9.134L9.33,10.67l1.535,6.787c0.083,0.377,0.602,0.415,0.745,0.065l6.123-14.74C17.866,2.46,17.539,2.134,17.218,2.268 M3.92,8.641l11.772-4.89L9.535,9.909L3.92,8.641z M11.358,16.078l-1.268-5.613l6.157-6.157L11.358,16.078z"></path>
						</svg>
            </div>
           <p>Send</p>
          </button>
        </div>
            </div>
        </div>):(<div className="h-full w-[60%] text-gray-100 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-500 to-slate-600 flex inset-0 items-center justify-center">
          Select a Conversation on the left
          </div>)
      }   
  </div>
   :isChatListEmpty?(<div className=" bg-inherit dark:bg-gray-600 dark:group-hover:text-inherit shadow-lg rounded-md  dark:border-gray-600 overflow-hidden flex flex-col w-[60%] h-[550px] mx-auto ">
    <div className="w-full  dark:border-gray-500 h-[10%] flex gap-2 items-center justify-center bg-gradient-to-r from-slate-500 to-slate-700 dark:from-slate-700 dark:to-slate-800 ">
       
       <Link to={`/profile/${linkname}`} className="flex gap-1 items-center justify-center text-white hover:text-blue-500">
       {isPicture?<img src={profile.picture} className="object-cover h-7 w-7  my-auto rounded-full "/>
       :  <div className={`${generateColor(profile?.name?.[0].toUpperCase())}  h-7 hover:h-8 w-7 hover:w-8  my-auto rounded-full text-white flex items-center justify-center`}>
       {profile?.name?.[0].toUpperCase()}
      </div>}
       <p>{profile.name}</p>
       </Link>
      </div>
      <div  className="w-full dark:border-gray-500 h-[90%] flex flex-col gap-2 bg-slate-300 dark:bg-slate-600 items-center justify-center">
         <p>Inbox is empty! To start a conversation</p> 
         <Link to={`/profile/${linkname}`} className="w-24 h-8 bg-blue-500 hover:bg-blue-700 flex items-center justify-center text-white rounded-md ">
          <p>
          Click here
            </p></Link>
        </div>
    </div>):(
      <div className="flex  w-full gap-4 mx-auto h-[550px] bg-inherit dark:bg-gray-600 rounded-md items-center justify-center"><svg aria-hidden="true" class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
      <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
  </svg>
  <span class="sr-only"></span>Loading...</div>
    )}
    </div>
    </div>
   
  )
}

export default Inbox;
