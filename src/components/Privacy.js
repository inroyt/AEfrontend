import React, {useRef,useEffect} from 'react';

const Privacy = () => {

  const privacyRef=useRef(null);
  useEffect(() => {
    window.scrollTo(0, 0); // For whole page scrolling
    // or for a specific container:
    privacyRef.current?.scrollTo(0, 0);
  }, []);

  return (
    <div ref={privacyRef} className="relative flex max-w-7xl mx-auto py-12 lg:my-8  lg:px-8 gap-4 font-roboto">

      <div className="w-full lg:w-3/4 lg:ml-8">
        <div className="bg-white dark:bg-slate-800 shadow-lg sm:rounded-lg p-8">
          <h2 className="text-4xl font-extrabold  text-center leading-9  mb-6 text-gray-700 dark:text-gray-200">Privacy Policy</h2>
          <p className="mt-2 text-sm  text-center text-gray-700 dark:text-gray-200">Effective Date: 18-07-2024</p>

          <div className="mt-10 space-y-10 text-gray-700 dark:text-gray-200">
            <section id="section-1">
              <h3 className="text-3xl font-semibold border-b pb-2 border-gray-200">1. Information We Collect</h3>
              <p className="mt-4">We may collect and process the following types of information about you:</p>

              <div className="mt-6">
                <h4 className="text-2xl font-medium text-gray-800 dark:text-gray-200">1.1. Personal Identification Information</h4>
                <ul className="list-disc list-inside mt-3 pl-5 space-y-2">
                  <li>User Account Details: When you create an account, we may collect your name, email address, username, and password. If you sign up using Gmail, we may also collect information associated with your Google account.</li>
                  <li>OTP (One-Time Password) Information: Phone number provided during account creation or resetting password or job application process will be used for OTP verification.</li>
                  <li>Contact Information: Information provided during account creation or when contacting us directly.</li>
                </ul>
              </div>

              <div className="mt-6">
                <h4 className="text-2xl font-medium text-gray-800 dark:text-gray-200">1.2. Usage Data</h4>
                <ul className="list-disc list-inside mt-3 pl-5 space-y-2">
                  <li>Interaction Data: Information about how you interact with the site, including real-time texts, posts, comments, and the users you block or save.</li>
                  <li>Technical Data: Information about your device, internet connection, IP address, browser type, and operating system.</li>
                </ul>
              </div>

              <div className="mt-6">
                <h4 className="text-2xl font-medium text-gray-800 dark:text-gray-200">1.3. Application Data</h4>
                <ul className="list-disc list-inside mt-3 pl-5 space-y-2">
                  <li>Job Application Data: When you apply for a job, we verify your application using OTP (One-Time Password) validation.</li>
                </ul>
              </div>
            </section>

            <section id="section-2">
              <h3 className="text-3xl font-semibold border-b pb-2 border-gray-200">2. How We Use Your Information</h3>
              <p className="mt-4">We use the information we collect for the following purposes:</p>

              <ul className="list-disc list-inside mt-6 pl-5 space-y-2">
                <li>Account Management: To create and manage your user account.</li>
                <li>Communication: To facilitate real-time texting between users.</li>
                <li>Content Management: To enable users to create, read, update, and delete posts and comments.</li>
                <li>User Interaction: To allow users to save posts for later, block other users, and apply for jobs with OTP validation.</li>
                <li>Service Improvement: To understand how users interact with our services, allowing us to improve and optimize our platform.</li>
                <li>Security: To detect and prevent fraudulent activities, and ensure the security of our users and services.</li>
                <li>Legal Compliance: To comply with applicable laws and regulations.</li>
              </ul>
            </section>

            <section id="section-3">
              <h3 className="text-3xl font-semibold border-b pb-2 border-gray-200">3. Sharing Your Information</h3>
              <p className="mt-4">We do not sell, trade, or otherwise transfer to outside parties your Personally Identifiable Information except in the following situations:</p>

              <ul className="list-disc list-inside mt-6 pl-5 space-y-2">
                <li>Service Providers: We may share your information with third-party service providers who perform services on our behalf, such as data hosting, customer service, and email delivery.</li>
                <li>Legal Requirements: We may disclose your information if required to do so by law or in response to valid requests by public authorities.</li>
                <li>Business Transfers: If we are involved in a merger, acquisition, or asset sale, your information may be transferred as part of that transaction.</li>
              </ul>
            </section>

            <section id="section-4">
              <h3 className="text-3xl font-semibold border-b pb-2 border-gray-200">4. Cookies and Tracking Technologies</h3>
              <p className="mt-4">We use cookies and similar tracking technologies to track activity on our website and store certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.</p>
            </section>

            <section id="section-5">
              <h3 className="text-3xl font-semibold border-b pb-2 border-gray-200">5. Data Security</h3>
              <p className="mt-4">We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that no security measures are perfect or impenetrable.</p>
            </section>

            <section id="section-6">
              <h3 className="text-3xl font-semibold border-b pb-2 border-gray-200">6. Your Rights</h3>
              <p className="mt-4">Depending on your location, you may have certain rights regarding your personal information, such as:</p>

              <ul className="list-disc list-inside mt-6 pl-5 space-y-2">
                <li>Access: You have the right to request a copy of the personal information we hold about you.</li>
                <li>Correction: You have the right to request that we correct any inaccurate or incomplete information about you.</li>
                <li>Deletion: You have the right to request the deletion of your personal information.</li>
                <li>Restriction: You have the right to request that we restrict the processing of your personal information.</li>
              </ul>
            </section>

            <section id="section-7">
              <h3 className="text-3xl font-semibold border-b pb-2 border-gray-200">7. Third-Party Links</h3>
              <p className="mt-4">Our website may contain links to other websites that are not operated by us. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party sites or services.</p>
            </section>

            <section id="section-8">
              <h3 className="text-3xl font-semibold border-b pb-2 border-gray-200">8. Changes to This Privacy Policy</h3>
              <p className="mt-4">We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.</p>
            </section>

            <section id="section-9">
              <h3 className="text-3xl font-semibold border-b pb-2 border-gray-200">9. Contact Us</h3>
              <p className="mt-4">If you have any questions about this Privacy Policy, please contact us at:</p>

              <div className="mt-6">
                <p className="font-medium text-gray-800 dark:text-gray-200">Email: <a href="mailto:prabinroy1@gmail.com" className="text-blue-600 hover:underline">prabinroy1@gmail.com</a></p>
                <p className="font-medium text-gray-800 dark:text-gray-200">Address:</p>
                <ul>
            <li>
              Gauripur,Assam
            </li>
            <li>
              India
            </li>
            <li>
              Pin-783331
            </li>
            
          </ul>
              </div>
            </section>
          </div>
        </div>
      </div>

      <div className="hidden lg:block lg:w-1/4 lg:sticky lg:top-6 lg:self-start lg:h-full">
        <div className="bg-white dark:bg-slate-800 shadow-lg rounded-lg px-6 py-10 mb-6 lg:mb-0">
          <h3 className="text-xl font-bold mb-4 dark:text-gray-200">On this Page</h3>
          <ul className="space-y-2">
            <li><a href="#section-1" className="text-blue-600 hover:underline">1. Information We Collect</a></li>
            <li><a href="#section-2" className="text-blue-600 hover:underline">2. How We Use Your Information</a></li>
            <li><a href="#section-3" className="text-blue-600 hover:underline">3. Sharing Your Information</a></li>
            <li><a href="#section-4" className="text-blue-600 hover:underline">4. Cookies and Tracking Technologies</a></li>
            <li><a href="#section-5" className="text-blue-600 hover:underline">5. Data Security</a></li>
            <li><a href="#section-6" className="text-blue-600 hover:underline">6. Your Rights</a></li>
            <li><a href="#section-7" className="text-blue-600 hover:underline">7. Third-Party Links</a></li>
            <li><a href="#section-8" className="text-blue-600 hover:underline">8. Changes to This Privacy Policy</a></li>
            <li><a href="#section-9" className="text-blue-600 hover:underline">9. Contact Us</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
