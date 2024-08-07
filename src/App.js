import {Route,Routes} from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import Footer from './components/Footer';
import Social from './components/Social';
import About from './components/About';
import Support from './components/Support';
import SupportQuery from './components/SupportQuery';
import Login from './components/Login';
import AddPost from './redux/post/AddPost';
import SinglePostPage from './redux/post/SinglePostPage';
import EditPostForm from './redux/post/EditPostForm';
import PostList from './redux/post/PostList';
import ProfilePage from './redux/user/ProfilePage';
import EditProfile from './redux/user/EditProfile';
import Menu from './components/Menu';
import {useState,useEffect} from 'react';
import SignUp from './components/SignUp';
import { useSelector,shallowEqual } from 'react-redux';
import Inbox from './components/Inbox';
import Conversation from './redux/user/Conversation';
import AddPostMenu from './redux/post/AddPostMenu';
import AddPostSocial from './redux/post/AddPostSocial';
import EditSocialPost from './redux/post/EditSocialPost';
import ApplyNow from './components/ApplyNow';
import ApplyList from './redux/user/ApplyList';
import SearchPage from './components/SearchPage';
import Faq from './components/Faq';
import Privacy from './components/Privacy';
import TermsOfService from './components/TermsOfService';
import ForgotPassword from './components/ForgotPassword';

function App() { 
  const [socket, setSocket] = useState(null);
  const profile = useSelector((state) => state.user, shallowEqual).user;

  useEffect(() => {
    let ws = null;
  
    if (!socket && profile?.linkname !== undefined) {
      ws = new WebSocket(`ws:https://assamemployment.org:3500/chat?userId=${profile?.linkname}`);
  
      ws.onopen = () => {
       // console.log('WebSocket connected');
        if (ws.readyState === WebSocket.OPEN) {
          setSocket((prevSocket) => {
            if (prevSocket !== ws && ws.readyState === WebSocket.OPEN) {
              return ws;
            } else {
              return null;
            }
          });
          
        }
      };
  
      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
  
      ws.onclose = () => {
       // console.log('WebSocket disconnected');
        setSocket(null); // Set socket to null to indicate that the connection is closed
      };
    }
  
    return () => {
      // Close the WebSocket connection when the component unmounts
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [profile]);

 // Do not put Menu inside the Header otherwise it will be jittery animation while sliding the menu
  return (

    <div className="bg-slate-200 dark:bg-slate-500 dark:text-white w-full min-h-screen inset-0 ">
     
     <Header/>
     <Menu/>
      <Routes>
        <Route path='/' element={<Home/>}>        
          <Route index element={<PostList/>} />
          <Route path="/searchResults/:searchTerm" element={<SearchPage />} />
          <Route path="post">
            <Route index element={<Login/>} /> 
            <Route path=":postId" element={<SinglePostPage/>} />
            <Route path=":postId/ApplyNow" element={<ApplyNow/>} />
            <Route path="edit/:postId" element={<EditPostForm />} />
            <Route path="editSocialPost/:postId" element={<EditSocialPost/>} />
          </Route>
        {/*<Route path="*" element={<Navigate to="/" replace/>}/>}{/*Default redirect if the page is not found */}
        </Route>
        <Route path="profile">
            <Route index element={<Login/>} />
            <Route path=":linkname" element={<ProfilePage />} />
            <Route path=':linkname/edit' element={<EditProfile/>}/>
            <Route path=':linkname/message/:otherLinkname' element={ <Conversation socket={socket}/>}/>
            <Route path=':linkname/inbox' element={ <Inbox socket={socket}/>}/>
            <Route path=':linkname/addPostMenu'  element={<AddPostMenu/>}/>
            <Route path=':linkname/addPost'  element={<AddPost/>}/>
            <Route path=':linkname/addPostSocial'  element={<AddPostSocial/>}/>
            <Route path=':linkname/supportQuery'  element={<SupportQuery/>}/>
            <Route path=':linkname/applyList'  element={<ApplyList/>}/>

          </Route>
        <Route path='/support' element={<Support/>}/>
        <Route path='/social' element={<Social/>}/>
        <Route path='/about' element={<About/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/forgotPassword' element={<ForgotPassword/>}/>
        <Route path='/signup' element={<SignUp/>}/>
        <Route path='/faq' element={<Faq/>}/>
        <Route path='/privacy' element={<Privacy/>}/>
        <Route path='/terms' element={<TermsOfService/>}/>
      </Routes>
      <Footer/>
     </div>
  );
}

export default App;
