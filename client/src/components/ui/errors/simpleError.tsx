"use client";

import React, { useState, useEffect } from 'react';

export function SimpleError(props: { message: string, className?: string }) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        // Set a timeout to hide the message after 5 seconds
        const timer = setTimeout(() => { setIsVisible(false) }, 5000);

        // Cleanup function to clear the timeout 
        return () => clearTimeout(timer);
    }, [props.message]); // Re-run effect if the message changes

    if (!isVisible) return null;

    return (
        <div className={`py-4 px-8 bg-red-700 rounded-xl ${props.className} text-xs`} >
            <p>{props.message}</p>
        </div>
    );
}
