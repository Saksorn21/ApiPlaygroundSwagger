import { useState, useEffect } from 'react';

export default function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') { // Ensure window is defined (for SSR compatibility)
      const mediaQueryList = window.matchMedia(query);

      const listener = (event: MediaQueryListEvent) => {
        setMatches(event.matches);
      };

      // Set initial state
      setMatches(mediaQueryList.matches);

      // Add and remove event listener for changes
      mediaQueryList.addEventListener('change', listener);
      return () => {
        mediaQueryList.removeEventListener('change', listener);
      };
    }
  }, [query]); // Re-run effect if the query string changes

  return matches;
}
interface MediaQueryResult {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}
export function useMedia(): MediaQueryResult  {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
  const isDesktop = useMediaQuery('(min-width: 1025px)');
  return { isMobile, isTablet, isDesktop}
}
