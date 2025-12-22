// src/components/ContactButton.jsx
import React, { useState } from 'react';
import ContactModal from './ContactModal';

export default function ContactButton() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button 
                onClick={() => setIsOpen(true)} 
                className="text-slate-500 hover:text-indigo-600 transition-colors"
            >
                Contact
            </button>
            
            {isOpen && <ContactModal onClose={() => setIsOpen(false)} />}
        </>
    );
}