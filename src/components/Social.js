import { NavLink,Link,useNavigate } from "react-router-dom";
import React,{useState,useEffect,useCallback,useMemo,useRef} from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import SocialPostList from '../redux/post/SocialPostList';
import { setIsSocial } from "../redux/post/postSlice";
const Social = () => {
  return (
    <SocialPostList/>
  );
};

export default Social;
