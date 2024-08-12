import React, {useRef,useEffect} from 'react';

const TermsOfService = () => {
  const termsRef=useRef(null);
  useEffect(() => {
    window.scrollTo(0, 0); // For whole page scrolling
    // or for a specific container:
    termsRef.current?.scrollTo(0, 0);
  }, []);
  return (
    <div ref={termsRef} className="relative flex max-w-7xl mx-auto py-12 lg:my-8  lg:px-8 gap-4 font-roboto">
     

      <div className="w-full lg:w-3/4 lg:ml-8">
        <div className="bg-white dark:bg-slate-800  shadow-lg sm:rounded-lg p-8">
          <h2 className="text-4xl font-extrabold text-center leading-9 text-gray-700 dark:text-gray-200 mb-6">Terms of Service</h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-200 text-center">Effective Date: 18-07-2024</p>

          <div className="mt-10 space-y-10 text-gray-700 dark:text-gray-200">
            <section id="section-1">
              <h3 className="text-3xl font-semibold border-b pb-2 border-gray-200">1. Acceptance of Terms</h3>
              <p className="mt-4">By accessing or using assamemployment.org, you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.</p>
            </section>

            <section id="section-2">
              <h3 className="text-3xl font-semibold border-b pb-2 border-gray-200">2. Changes to Terms</h3>
              <p className="mt-4">We reserve the right to modify these terms at any time. We will notify you of any changes by posting the updated terms on this page. Your continued use of the service after any such changes constitutes your acceptance of the new Terms of Service.</p>
            </section>

            <section id="section-3">
              <h3 className="text-3xl font-semibold border-b pb-2 border-gray-200">3. User Responsibilities</h3>
              <p className="mt-4">As a user of assamemployment.org, you agree to use the service in a lawful manner. You are responsible for any content you post and for your interactions with other users. You agree to receive SMS and Email from this platform when required. </p>
            </section>

            <section id="section-4">
              <h3 className="text-3xl font-semibold border-b pb-2 border-gray-200">4. Account Registration</h3>
              <p className="mt-4">To access certain features of the service, you must register for an account. You agree to provide accurate and complete information during the registration process and to update such information as necessary.</p>
            </section>

            <section id="section-5">
              <h3 className="text-3xl font-semibold border-b pb-2 border-gray-200">5. Content Ownership</h3>
              <p className="mt-4">You retain ownership of the content you post on assamemployment.org. However, by posting content, you grant us a non-exclusive, royalty-free, perpetual, and worldwide license to use, modify, and distribute your content.</p>
            </section>

            <section id="section-6">
              <h3 className="text-3xl font-semibold border-b pb-2 border-gray-200">6. Prohibited Activities</h3>
              <p className="mt-4">You agree not to engage in any of the following activities:</p>
              <ul className="list-disc list-inside mt-4 pl-5 space-y-2">
                <li>Posting false or misleading information.</li>
                <li>Harassing or abusing other users.</li>
                <li>Using the service for any illegal activities.</li>
                <li>Attempting to gain unauthorized access to our systems or user accounts.</li>
              </ul>
            </section>

            <section id="section-7">
              <h3 className="text-3xl font-semibold border-b pb-2 border-gray-200">7. Termination</h3>
              <p className="mt-4">We reserve the right to terminate or suspend your account at any time, without prior notice, for conduct that we believe violates these Terms of Service or is harmful to other users of the service.</p>
            </section>

            <section id="section-8">
              <h3 className="text-3xl font-semibold border-b pb-2 border-gray-200">8. Limitation of Liability</h3>
              <p className="mt-4">assamemployment.org and its affiliates will not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of your use of or inability to use the service.</p>
            </section>

            <section id="section-9">
              <h3 className="text-3xl font-semibold border-b pb-2 border-gray-200">9. Governing Law</h3>
              <p className="mt-4">These Terms of Service are governed by the laws of the jurisdiction in which assamemployment.org operates. Any disputes arising out of or in connection with these terms shall be resolved by the competent courts of that jurisdiction.</p>
            </section>

            <section id="section-10">
              <h3 className="text-3xl font-semibold border-b pb-2 border-gray-200">10. Contact Us</h3>
              <p className="mt-4">If you have any questions about these Terms of Service, please contact us at:</p>
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
            <li><a href="#section-1" className="text-blue-600 hover:underline">1. Acceptance of Terms</a></li>
            <li><a href="#section-2" className="text-blue-600 hover:underline">2. Changes to Terms</a></li>
            <li><a href="#section-3" className="text-blue-600 hover:underline">3. User Responsibilities</a></li>
            <li><a href="#section-4" className="text-blue-600 hover:underline">4. Account Registration</a></li>
            <li><a href="#section-5" className="text-blue-600 hover:underline">5. Content Ownership</a></li>
            <li><a href="#section-6" className="text-blue-600 hover:underline">6. Prohibited Activities</a></li>
            <li><a href="#section-7" className="text-blue-600 hover:underline">7. Termination</a></li>
            <li><a href="#section-8" className="text-blue-600 hover:underline">8. Limitation of Liability</a></li>
            <li><a href="#section-9" className="text-blue-600 hover:underline">9. Governing Law</a></li>
            <li><a href="#section-10" className="text-blue-600 hover:underline">10. Contact Us</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
