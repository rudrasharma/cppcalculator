import React from 'react';
import { PostHogProvider } from '@posthog/react';
import posthog from '../utils/posthog';

export const PostHogProviderWrapper = ({ children }) => {
  return (
    <PostHogProvider client={posthog}>
      {children}
    </PostHogProvider>
  );
};
