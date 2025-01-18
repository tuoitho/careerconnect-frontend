import React from 'react';

const Header = () => {
    return (
        <header className="bg-black text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-xl font-bold">Job Listing</h1>
                <nav>
                    <a href="#" className="text-white hover:underline mx-2">Home</a>
                    <a href="/job" className="text-white hover:underline mx-2">Jobs</a>
                    <a href="#" className="text-white hover:underline mx-2">Contact</a>
                </nav>
            </div>
            
        </header>
    );
};

export default Header;