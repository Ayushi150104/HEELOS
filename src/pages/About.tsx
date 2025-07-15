import React from 'react';

const About = () => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-[8em] w-auto h-auto p-4 md:p-16 bg-[#8e8e8e2d] rounded-3xl scale-100 md:scale-95  relative top-0 md:top-[2.2em] left-0 md:left-[2em] shadow-2xl md:w-auto md:h-auto sm:left-[2em] sm:w-[auto] z-10'>

      {/* Left panel */}
      <div className='order-1 md:order-2 flex flex-col justify-center'>
        <div className='text-[60px] sm:text-[70px] md:text-[105px] tracking-[0.1em] md:tracking-[0.3em]'>
          ABOUT US
        </div>
        <div className='text-justify text-sm sm:text-base mt-4'>
          Welcome to Heelos! We are committed to making your daily routines more organized, efficient, and delightful.
          Our mission is to simplify task tracking and scheduling with visually appealing, intuitive tools.
          Whether you're a student, professional, or just someone who loves to stay on top of things, our platform is designed for you.
          <br /><br />
          At Heelos, we believe that productivity shouldn't feel overwhelming. We combine clean design, seamless user experience, and practical features to help you achieve more — with less stress.
        </div>
        <div className='mt-8 md:mt-16'>
          <button className='bg-[#d1e6b8] text-black rounded-lg font-itim hover:bg-[#cae0ae] transition-all duration-700 hover:outline-0 hover:scale-[0.97] w-full py-3 md:py-[0.9em] px-4 md:px-[1.2em] tracking-[0.3em] md:tracking-[0.7em] text-base md:text-[1.3em] font-semibold shadow-lg'>
            LEARN MORE
          </button>
        </div>
      </div>

      {/* Right panel */}
<div className='order-2 md:order-1 flex flex-col items-center md:items-start justify-center space-y-6'>

{/* Vision Block */}
<div className='bg-gray-200 text-black text-center md:text-left p-4 rounded-lg font-itim shadow-lg w-full max-w-[50em] mx-auto md:w-auto md:px-6 relative md:top-[2em] md:left-[-1em]'>
  <h2 className='text-xl sm:text-2xl md:text-3xl font-bold mb-4'>Our Vision</h2>
  <p className='text-sm sm:text-base leading-relaxed'>
    To empower individuals with simple, elegant tools that help them organize life effortlessly. We believe productivity should reduce stress — not create it.
  </p>
</div>

{/* Core Values Block */}
<div className='bg-amber-300 text-black text-center md:text-left p-4 rounded-lg font-itim shadow-lg w-full max-w-[24em] mx-auto md:w-auto md:h-auto md:px-6 relative md:top-[-0.5em] md:left-[10em] hidden md:block'>
  <h2 className='text-lg sm:text-xl md:text-2xl font-bold mb-3'>Our Core Values</h2>
  <ul className='list-disc list-inside text-left text-sm sm:text-base space-y-2'>

    <li>
      <span className='font-semibold'>Clarity:</span> Clean, distraction-free tools to help you focus on what matters most.
    </li>

    <li>
      <span className='font-semibold'>Simplicity:</span> Every feature is intuitive and reduces complexity, making organization feel natural.
    </li>

    <li>
      <span className='font-semibold'>Consistency:</span> A reliable experience across all your devices, every time.
    </li>

    <li>
      <span className='font-semibold'>User-Centric Design:</span> Your needs and feedback guide how Heelos evolves.
    </li>

    <li>
      <span className='font-semibold'>Growth Mindset:</span> We continuously learn and improve to serve you better.
    </li>

  </ul>
</div>

</div>

    </div>
  );
};

export default About;
