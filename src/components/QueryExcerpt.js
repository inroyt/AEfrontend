import React from 'react'
import { useDispatch } from 'react-redux';
import { deleteQuery } from '../redux/user/messageSlice';
const QueryExcerpt = ({query,page}) => {
  
  const queryId=query._id;
  const dispatch=useDispatch();
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

  return (
    <div className="flex flex-col flex-grow gap-2 p-4 justify-center dark:bg-slate-700 dark:text-gray-100 rounded-md shadow-md">
      <div className="border-b-2 border-blue-500 py-2 lg:w-2/3" >
        <p className="font-semibold text-base">From: <span className="font-bold text-lg">{query.email}</span></p>
      </div>
      <div className="border-b-2 border-blue-500 py-2 lg:w-1/3" >
        <p className="font-semibold text-base">Subject: <span className="font-bold text-lg">{query.query}</span></p>
      </div>
      <div className="py-2  font-normal text-base">{query.message}</div>
      <div className="py-2  flex justify-between">
        <p className="font-normal text-base">{formatTimestamp(query.timestamp)}</p>
        <button 
        onClick={()=>dispatch(deleteQuery(queryId,page))}
        className="p-2 bg-blue-500 hover:bg-blue-700 rounded-md text-gray-100"
        >delete</button>
      </div>
    </div>
  )
}

export default QueryExcerpt
