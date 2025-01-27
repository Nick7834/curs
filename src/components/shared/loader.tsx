import React from 'react';

export const Loader = () => {
    return (
       <div className='absolute top-0 left-0 z-[1000] flex items-center justify-center w-full h-full bg-white h-[100vh]'>
            <span className="loader"></span>
       </div>
    );
};
