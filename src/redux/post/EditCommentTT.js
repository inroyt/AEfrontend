import React, { useState} from 'react';
import { useNavigate } from 'react-router-dom';

import api from '../../api/data';
import { useDispatch } from 'react-redux';
import { editComment, deleteComment,getComments } from './postSlice';

const EditCommentTT = ({ isOpen, setIsOpen, comment }) => {
    const page=1;
    const dispatch = useDispatch();
    const [inputText, setInputText] = useState(comment.text);
    const commentId = comment._id;console.log(commentId);
    const postId=comment.postId;
    const handleInputChange = (e) => {
        setInputText(e.target.value);
    };

    const handleSave = async () => {console.log(commentId);
        try {
            const response = await api.post(`/api/post/comment/edit/${commentId}`, { newText: inputText }, { withCredentials: true });
            if (response.status === 200) {
                setIsOpen(false);
                dispatch(editComment(inputText,commentId));
            }
        } catch (err) {
            console.error(err);
            window.alert(err.response.data.message);
          }
    };

    const handleDelete = async () => {//console.log('commentID: ' + commentId);
        try {
            const response = await api.delete(`/api/post/comment/delete/${commentId}`, { withCredentials: true });
            if (response.status === 200) {
                setIsOpen(false);
                dispatch(deleteComment(commentId));
                dispatch(getComments(postId, page));
            
               
            }
        }  catch (err) {
            console.error(err);
            window.alert(err.response.data.message);
          }
    };

    return (
      <div className="w-full h-full flex flex-col">
      <textarea
          value={inputText}
          onChange={handleInputChange}
          className="w-full h-full resize-none dark:text-gray-500 outline-none rounded-lg p-1"
          style={{ minHeight: '100px', maxHeight: '200px', overflowY: 'auto' }}
      />
      <div className="mt-4 flex justify-end gap-2">
          <button onClick={handleDelete} className="px-4 py-2 rounded-md bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-700  text-gray-100 hover:text-white">Delete</button>
          <button onClick={handleSave} className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded">Save</button>
          <button onClick={()=>setIsOpen(!isOpen)} className="px-4 py-2 bg-slate-500 dark:bg-slate-600 text-white hover:bg-slate-600 rounded">Cancel</button>
      </div>
  </div>
    );
}

export default EditCommentTT;
