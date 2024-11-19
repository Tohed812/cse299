'use client' 
//this component is now a client component - to run the components into the browser

import React from 'react';
import Link from 'next/link';
import {useSession, signOut} from 'next-auth/react'
import {User} from 'next-auth'



const Navbar = () => {


    const {data: session} = useSession()
     


    return (
        <div>
            
        </div>
    );
};

export default Navbar;