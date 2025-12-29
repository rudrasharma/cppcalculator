import React from 'react';

/**
 * Reusable button component with consistent styling
 */
export const Button = React.memo(({ 
    children, 
    variant = 'primary', 
    size = 'md',
    className = '',
    disabled = false,
    onClick,
    type = 'button',
    ...props 
}) => {
    const baseClasses = 'font-bold transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variants = {
        primary: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-200',
        secondary: 'bg-white text-indigo-600 border border-indigo-100 shadow-sm hover:shadow-md hover:bg-indigo-50',
        success: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl shadow-emerald-200',
        danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-xl shadow-rose-200',
        ghost: 'bg-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50',
    };
    
    const sizes = {
        sm: 'px-3 py-1.5 text-xs rounded-lg',
        md: 'px-4 py-2.5 text-sm rounded-xl',
        lg: 'px-6 py-3 text-base rounded-2xl',
        xl: 'px-8 py-4 text-lg rounded-2xl',
    };
    
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
});

Button.displayName = 'Button';

