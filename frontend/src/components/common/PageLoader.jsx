import React from 'react';

const PageLoader = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center py-20 px-4">
      <div className="relative flex items-center justify-center">
        {/* Soft Golden Glow Ring */}
        <div className="w-20 h-20 rounded-full border-4 border-amber-200 border-t-amber-500 animate-spin"></div>
        <span className="absolute text-2xl animate-bounce">🍯</span>
      </div>
      <p className="mt-4 text-xs font-bold text-amber-800 tracking-wider uppercase">
        Loading Golden Goodness...
      </p>
    </div>
  );
};

export default PageLoader;
