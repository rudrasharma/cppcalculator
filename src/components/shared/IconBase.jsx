import React from 'react';

/**
 * Base icon component to keep icon definitions DRY
 */
export const IconBase = React.memo(({ size = 20, className = "", children, ...props }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
        {...props}
    >
        {children}
    </svg>
));

IconBase.displayName = 'IconBase';

