import React, { useState, useEffect, useCallback,useRef } from 'react';
import { useDispatch, useSelector,shallowEqual } from 'react-redux';
import { sendMessage, getMessages,clearMessageThread,setMessageThread,deleteChat } from './messageSlice';
import { useParams,Link,useNavigate } from 'react-router-dom';
import { setOtherUser,clearOtherUser } from './userSlice';
import { blockUser } from './userSlice';
import { generateColor } from '../../components/ColourMap';
import Prompt from './Prompt';
import api from '../../api/data'
const Conversation = ({socket}) => {
  const { linkname, otherLinkname } = useParams();
  const profile = (useSelector((state) => state.user,shallowEqual)).user;
  const history=useNavigate();
  const dispatch = useDispatch();
  const otherProfile = useSelector((state) => state.user.otherUser);
  const messageThread = useSelector((state) => state.messages.messageThread);
  const [newMessage, setNewMessage] = useState('');
  const [page,setPage] = useState(1);
  const [isLoading,setIsLoading] = useState(false);
  const conversationContainerRef = useRef(null);
  const [previousScrollHeight, setPreviousScrollHeight] = useState(0);
  const [receipentTooltip,setReceipentTooltip]=useState(false);
  const buttonRef = useRef(null);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const isBlocked=profile?.blockedUsers?.includes(otherProfile._id)
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };
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
  dispatch(blockUser(profile._id,otherProfile._id));
  setIsBlockModalOpen(false);
  history(`/profile/${linkname}/inbox`);
};
// Function to close the modal for conversations
const closeModal_forDelete = () => {
  
  dispatch(deleteChat(linkname,otherLinkname));
 
  history(`/profile/${linkname}/inbox`);
  setIsDeleteModalOpen(false);
};
const cancelBlockModal=() => {
  setIsBlockModalOpen(false);
  setIsDeleteModalOpen(false);
}
  const handleSendMessage = () => {
    if (newMessage.trim() !== '') {
      if (socket) {
        socket.send(JSON.stringify({
          text: newMessage,
          sender: linkname,
          receiver: otherLinkname,
          timestamp: Date.now(),
        }));
      }
      const newMessageData = {
        text: newMessage,
        sender: linkname,
        receiver: otherLinkname,
        timestamp: Date.now(),
      };
      // Check if the new message is not already in the messageThread
      const isMessageInThread = messageThread.some(
        (message) =>
          message.sender === newMessageData.sender &&
          message.receiver === newMessageData.receiver &&
          message.timestamp === newMessageData.timestamp
      );
  
      if (!isMessageInThread) {
        dispatch(setMessageThread(newMessageData));
      }
  
      // Send the message as you normally do
      dispatch(sendMessage(newMessageData));
  
      setNewMessage('');
    }
  };
  

  const getConversation = useCallback(() => {
    dispatch(getMessages(linkname, otherLinkname,page));
    
  }, []);
  const getOtheruserOnRefresh= useCallback(async () => {
    try{
      if(otherLinkname !== undefined){
        dispatch(clearOtherUser());
        const response = await api.get(`/api/profile/${otherLinkname}`, { withCredentials: true });
        dispatch(setOtherUser(response.data));
      }
    }catch(e){
      console.log(e);
    }
   
  },[linkname,otherLinkname]);

  useEffect(() => {
    if(linkname==="undefined"){
      history('/login')
    }
    dispatch(clearMessageThread());
    getConversation();
    getOtheruserOnRefresh();
  }, [linkname,otherLinkname]);
  const handleScroll = (e) => {
    const element = e.target;
    if (element.scrollTop === 0) {
      // Load more messages only if there are more messages to load
      if (messageThread.length >= page * 5) {
        setPage((prevPage) => prevPage + 1);
        setIsLoading(true);
        // Fetch the new page of messages
        dispatch(getMessages(linkname, otherLinkname, page + 1));
        setTimeout(() => setIsLoading(false),300);
        //
      }
    }
  };
  const [showStartConversation, setShowStartConversation] = useState(false);

  useEffect(() => {
    if (messageThread.length === 0) {
      const timeoutId = setTimeout(() => {
        setShowStartConversation(true);
      }, 2000);

      return () => {
        clearTimeout(timeoutId);
      };
    } else {
      setShowStartConversation(false);
    }
  }, [messageThread]);

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

  useEffect(() => {
    // Calculate the difference in scroll height after new messages are loaded
    if (conversationContainerRef.current) {
      const newScrollHeight = conversationContainerRef.current.scrollHeight;
      const scrollDifference = newScrollHeight - previousScrollHeight;
      conversationContainerRef.current.scrollTop += scrollDifference;
      setPreviousScrollHeight(newScrollHeight);
    }
  }, [messageThread]);


     useEffect(() => {
    //let ws = null; // Declare the WebSocket outside of the useEffect
   // console.log('WebSocket useEffect',socket); 
    // Create a WebSocket connection when the component mounts
    if (socket!==null) {
      
      socket.onmessage = (event) => { //console.log('WebSocket message event registered'); 
        const receivedMessage = event.data;
        
        
        try {
          const parsedMessage = JSON.parse(receivedMessage);
       
          dispatch(setMessageThread(parsedMessage))
          
         // updateChatListLastMessage(parsedMessage.sender, parsedMessage.text);
         
  
        } catch (error) {
          console.error('Error parsing JSON:', error);
        }
      };
     
    };
  }, [profile]);
  return (
    <div className="flex flex-col h-[724px] md:w-[60%] w-full mx-auto mt-14 lg:py-8">
      <div className="w-full  dark:border-gray-500 h-[10%] lg:rounded-md lg:rounded-bl-none lg:rounded-br-none flex items-center justify-between  bg-slate-500 dark:bg-slate-600">
        {!isBlocked?<Link to={`/profile/${otherLinkname}`}className="flex gap-1 mx-auto items-center justify-center text-white hover:text-blue-500">
        {
                    otherProfile?.picture?.length>0
                    ?<img src={otherProfile.picture} className="object-cover h-7 w-7  my-auto rounded-full "/>
                    :<div className={otherProfile.name ? `${generateColor(otherProfile?.name?.[0]?.toUpperCase())} h-7 hover:h-8 w-7 hover:w-8 my-auto rounded-full text-white flex items-center justify-center` : ''}>
                      {otherProfile?.name?.[0]?.toUpperCase()}</div>
                    
                }
          <p>{otherProfile.name}</p>
          </Link>:<div className="flex gap-1 mx-auto items-center justify-center text-white hover:text-blue-500">
                  <div className={`${generateColor(otherProfile?.name?.[0].toUpperCase())}  h-7 hover:h-8 w-7 hover:w-8  my-auto rounded-full text-white flex items-center justify-center`}>
                   {otherProfile?.name?.[0].toUpperCase()}
                  </div> 
                  <p>{otherProfile?.name}</p>
                 </div>}
          <button  onClick={()=>{setReceipentTooltip(!receipentTooltip)}}  ref={buttonRef}
                    className="my-auto w-5 h-5 hover:bg-slate-500 mx-2 rounded-full text-white">
                    <svg aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5"  viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                  </button>
                  {receipentTooltip && (
                    <div className="absolute  w-32 h-32 top-[14%] lg:top-[18%] right-1 lg:right-[20%] bg-white dark:bg-gray-700 rounded-lg">
                       <div
                        className="absolute w-4 h-4 bg-inherit border-inherit transform rotate-45 -top-1 left-[75%]"
                        style={{ marginLeft: '-1px' }} // Corrected to use an object for inline styles
                       ></div>
                      <div className="flex flex-col justify-between items-center gap-2 my-4">
                        <Link to={`/profile/${otherLinkname}`}
  
                          className=" w-[100px] h-7 text-center rounded-lg py-auto hover:bg-slate-100 flex gap-2 mx-auto justify-center text-blue-900 dark:text-white dark:hover:text-gray-900"
                        >
                          Visit profile
                        </Link>
                        <button
                          onClick={(e) => openModal_forDelete(e)}
                          className=" w-[100px] h-7 text-center rounded-lg py-auto hover:bg-slate-100 flex gap-2 mx-auto justify-center text-blue-900 dark:text-white dark:hover:text-gray-900"
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
                          className=" w-[100px] h-7 text-center rounded-lg py-auto hover:bg-slate-100 flex gap-2 mx-auto justify-center text-blue-900 dark:text-white dark:hover:text-gray-900"
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
      <div className="flex flex-col w-full gap-4 mx-auto h-full rounded-bl-md rounded-br-md bg-slate-200 lg:bg-slate-400 dark:bg-slate-500 lg:dark:bg-gray-400">
        {messageThread.length>=1?(<div onScroll={handleScroll}  ref={conversationContainerRef} className="flex-grow flex-col p-4 overflow-y-auto h-[500px]">
         {isLoading?( <div className="flex  w-full gap-4 mx-auto  bg-inherit  rounded-md items-center justify-center"><svg aria-hidden="true" class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                  <p className="text-xs mb-1 text-center text-gray-500 dark:text-gray-200">
                    {currentDate.toDateString()}
                  </p>
                )}
                <div
                  className={`mb-2 ${
                    message.sender === linkname
                    ? 'bg-gradient-to-r from-indigo-400 to-blue-400 text-gray-50 text-left'
                    : 'bg-white dark:bg-gray-200 text-left text-gray-800'
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
        </div>):(
          showStartConversation&&messageThread.length===0 ? (
            <p className="flex w-full gap-4 mx-auto h-full bg-inherit items-center justify-center">
              Start a new conversation
            </p>
          ) : (
            <div className="flex  w-full gap-4 mx-auto h-full bg-inherit dark:bg-gray-600 rounded-md items-center justify-center"><svg aria-hidden="true" class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
    </svg>
    <span class="sr-only"></span>Loading...</div>
          )
        )}
        <div className="p-4 flex items-center ">
          <input
            type="text"
            className="flex-grow p-2 outline-none bg-slate-50 dark:bg-gray-300 dark:text-gray-500 shadow-inner rounded-lg mr-2"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
           <button
            className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-600 hover:to-indigo-800 text-white rounded-lg w-28"
            onClick={handleSendMessage}
            disabled={isBlocked}
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
    </div>
  );
};

export default Conversation;



/**
 * // Example: Assuming message.timestamp contains a stored timestamp
const timestamp = new Date(message.timestamp);
console.log(timestamp.toISOString()); // Convert to ISO string for display

 */