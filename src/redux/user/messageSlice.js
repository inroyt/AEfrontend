import { createSlice } from '@reduxjs/toolkit';
import api from '../../api/data';
const initialState = {
  isInboxOpen: false,
  inbox: [],
  messageThread: [],
  unreadTextCount: 0,
  supportQueries: [],
  applyList: []
};

const messageSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    getInbox: (state, action) => {
      (action.payload).map(x => state.inbox.push(x))
    },
    setInbox: (state, action) => {
      state.isInboxOpen = action.payload;
    },
    clearInbox: (state) => {
      state.inbox = [];
    },
    setUnreadTextCount: (state, action) => {
      state.unreadCount += 1;
    },
    setMessageThread: (state, action) => {
      const newMessage = action.payload;

      // Check if a message with the same sender, receiver, and timestamp exists
      const existingMessageIndex = state.messageThread.findIndex(
        (message) =>
          message.sender === newMessage.sender &&
          message.receiver === newMessage.receiver &&
          message.timestamp === newMessage.timestamp
      );

      if (existingMessageIndex === -1) {
        // Message is not in the array, so add it
        state.messageThread.push(newMessage);
      } else {
        // Message already exists, you can choose to update it or handle it differently
        // For example, you can replace the existing message with the new one
        state.messageThread[existingMessageIndex] = newMessage;
      }
    },


    clearMessageThread: (state) => {
      state.messageThread = [];
    },
    prependOlderMessages: (state, action) => {
      const olderMessages = action.payload;
      state.messageThread = [...olderMessages, ...state.messageThread];

    },
    setSupport: (state, action) => {
      if (action.payload) {
        const uniqueQueries = new Set([
          ...state.supportQueries.map(post => JSON.stringify(post)),
          ...action.payload.map(post => JSON.stringify(post))
        ]);
        state.supportQueries = Array.from(uniqueQueries).map(post => JSON.parse(post));
      } else {
        console.log("setSupport received undefined or empty payload");
      }
    },

    eraseSupport: (state, action) => {
      const queryId = action.payload;
      state.supportQueries = state.supportQueries.filter(query => query._id !== queryId);
    },

    setApplyList: (state, action) => {
      if (action.payload) {
        const uniqueQueries = new Set([
          ...state.applyList.map(post => JSON.stringify(post)),
          ...action.payload.map(post => JSON.stringify(post))
        ]);
        state.applyList = Array.from(uniqueQueries).map(post => JSON.parse(post));
      } else {
        console.log("setSupport received undefined or empty payload");
      }
    },

    eraseApplyList: (state, action) => {
      const queryId = action.payload;
      state.applyList = state.applyList.filter(query => query._id !== queryId);
    },

  },
});
export const sendMessage = (message) => {
  return async (dispatch) => {
    try {
      const response = await api.post('/api/sendMessage', { message }, { withCredentials: true })
      /* req.body in backend will be something like { message: { text: 'yellow', sender: 'prabinroy1', receiver: 'hemanta1' }*/
      if (response.status === 200) {
        dispatch(setMessageThread(message));
      }


    } catch (error) {
      console.error(error);
      // You might want to dispatch an error action here if needed
    }
  };
};
export const getMessages = (linkname, otherLinkname, page) => {
  if (linkname !== undefined && otherLinkname !== undefined && page !== undefined)
    return async (dispatch) => {
      try {
        const response = await api.get(`/api/getMessages/${linkname}/${otherLinkname}?page=${page}`, { withCredentials: true });
        if (response.status === 200) {


          const texts = response.data;
          if (page === 1) {
            dispatch(clearMessageThread());
          }

          if (page > 1) {
            dispatch(prependOlderMessages(texts));
          }

          // Only dispatch new messages for the current page
          if (texts.length > 0) {
            texts.forEach((text) => {
              dispatch(setMessageThread(text));
            });
          }
        }


      } catch (error) {
        console.error(error);
        // You might want to dispatch an error action here if needed
      }
    };
};
export const fetchInbox = (linkname) => {
  if (linkname !== undefined)
    return async (dispatch) => {
      try {
        const response = await api.get(`/api/inbox/${linkname}`, { withCredentials: true })
        if (response.status === 200) {
          const inbox = response.data;
          dispatch(clearInbox());
          dispatch(getInbox(inbox));
        }
      } catch (e) { console.log(e) }
    }
};
export const deleteChat = (linkname, otherLinkname) => {
  if (linkname !== undefined && otherLinkname !== undefined)
    return async (dispatch) => {
      const response = await api.delete(`/api/deleteMessages/${linkname}/${otherLinkname}`, { withCredentials: true });
      if (response.status === 200) {
        dispatch(fetchInbox(linkname));//update inbox after deleting
      }
    }
};

export const fetchQueries = (page) => {
  if (page !== undefined) {
    return async (dispatch) => {

      const response = await api.get(`/api/supportQueries/?page=${page}`);

      if (response.status === 200) {
        dispatch(setSupport(response.data));
      } else {
        console.log("Failed to fetch data, status:", response.status);
      }

    };
  } else {
    console.log("Page is undefined, no action dispatched");
  }
};

export const deleteQuery = (queryId, page) => {
  return async (dispatch) => {
    if (queryId !== undefined) {
      const response = await api.delete(`/api/supportQueries/delete/${queryId}`, { withCredentials: true });
      if (response.status === 200) {
        dispatch(eraseSupport(queryId));
        dispatch(fetchQueries(page));
        alert(response.data.message);

      } else {
        alert(response.data.message);
      }
    }
  }
}

export const fetchApplyList = (page) => {
  if (page !== undefined) {
    return async (dispatch) => {

      const response = await api.get(`/api/applyList/?page=${page}`);

      if (response.status === 200) {
        dispatch(setApplyList(response.data));
      } else {
        console.log("Failed to fetch data, status:", response.status);
      }

    };
  } else {
    console.log("Page is undefined, no action dispatched");
  }
};

export const deleteApplyList = (queryId, page) => {
  return async (dispatch) => {
    if (queryId !== undefined) {
      const response = await api.delete(`/api/applyList/delete/${queryId}`, { withCredentials: true });
      if (response.status === 200) {
        dispatch(eraseApplyList(queryId));
        dispatch(fetchApplyList(page));
        alert(response.data.message);

      } else {
        alert(response.data.message);
      }
    }
  }
}
export const { setMessageThread, clearMessageThread, prependOlderMessages, getInbox,
  setInbox, clearInbox, setUnreadTextCount, setSupport, eraseSupport, setApplyList, eraseApplyList } = messageSlice.actions;

export default messageSlice.reducer;
