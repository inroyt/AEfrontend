import React, { useState, useRef, useLayoutEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/data';

const ApplyNow = () => {
  const ref = useRef(null);
  const history = useNavigate();
  const { postId } = useParams();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const numberRegex = /^\d{10}$/;
  const otpRegex = /^\d{6}$/;
  const [isValidNumber, setIsValidNumber] = useState(false);
  const [isValidOtp, setIsValidOtp] = useState(false);
  const canSubmitNumber = !isValidNumber;
  const canSubmitOtp = !isValidOtp;
  const [seconds, setSeconds] = useState(0); // Start at 0, no countdown initially
  const [secondsOTP, setSecondsOTP] = useState(0); // Start at 0, no countdown initially
  const [isOtpLoading, setIsOtpLoading] = useState(false);
  const [serverResponse, setServerResponse] = useState(null);
  const [verificationResult, setVerificationResult] = useState(null);
  const timerRef = useRef(null); // Reference to hold the timer ID
  const timerRefOTP = useRef(null); 
  // Handle phone number change
  const onNumberChange = (e) => {
    const value = e.target.value;
    setPhoneNumber(value);
    setIsValidNumber(value.length > 0 && !numberRegex.test(value));
  };

  // Handle OTP change
  const onOtpChange = (e) => {
    const value = e.target.value;
    setOtp(value);
    setIsValidOtp(value.length > 0 && !otpRegex.test(value));
  };

  // Scroll to top when component first loads
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    ref.current?.scrollTo(0, 0);
  }, []);

  // Function to start the countdown
  const startCountdown = () => {
    setSeconds(30); // Start the countdown from 30 seconds
    if (timerRef.current) return; // Prevent multiple timers
    timerRef.current = setInterval(() => {
      setSeconds((prevSeconds) => {
        if (prevSeconds <= 1) {
          clearInterval(timerRef.current);
          timerRef.current = null; // Clear timer reference
          return 0;
        }
        return prevSeconds - 1;
      });
    }, 1000);
  };
 
  // Function to send OTP
  const sendOtp = async () => {
    setIsOtpLoading(true);
    try {
      const response = await api.post(`/api/request-otp/${postId}`, { phoneNumber: phoneNumber });
      if (response.status === 200) {
        setServerResponse(response.data.message);
        setIsOtpLoading(false);
        setOtp(''); // Clear the OTP field
        startCountdown(); // Start the countdown on successful OTP request
        startCountdownOTP();
      }
    } catch (err) {
      console.error(err);
      setIsOtpLoading(false);
    }
  };
// Helper function to format seconds into mm:ss
const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};
  // Function to start the countdown for OTP validity
const startCountdownOTP = () => {
  setSecondsOTP(300); // Start the countdown from 30 seconds
  if (timerRefOTP.current) return; // Prevent multiple timers
  timerRefOTP.current = setInterval(() => {
    setSecondsOTP((prevSeconds) => {
      if (prevSeconds <= 1) {
        clearInterval(timerRefOTP.current);
        timerRefOTP.current = null; // Clear timer reference
        return 0;
      }
      return prevSeconds - 1;
    });
  }, 1000);
};
  // Function to verify OTP
  const verifyOtp = async () => {
    try {
      const response = await api.post('/api/verify-otp', { phoneNumber: phoneNumber, otp: otp });
      if (response.status === 200) {
        setVerificationResult(response.data.message);
        setOtp(null);
      } else {
        setVerificationResult(response.data.message);
      }
    } catch (err) {
      console.error(err);
      window.alert(err.response.data.message);
    }
  };

 

  return (
    <div ref={ref} className="flex flex-col items-center min-w-full min-h-screen text-white font-roboto bg-blue-700 dark:bg-slate-600 gap-6 py-20 px-4 overflow-y-auto">
      {!verificationResult ? (
        <div className="w-full lg:w-1/3 h-full flex flex-col mb-20 items-center gap-4 p-2 justify-center border-red-500">
          <p className="text-2xl lg:text-3xl">Hassle Free Online Application</p>
          {!serverResponse ? (
            <div className="flex flex-col w-full h-full gap-2">
              <input
                className="w-full h-14 lg:h-16 rounded-lg px-2 text-gray-700 text-lg outline-none shadow-lg overflow-hidden"
                type="text"
                placeholder="Mobile Number"
                onChange={onNumberChange}
                value={phoneNumber}
              />
              {isValidNumber && <p className="text-pink-200">Please enter a valid 10 digit phone number</p>}
              <p className="text-gray-100 text-sm">By clicking Send OTP, you agree to our <a href='/terms' target="_blank" className="font-bold underline">Terms of Service</a> and that you have read our   <a href='/privacy' target="_blank" className="font-bold underline">Privacy Policy</a></p>
            </div>
          ) : (
            <div className="flex flex-col w-full h-full gap-2">
              <input
                className="w-full h-14 lg:h-16 rounded-lg px-2 text-gray-700 text-lg outline-none shadow-lg overflow-hidden"
                type="text"
                placeholder="Enter the OTP"
                onChange={onOtpChange}
                value={otp}
              />
              {isValidOtp && <p className="text-pink-200">Please enter the 6 digit OTP that you have received on your phone number</p>}
            </div>
          )}
          {!serverResponse && !isOtpLoading ? (
            <button
              className="px-4 py-2 mb-4 shadow-lg bg-white hover:bg-blue-50 text-blue-700 hover:text-blue-900 rounded-lg transition-opacity"
              onClick={sendOtp}
              disabled={!canSubmitNumber}
            >
              Send OTP
            </button>
          ) : isOtpLoading ? (
            <div className="px-4 py-2 mb-4 shadow-lg bg-white rounded-lg transition-opacity">
              <div className="flex w-full gap-4 mx-auto h-full bg-inherit items-center justify-center">
                <svg
                  aria-hidden="true"
                  className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3 items-center justify-between">
              <p >{secondsOTP>0?`OTP will expire in ${formatTime(secondsOTP)}`:`OTP expired! Please resend the OTP.`} </p>
               <div className="flex gap-2 justify-between">
              <button
                className="px-4 py-2 mb-4 shadow-lg bg-white hover:bg-blue-50 text-blue-700 hover:text-blue-900 rounded-lg transition-opacity"
                onClick={sendOtp}
                disabled={seconds > 0}
              >
                {seconds > 0 ? `Resend OTP in ${seconds} seconds` : 'Resend OTP'}
              </button>
              <button
                className="px-4 py-2 mb-4 shadow-lg bg-white hover:bg-blue-50 text-blue-700 hover:text-blue-900 rounded-lg transition-opacity"
                onClick={verifyOtp}
                disabled={!canSubmitOtp}
              >
                Verify OTP
              </button>

              
            </div>
            </div>
          )}
          <p>
            We will contact you to proceed further with the application process. You just have to provide the documents required for the application via WhatsApp and we will send you the final acknowledgment after completing the application process.
            <span className="font-bold"> FEES: Rs.50 per application</span>
          </p>
        </div>
      ) : (
        <div className="w-full lg:w-1/3 h-full flex flex-col mb-20 items-center gap-4 p-2 justify-center">
          <p className="text-2xl lg:text-3xl">{verificationResult}</p>
          <button
            className="px-4 py-2 mb-4 shadow-lg bg-white hover:bg-blue-50 text-blue-700 hover:text-blue-900 rounded-lg transition-opacity"
            onClick={() => { history(`/post/${postId}`); }}
          >
            Back
          </button>
        </div>
      )}
    </div>
  );
}

export default ApplyNow;
