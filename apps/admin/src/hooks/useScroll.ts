// import React, { useEffect } from 'react';
// import { useLocation } from 'react-router-dom';

// const ScrollToTopOnNavigate = () => {
//   const { pathname } = useLocation();

//   useEffect(() => {
//     // Scroll to the top when the route changes
//     window.scrollTo(0, 0);
//   }, [pathname]);

//   return null; // This component doesn't render anything
// };

// export default ScrollToTopOnNavigate;
import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom' // Using useNavigate

const useScrollToTopOnNavigation = () => {
  const navigate = useNavigate()
  const scrollRef = useRef<HTMLDivElement>(null)

  const handleScroll = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0
    }
  }

  useEffect(() => {
    //@ts-ignore
    const unlisten = navigate((location) => {
      // Here, you can check for specific conditions in the location object if needed
      handleScroll()
    })
    return unlisten // Return the unlisten function
  }, [navigate])

  return scrollRef
}

export default useScrollToTopOnNavigation
