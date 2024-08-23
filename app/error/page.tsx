'use client';
import { useEffect, useState } from 'react';

export default function ErrorPage() {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        // Retrieve the error message from session storage
        const storedMessage = sessionStorage.getItem('loginError');
        if (storedMessage) {
            setErrorMessage(storedMessage);
            // Clear the error message from session storage after displaying
            sessionStorage.removeItem('loginError');
        }
    }, []);

    return (
        <div>
            <p>Sorry, something went wrong.</p>
            {errorMessage && <p>Error: {errorMessage}</p>}
        </div>
    );
}
