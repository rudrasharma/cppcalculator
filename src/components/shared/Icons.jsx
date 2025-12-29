import React from 'react';
import { IconBase } from './IconBase';

// Export all icons as memoized components for performance
export const SparklesIcon = React.memo((props) => (
    <IconBase {...props}>
        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
    </IconBase>
));
SparklesIcon.displayName = 'SparklesIcon';

export const SendIcon = React.memo((props) => (
    <IconBase {...props}>
        <line x1="22" y1="2" x2="11" y2="13"/>
        <polygon points="22 2 15 22 11 13 2 9 22 2"/>
    </IconBase>
));
SendIcon.displayName = 'SendIcon';

export const XIcon = React.memo((props) => (
    <IconBase {...props}>
        <line x1="18" y1="6" x2="6" y2="18"/>
        <line x1="6" y1="6" x2="18" y2="18"/>
    </IconBase>
));
XIcon.displayName = 'XIcon';

export const HelpCircleIcon = React.memo((props) => (
    <IconBase {...props}>
        <circle cx="12" cy="12" r="10"/>
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
    </IconBase>
));
HelpCircleIcon.displayName = 'HelpCircleIcon';

export const ChevronDownIcon = React.memo((props) => (
    <IconBase {...props}>
        <polyline points="6 9 12 15 18 9"/>
    </IconBase>
));
ChevronDownIcon.displayName = 'ChevronDownIcon';

export const ArrowRightIcon = React.memo((props) => (
    <IconBase {...props}>
        <line x1="5" y1="12" x2="19" y2="12"/>
        <polyline points="12 5 19 12 12 19"/>
    </IconBase>
));
ArrowRightIcon.displayName = 'ArrowRightIcon';

export const CheckIcon = React.memo((props) => (
    <IconBase {...props}>
        <polyline points="20 6 9 17 4 12"/>
    </IconBase>
));
CheckIcon.displayName = 'CheckIcon';

export const LinkIcon = React.memo((props) => (
    <IconBase {...props}>
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
    </IconBase>
));
LinkIcon.displayName = 'LinkIcon';

export const DollarSignIcon = React.memo((props) => (
    <IconBase {...props}>
        <line x1="12" x2="12" y1="2" y2="22"/>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </IconBase>
));
DollarSignIcon.displayName = 'DollarSignIcon';

export const UsersIcon = React.memo((props) => (
    <IconBase {...props}>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </IconBase>
));

UsersIcon.displayName = 'UsersIcon';

export const CalendarIcon = React.memo((props) => (
    <IconBase {...props}>
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
    </IconBase>
));
CalendarIcon.displayName = 'CalendarIcon';

export const ExternalLinkIcon = React.memo((props) => (
    <IconBase {...props}>
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
        <polyline points="15 3 21 3 21 9"/>
        <line x1="10" y1="14" x2="21" y2="3"/>
    </IconBase>
));
ExternalLinkIcon.displayName = 'ExternalLinkIcon';

export const InfoIcon = React.memo((props) => (
    <IconBase {...props}>
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="16" x2="12" y2="12"/>
        <line x1="12" y1="8" x2="12.01" y2="8"/>
    </IconBase>
));
InfoIcon.displayName = 'InfoIcon';

export const TrendingDownIcon = React.memo((props) => (
    <IconBase {...props}>
        <polyline points="22 17 13.5 8.5 8.5 13.5 2 7"/>
        <polyline points="16 17 22 17 22 11"/>
    </IconBase>
));
TrendingDownIcon.displayName = 'TrendingDownIcon';

export const TrashIcon = React.memo((props) => (
    <IconBase {...props}>
        <path d="M3 6h18"/>
        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
    </IconBase>
));
TrashIcon.displayName = 'TrashIcon';

