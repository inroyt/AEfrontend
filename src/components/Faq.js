import React, { useRef, useState, useEffect } from 'react';


const faqs = [
    {
      question: "How do I create a profile?",
      answer: "Go to the Login page by clicking on the 'Login' button in the navigation bar and then click 'Sign Up' button. You can sign up using username & password or by using a gmail account."
    },

    {
        question: "Can I update my profile information?",
        answer: "Yes, you can update your profile information at any time by going to your profile page and selecting the 'Edit Profile' option."
    },
    {
        question: "What should I do if I forget my password?",
        answer: "If you forget your password, you can reset it by clicking on the 'Forgot Password' link on the login page and following the instructions to set a new password."
    },
    {
        question: "Can I block an user?",
        answer: "Yes, you can prevent unwanted users from viewing your profile or messaging you on this platform by blocking. Go to the user's profile page click on the 'following' button then select 'block' option."
    },
    {
      question: "Can I Share a post?",
      answer: "Yes, you can share a post by sharing via whatsapp or facebook"
  },
    {
      question: "Can I Save a post?",
      answer: "Yes, you can save a post to your account by clicking on the 'save' icon"
  },
    {
      question: "How do I apply for a job through Assam Employment?",
      answer: "You can apply for a job by navigating to the job advertisement that interests you and clicking on the 'Apply' button. Enter your mobile number then click on the 'Send OTP' button. After successful otp verification,we will contact you within 24 hours to proceed further with the application process."
  },
];

const Faq = () => {
    const [openIndex, setOpenIndex] = useState(null);
    const contentRef = useRef(null);
    const faqRef = useRef(null);
  // State to manage dynamic height for animation
  const [maxHeight, setMaxHeight] = useState('0');

    const toggleFaq = (index) => {
        if (openIndex === index) {
            setOpenIndex(null);
        } else {
            setOpenIndex(index);
        }
    };

    useEffect(() => {
        if (contentRef.current) {
          setMaxHeight(`${contentRef.current.scrollHeight}px`); // Set max height dynamically based on content
        }
      }, [openIndex]);
      useEffect(() => {
        window.scrollTo(0, 0); // For whole page scrolling
        // or for a specific container:
        faqRef.current?.scrollTo(0, 0);
      }, []);
    return (
        <div ref={faqRef} className="flex flex-col items-center min-w-full min-h-screen bg-white dark:bg-slate-600 gap-6 py-20 px-4 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-5">
            <h1 className="text-3xl font-bold text-center mb-6">Frequently Asked Questions</h1>
            {faqs.map((faq, index) => (
                <div key={index} className="mb-2">
                   <button
  onClick={() => toggleFaq(index)}
  className="flex justify-between py-2 px-4 w-full text-left text-xl font-semibold bg-blue-500 text-white rounded-md focus:outline-none focus:shadow-outline"
>
  <p>{faq.question}</p>
  <div className={`transform ease-in transition-transform duration-300 h-7 w-7 ${openIndex === index ? 'rotate-180':'rotate-0'}`}>
  <svg data-slot="icon" aria-hidden="true" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="m19.5 8.25-7.5 7.5-7.5-7.5" stroke-linecap="round" stroke-linejoin="round"></path>
</svg>
  </div>
</button>
<div
        ref={contentRef}
        style={{
          maxHeight: openIndex === index ? maxHeight : '0', // Apply dynamic height
          transition: 'max-height 300ms ease-in-out, opacity 300ms ease-in-out',
          opacity: openIndex === index ? '1' : '0'
        }}
        className="overflow-hidden bg-blue-50 dark:bg-slate-700 rounded-md mt-2"
      >
        <p className="p-5">{faq.answer}</p>
      </div>

                </div>
            ))}
        </div>
     </div>
    );
};

export default Faq;
