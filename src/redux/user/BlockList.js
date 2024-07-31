import React,{useState} from 'react'
import Modal from 'react-modal';
import { useDispatch } from 'react-redux';
import { removeBlock } from './userSlice';
const BlockList = ({ isOpen, onClose, blockedUsers, onUnblock }) => {
 // console.log(blockedUsers);
    const dispatch=useDispatch();
    return (
      <Modal
        isOpen={isOpen}
        onRequestClose={onClose}
        contentLabel="Blocked Users Modal"
        className="fixed inset-0 flex items-center justify-center"
      >
        <div className="fixed inset-0 min-h-screen bg-black opacity-30  transition-opacity z-[-10]" ></div>
       <div className="bg-white p-4 rounded shadow-lg w-[400px] h-[200px]">
        <div className="flex justify-between">
        <h2 className="text-2xl font-bold mb-4">Blocked Users</h2>
        <button
          className=" bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold rounded h-6 w-6"
          onClick={onClose}
        >
        <svg aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="M6 18L18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round"></path>
</svg>
        </button>
        </div>
      
       {blockedUsers.length>0? <ul>
          {blockedUsers.map((user) => (
            <li key={user.id} className="flex justify-between items-center mb-2">
              {user.name}
              <button
                className="bg-red-500 text-white px-3 py-2  rounded"
                onClick={() => {onUnblock(user._id);dispatch(removeBlock(user._id));}}
              >
                Unblock
              </button>
            </li>
          ))}
        </ul>:
        <p>Block list is empty</p>
        }
       
       </div>
      </Modal>
    );
  };

export default BlockList
