import React, { useState,useRef,useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import api from '../api/data';
const Support = () => {
    const supportRef=useRef(null);
    const [query, setQuery] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const emailRegex=/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const [isEmailError, setIsEmailError]=useState(false);
    const canSubmit=Boolean(query.length > 0&&message.length > 0&& !isEmailError);
    const onEmailChange = (e)=>{
        e.preventDefault();
        const value=e.target.value;
        setEmail(value);
        value.length>0? setIsEmailError(!emailRegex.test(value)):setIsEmailError(false);
    }
    const handleSubmit =async (e) => {
            try{
                e.preventDefault();
                const supportQuery={
                    email:email,
                    query:query,
                    message:message,
                    timestamp:Date.now()
                }
              //  console.log(supportQuery);
                // Implement your submit logic here, e.g., API call
                const response = await api.post('/api/support',supportQuery)
                if(response.status===200) {
                    window.alert(`${response.data.message}`);
                    setEmail('');
                    setQuery('');
                    setMessage('');
                }else{
                    window.alert(`${response.status}, ${response.data.message}`);
            } 
            }catch (err) {
                console.error(err);
                window.alert(err.response.data.message);
              }
    };

    useEffect(() => {
        window.scrollTo(0, 0); // For whole page scrolling
        // or for a specific container:
        supportRef.current?.scrollTo(0, 0);
      }, []);

    return (
        <div ref={supportRef} className="flex flex-col items-center min-w-full min-h-screen bg-slate-200 dark:bg-slate-600 gap-6 py-20 px-4 overflow-y-auto">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-semibold text-blue-700 dark:text-gray-100 mb-2">Support</h1>
                <p className="mb-8 text-blue-700 dark:text-gray-100">Need help? Reach out to our support team or check out the <NavLink className="font-bold underline" to="/faq">FAQs</NavLink>.</p>
                <div className="bg-white dark:bg-slate-500 shadow-md rounded-lg p-8">
                    <h2 className="text-2xl font-semibold text-blue-700 dark:text-gray-100 mb-4">Contact Us</h2>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        <div>
                            <label htmlFor="email" className="text-blue-700 dark:text-gray-100 font-semibold">Email Address:</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => onEmailChange(e)}
                                className={`mt-1 block w-full p-2 border-2 ${isEmailError?'border-red-500':'border-blue-700'} dark:border-gray-600 dark:text-gray-100 dark:bg-slate-600 rounded-md outline-none`}
                                required
                            />
                        </div>
                        {isEmailError &&<p className="text-pink-500">Please enter a valid email</p>}
                        <div>
                            <label htmlFor="query" className="text-blue-700 dark:text-gray-100 font-semibold">Subject:</label>
                            <input
                                type="text"
                                id="query"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="mt-1 block w-full p-2 border-2 border-blue-700 dark:border-gray-600 dark:text-gray-100 dark:bg-slate-600 rounded-md outline-none"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="message" className="text-blue-700 dark:text-gray-100 font-semibold">Message:</label>
                            <textarea
                                id="message"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                rows="4"
                                className="mt-1 block w-full p-2 border-2 border-blue-700 dark:border-gray-600 dark:text-gray-100 dark:bg-slate-600 rounded-md resize-none outline-none"
                                required
                            />
                        </div>
                        <div className="flex justify-end">
                        <button 
                        type="submit" 
                        onSubmit={(e)=>handleSubmit(e)}
                        disabled={!canSubmit}
                        className=" bg-blue-700 hover:bg-blue-700 text-white font-bold p-2  rounded-md">
                            Send Message
                        </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Support;
