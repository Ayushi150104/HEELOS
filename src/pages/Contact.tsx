import React from 'react';

const Contact = () => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-[8em] w-auto h-auto p-6 md:p-16 bg-[#8e8e8e2d] rounded-3xl scale-100 md:scale-105 relative top-[3em] md:top-[2.2em] left-0 md:left-[2em] shadow-2xl sm:left-[2em] sm:w-auto z-30 '>

      {/* Left panel - Contact Form */}
      <div className='order-1 md:order-2 flex flex-col justify-center max-w-[600px] mx-auto md:mx-0'>
        <h1 className='text-[60px] sm:text-[70px] md:text-[105px] tracking-[0.1em] md:tracking-[0.3em] mb-6'>
          CONTACT
        </h1>
        <form className='mt-4 flex flex-col space-y-6 text-sm sm:text-base'>
          <input
            type='text'
            placeholder='Your Name'
            className='p-3 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-[#a9d18e] transition'
            required
          />
          <input
            type='email'
            placeholder='Your Email'
            className='p-3 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-[#a9d18e] transition'
            required
          />
          <textarea
            placeholder='Your Message'
            rows='5'
            className='p-3 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-[#a9d18e] resize-none transition'
            required
          ></textarea>
          <button
            type='submit'
            className='bg-[#d1e6b8] text-black rounded-lg font-itim hover:bg-[#cae0ae] transition-all duration-700 hover:outline-0 hover:scale-[0.97] w-full py-3 md:py-[0.9em] px-4 md:px-[1.2em] tracking-[0.3em] md:tracking-[0.7em] text-base md:text-[1.3em] font-semibold shadow-lg'
          >
            SEND MESSAGE
          </button>
        </form>
      </div>

      {/* Right panel - Contact Info */}
      <div className='order-2 md:order-1 flex flex-col items-center md:items-start justify-center max-w-[600px] mx-auto md:mx-0'>

        <div className='bg-amber-300 text-black text-center md:text-left p-6 rounded-lg mb-6 font-itim shadow-lg w-full max-w-[50em] md:w-auto md:px-8 relative md:top-[2em] md:left-0'>
          <h2 className='text-xl sm:text-2xl md:text-3xl font-bold mb-4'>Get in Touch</h2>
          <p className='text-sm sm:text-base leading-relaxed'>
            We’re here to help! Reach out via email, phone, or visit our office. We’d love to connect and support your journey to better organization.
          </p>
          <div className='mt-6 text-left text-sm sm:text-base space-y-2'>
            <p><strong>Email:</strong> <a href='mailto:support@heelos.com' className='underline hover:text-[#cae0ae]'>support@heelos.com</a></p>
            <p><strong>Phone:</strong> <a href='tel:+919876543210' className='underline hover:text-[#cae0ae]'>+91 98765 43210</a></p>
            <p><strong>Address:</strong> 123, Heelos Street, Productivity City</p>
          </div>
        </div>

        <div className='bg-gray-100 text-black text-left px-6 py-5 sm:px-8 sm:py-6 w-full max-w-[24em] rounded-lg mb-6 font-itim shadow-lg relative md:top-[-0.7em] md:left-[10em] hidden md:block'>
          <h2 className='text-lg sm:text-xl font-bold mb-3'>Customer Support Hours</h2>
          <ul className='list-disc list-inside text-sm sm:text-base space-y-1'>
            <li>Monday - Friday: 9:00 AM to 6:00 PM</li>
            <li>Saturday: 10:00 AM to 2:00 PM</li>
            <li>Sunday: Closed</li>
          </ul>
        </div>

        <div className='bg-[#19181821] text-left px-6 py-5 sm:px-8 sm:py-6 w-full max-w-[100%] rounded-lg font-itim shadow-lg relative md:top-[-1.5em] md:left-[1em] hidden md:block'>
          <h2 className='text-lg sm:text-xl font-bold mb-3'>Follow Us</h2>
          <div className='flex space-x-6 text-2xl'>
            <a href='https://twitter.com/heelos' aria-label='Twitter' className='hover:text-[#cae0ae] transition'>
              {/* Twitter SVG Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className='w-6 h-6'>
                <path d="M23 3a10.9 10.9 0 01-3.14.86 5.48 5.48 0 002.4-3.04 11.01 11.01 0 01-3.48 1.33 5.44 5.44 0 00-9.3 4.96A15.4 15.4 0 012 4.1a5.44 5.44 0 001.68 7.27 5.37 5.37 0 01-2.46-.68v.07a5.43 5.43 0 004.37 5.33 5.48 5.48 0 01-2.45.1 5.44 5.44 0 005.07 3.78A10.9 10.9 0 013 19.54a15.39 15.39 0 008.33 2.44c10 0 15.5-8.29 15.5-15.5 0-.24 0-.48-.02-.71A11.08 11.08 0 0023 3z" />
              </svg>
            </a>
            <a href='https://facebook.com/heelos' aria-label='Facebook' className='hover:text-[#cae0ae] transition'>
              {/* Facebook SVG Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className='w-6 h-6'>
                <path d="M22.675 0h-21.35C.597 0 0 .597 0 1.326v21.348C0 23.403.597 24 1.326 24h11.495v-9.294H9.691v-3.622h3.13V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.466.099 2.797.143v3.24l-1.918.001c-1.504 0-1.796.715-1.796 1.763v2.313h3.59l-.467 3.622h-3.123V24h6.116c.729 0 1.326-.597 1.326-1.326V1.326C24 .597 23.403 0 22.675 0z" />
              </svg>
            </a>
            <a href='https://instagram.com/heelos' aria-label='Instagram' className='hover:text-[#cae0ae] transition'>
              {/* Instagram SVG Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className='w-6 h-6'>
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Contact;
