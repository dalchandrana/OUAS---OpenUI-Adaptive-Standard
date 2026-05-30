'use client';

import { useOUASContext } from '@ouas/renderer';
import { useEffect, useState } from 'react';

export function LayoutRenderer() {
  const { renderLayout, isLoading } = useOUASContext();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || isLoading) {
    return (
      <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ 
          border: '3px solid rgba(59, 130, 246, 0.1)', 
          borderTop: '3px solid #3b82f6', 
          borderRadius: '50%', 
          width: '32px', 
          height: '32px', 
          animation: 'spin 1s linear infinite' 
        }}></div>
      </div>
    );
  }

  return (
    <div style={{ height: '100%', width: '100%' }}>
      {renderLayout()}
    </div>
  );
}
