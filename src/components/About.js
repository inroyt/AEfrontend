import React, {useRef,useEffect} from 'react';

const About = () => {
  const aboutRef=useRef(null);
  useEffect(() => {
    window.scrollTo(0, 0); // For whole page scrolling
    // or for a specific container:
    aboutRef.current?.scrollTo(0, 0);
  }, []);
  return (
    <div ref={aboutRef} className="flex flex-col font-roboto items-center min-w-full min-h-screen bg-white dark:bg-slate-600 gap-6 py-20 px-4 overflow-y-auto">
      <div className="max-w-6xl w-full">
        <div className="flex flex-col gap-4 text-center">
          <h1 className="text-5xl font-bold text-blue-700 dark:text-white">Welcome to Assam Employment</h1>
          <p className="text-2xl font-semibold text-gray-500 dark:text-gray-300">
            A platform for all things related to jobs, networking, and community engagement!
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 mt-10">
          <div className="flex flex-col gap-8 flex-grow lg:w-2/3">
            <Section title="Our Mission" bgColor="bg-blue-50 dark:bg-slate-700">
              At Assam Employment, our mission is to connect job seekers with their dream opportunities while fostering a vibrant community where users can share insights, support one another, and grow both personally and professionally.
            </Section>

            <Section title="Our Technology" bgColor="bg-blue-50 dark:bg-slate-700">
              Built with React and Tailwind, our website offers a seamless and responsive user experience. Our commitment to using cutting-edge technology ensures fast, reliable, and intuitive navigation throughout your journey with us.
            </Section>

            <Section title="Our Commitment" bgColor="bg-blue-50 dark:bg-slate-700">
              At Assam Employment, we are committed to providing a user-friendly, inclusive, and secure environment for all our members. We strive to continuously improve our platform to meet the evolving needs of our community and ensure a positive experience for everyone.
            </Section>

            <Section title="Security and Privacy" bgColor="bg-blue-50 dark:bg-slate-700">
              Your privacy and security are paramount. We employ robust security measures to protect your information and ensure that your interactions on our platform are safe and confidential.
            </Section>
          </div>

          <div className="flex flex-col gap-8 flex-grow lg:w-1/3 bg-blue-50 dark:bg-slate-700 rounded-lg p-6">
            <h2 className="font-bold text-3xl text-blue-700 dark:text-white">What We Offer</h2>
            <Offer title="Job Advertisements">
              Browse through a diverse range of job advertisements tailored to your interests and expertise. Whether you're searching for your first job, a career change, or your next big challenge, we've got you covered.
            </Offer>
            <Offer title="Post Creation and Interaction">
              Create, read, and update posts about various job-related topics. Share your experiences, insights, and questions with our community to spark meaningful conversations and provide valuable guidance to fellow users.
            </Offer>
            <Offer title="Interactive Features">
              Engage with other users through comments, likes, and follows. Connect with like-minded professionals, offer support and advice, and build lasting relationships within our dynamic community.
            </Offer>
            <Offer title="Live Conversations">
              Join live conversations to discuss trending topics, seek advice in real-time, or simply connect with fellow users. Our interactive chat feature provides a platform for spontaneous discussions and networking opportunities.
            </Offer>
          </div>
        </div>
      </div>
    </div>
  );
};

const Section = ({ title, children, bgColor }) => (
  <div className={`flex flex-col gap-2 ${bgColor} rounded-lg p-6`}>
    <h2 className="font-bold text-3xl text-blue-700 dark:text-white">{title}</h2>
    <p className="font-medium text-xl text-gray-500 dark:text-gray-200">{children}</p>
  </div>
);

const Offer = ({ title, children }) => (
  <div className="flex flex-col gap-1">
    <h3 className="font-semibold text-xl text-blue-700 dark:text-white">{title}</h3>
    <p className="font-medium text-xl text-gray-500 dark:text-gray-200">{children}</p>
  </div>
);

export default About;
