import { useState, useEffect } from 'react';

export function useUrlTab(defaultTab = 'input', queryParam = 'step') {
  // 1. Initialize state based on current URL
  const [activeTab, setActiveTabState] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get(queryParam) || defaultTab;
    }
    return defaultTab;
  });

  // 2. Listen for Browser Back/Forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get(queryParam);
      if (tab) setActiveTabState(tab);
      else setActiveTabState(defaultTab);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [defaultTab, queryParam]);

  // 3. Wrapper to update State AND URL
  const setActiveTab = (newTab) => {
    setActiveTabState(newTab);
    
    const url = new URL(window.location);
    url.searchParams.set(queryParam, newTab);
    
    // We use pushState so it creates a new history entry (allowing "Back" to work)
    window.history.pushState({}, '', url);
    
    // Scroll to top if going to results
    if (newTab === 'results') {
       window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return [activeTab, setActiveTab];
}