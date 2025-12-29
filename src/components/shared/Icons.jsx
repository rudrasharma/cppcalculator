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

export const ScaleIcon = React.memo((props) => (
    <IconBase {...props}>
        <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/>
        <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/>
        <path d="M7 21h10"/>
        <path d="M12 3v18"/>
        <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/>
    </IconBase>
));
ScaleIcon.displayName = 'ScaleIcon';

export const CalculatorIcon = React.memo((props) => (
    <IconBase {...props}>
        <rect width="16" height="20" x="4" y="2" rx="2"/>
        <line x1="8" x2="16" y1="6" y2="6"/>
        <line x1="16" x2="16" y1="14" y2="18"/>
        <path d="M16 10h.01"/>
        <path d="M12 10h.01"/>
        <path d="M8 10h.01"/>
        <path d="M12 14h.01"/>
        <path d="M8 14h.01"/>
        <path d="M12 18h.01"/>
        <path d="M8 18h.01"/>
    </IconBase>
));
CalculatorIcon.displayName = 'CalculatorIcon';

export const TrendingUpIcon = React.memo((props) => (
    <IconBase {...props}>
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
        <polyline points="16 7 22 7 22 13"/>
    </IconBase>
));
TrendingUpIcon.displayName = 'TrendingUpIcon';

export const CheckCircleIcon = React.memo((props) => (
    <IconBase {...props}>
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
        <path d="M22 4 12 14.01l-3-3"/>
    </IconBase>
));
CheckCircleIcon.displayName = 'CheckCircleIcon';

export const RotateCcwIcon = React.memo((props) => (
    <IconBase {...props}>
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
        <path d="M3 3v5h5"/>
    </IconBase>
));
RotateCcwIcon.displayName = 'RotateCcwIcon';

export const HomeIcon = React.memo((props) => (
    <IconBase {...props}>
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
    </IconBase>
));
HomeIcon.displayName = 'HomeIcon';

export const BookOpenIcon = React.memo((props) => (
    <IconBase {...props}>
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
    </IconBase>
));
BookOpenIcon.displayName = 'BookOpenIcon';

export const UserGroupIcon = React.memo((props) => (
    <IconBase {...props}>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </IconBase>
));
UserGroupIcon.displayName = 'UserGroupIcon';

export const HeartHandshakeIcon = React.memo((props) => (
    <IconBase {...props}>
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
    </IconBase>
));
HeartHandshakeIcon.displayName = 'HeartHandshakeIcon';

export const WandIcon = React.memo((props) => (
    <IconBase {...props}>
        <path d="M15 4V2"/>
        <path d="M15 16v-2"/>
        <path d="M8 9h2"/>
        <path d="M20 9h2"/>
        <path d="M17.8 11.8 19 13"/>
        <path d="M15 9h0"/>
        <path d="M17.8 6.2 19 5"/>
        <path d="m3 21 9-9"/>
        <path d="M12.2 6.2 11 5"/>
    </IconBase>
));
WandIcon.displayName = 'WandIcon';

export const BarChartIcon = React.memo((props) => (
    <IconBase {...props}>
        <line x1="12" x2="12" y1="20" y2="10"/>
        <line x1="18" x2="18" y1="20" y2="4"/>
        <line x1="6" x2="6" y1="20" y2="16"/>
    </IconBase>
));
BarChartIcon.displayName = 'BarChartIcon';

export const FileTextIcon = React.memo((props) => (
    <IconBase {...props}>
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <line x1="10" y1="9" x2="8" y2="9"/>
    </IconBase>
));
FileTextIcon.displayName = 'FileTextIcon';

export const UploadIcon = React.memo((props) => (
    <IconBase {...props}>
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
        <polyline points="17 8 12 3 7 8"/>
        <line x1="12" y1="3" x2="12" y2="15"/>
    </IconBase>
));
UploadIcon.displayName = 'UploadIcon';

export const FilterIcon = React.memo((props) => (
    <IconBase {...props}>
        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
    </IconBase>
));
FilterIcon.displayName = 'FilterIcon';

