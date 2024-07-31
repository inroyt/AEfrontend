import {useState,useEffect} from 'react';
import axios from 'axios';
const useAxiosFetch=(dataUrl)=>{
    const [data,setData]=useState([]);
    const [fetchError,setFetchError]=useState(null);
    const [isLoading,setIsLoading]=useState(false);
    useEffect(()=>{
        let isMounted=true;
        const fetchData=async (url)=>{
            setIsLoading(true);
            try{
                const response= await axios.get(url,
                {
                    headers: {
                      'Access-Control-Allow-Origin': '*',
                      'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                    }
                  });
                if(isMounted){
                    setData(response.data);
                    setFetchError(null);
                }
            }catch(err){
                if(isMounted){
                    setFetchError(err.message);
                    setData([]);
                }
            }finally{
               // isMounted&& setTimeout(()=>setIsLoading(false),2000);  //for testing purpose we use a setTimeout to test
               isMounted && setIsLoading(false);
            }

        }
        fetchData(dataUrl);
        const cleanUp=()=>{
           // console.log("Clean up function running");
            isMounted=false;
           // source.cancel();
        }
        return cleanUp;
    },[dataUrl]);
    return {data,isLoading,fetchError};
}
export default useAxiosFetch; 