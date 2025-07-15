import React, { useState } from 'react';
import clsx from 'clsx';
import Input from '../components/Input';
import Button from '../components/Button';
import Dialog from '../components/dialog';
import { useNavigate } from 'react-router-dom';


const AuthComponent = () => {
    const [showSignUp, setShowSignUp] = useState(false);
    const [open, setOpen] = useState(false);

    const navigate = useNavigate();
    React.useEffect(() => {
        if (open) {
            console.log("The dialog is now open.");
        } else {
            console.log("The dialog is now closed.");
        }
    }, [open]);
    const goToLogin = () => {
        // Logic to navigate to the home page
        console.log("Navigating to Home page...");
        navigate('/login');
        setOpen(false); // Close the dialog after navigating
    };

    const goToUser = () => {
        // Logic to navigate to the home page
        console.log("Navigating to Home page...");
        navigate('/User');
        setOpen(false); // Close the dialog after navigating
    };

    return (
        <div className="relative z-50 grid grid-cols-1 md:grid-cols-2 gap-5 bg-gray-800 pr-0 w-[87vw] h-[42rem] rounded-xl top-10 md:top-[7em] max-w-full mx-auto md:w-full transition-all duration-500 overflow-hidden">

            {/* Left Section */}
            <div className={clsx(
                'w-full md:w-fit px-4 md:px-16 py-8 md:py-16 flex-col items-center hidden md:flex transition-transform duration-500 relative z-[50]',
                showSignUp ? 'bg-gray-900 rounded-r-[4em] translate-x-0' : 'bg-gray-900 rounded-l-[4em] translate-x-[103.5%]'
            )}>
                <div className='text-[1.5em] md:text-[2.5em] tracking-[0.2em] text-white mb-8 text-center'>
                    {showSignUp ? "Welcome to HEELOS" : "Welcome Back"}
                </div>
                <div className={clsx(
                    'text-white text-[0.9em] tracking-[0.05em] md:block mb-4 transition-transform duration-500',
                    showSignUp ? 'translate-x-0 text-left' : 'translate-x-[-5%] text-right'
                )}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur non lorem metus. 
                    Phasellus viverra mi ut nisl ullamcorper, sit amet tempus ligula placerat.
                </div>
                <div className=' my-5 mt-8 md:mt-14 flex justify-center'>
                    <Button
                        className='bg-green-500 text-white rounded-lg mt-8 tracking-[0.7em] w-full py-3 px-[4em] text-[1.2em]'
                        text={showSignUp ? "SIGN IN" : "SIGN UP"}
                        onClick={() => setShowSignUp(prev => !prev)}
                    />
                </div>
            </div>

            {/* Right Section */}
            <div className={clsx(
                'w-full md:w-[31vw] px-3 transition-transform duration-500 relative z-[45] top-10 md:top-0 left-[0rem] md:left-0',
                showSignUp ? 'md:translate-x-0 translate-y-0' : 'md:-translate-x-full translate-y-[1rem] md:translate-y-0'
            )}>
                <div className='h-auto w-auto p-4 text-[3em] md:text-[4em] tracking-[0.4em] mb-[1em] mt-1 md:mt-4 text-center'>
                    {showSignUp ? "SIGN UP" : "SIGN IN"}
                </div>
                <div className='flex flex-col gap-5 px-2 md:px-4'>

                    {showSignUp ? (
                        <>
                            <Input type={'text'} placeHolder={'Name'} className={'bg-gray-900/50 text-white mb-4 shadow-md shadow-gray-800/50'} />
                            <Input type={'text'} placeHolder={'Email'} className={'bg-gray-900/50 text-white mb-4 shadow-md shadow-gray-800/50'} />
                            <Input type={'password'} placeHolder={'Password'} className={'bg-gray-900/50 text-white mb-4 shadow-md'} />
                        </>
                    ) : (
                        <>
                            <Input type={'text'} placeHolder={'Email'} className={'bg-gray-900/50 text-white mb-4 shadow-md shadow-gray-800/50'} />
                            <Input type={'password'} placeHolder={'Password'} className={'bg-gray-900/50 text-white mb-4 shadow-md'} />
                        </>
                    )}

                    <div className='flex flex-col gap-4 px-2 md:px-4 mt-2 mb-[3rem] md:mb-[5rem] md:mt-5'>
                        <Button
                            className='tracking-[0.6em] bg-blue-500 text-white rounded-lg mb-4  p-4 py-3 text-[1.2em] w-full '
                            onClick={() => {showSignUp ? setOpen(true) : goToUser()}}
                            text={showSignUp ? "SIGN UP" : "SIGN IN"}
                        />
                    </div>
                </div>

                <Dialog
                    isOpen={open}
                    setIsOpen={setOpen}
                    Header="Are You Sure about you Information"
                    Body="Please ensure that all the information you provided is correct. This will help us provide you with personalized insights and recommendations."
                    className="w-full max-w-md mx-auto bg-white text-black p-6 rounded-lg shadow-lg relative top-[5em] z-50"
                    button={[
                      { text: "Verify", onClick: () => goToUser(),  className: "bg-gray-200 text-black p-4 py-2" },
                      { text: "Go On ", onClick: () => goToLogin(), className: "bg-red-500 text-white p-4 py-2" }
                    ]}
                />

                {/* Small screen toggle */}
                <div className='text-white text-[0.9em] tracking-[0.05em] text-center md:text-left block md:hidden'>
                    {showSignUp ? "Already have an account?" : "Don't have an account?"}
                    <span
                        className='text-blue-500 cursor-pointer'
                        onClick={() => setShowSignUp(prev => !prev)}
                    >
                        &nbsp;{showSignUp ? "Sign In" : "Sign Up"}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default AuthComponent;
