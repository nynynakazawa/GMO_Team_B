"use client";

import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { usePathname } from 'next/navigation';

interface PageTransitionProps {
  children: React.ReactNode;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayChildren, setDisplayChildren] = useState(children);

  useEffect(() => {
    setIsTransitioning(true);
    
    // フェードアウト後に新しいコンテンツを表示
    const fadeOutTimer = setTimeout(() => {
      setDisplayChildren(children);
      setIsTransitioning(false);
    }, 200);

    return () => clearTimeout(fadeOutTimer);
  }, [pathname, children]);

  return (
    <Box
      sx={{
        opacity: isTransitioning ? 0 : 1,
        transform: isTransitioning ? 'translateY(10px)' : 'translateY(0)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        minHeight: '100vh',
        willChange: 'opacity, transform',
      }}
    >
      {displayChildren}
    </Box>
  );
}; 