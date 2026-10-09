import React from 'react';

interface PutPhoneAwayProps {
  mission: {
    title: string;
    description: string;
  };
  onReturn: () => void;
}

export default function PutPhoneAway({ mission, onReturn }: PutPhoneAwayProps) {
  return (
    <div className="fixed inset-0 z-50 bg-[#1a1a1a] text-[#dcdcdc] flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-1000">
      <div className="max-w-lg w-full space-y-12">
        <div className="space-y-2">
          <span className="text-xs font-bold tracking-[0.3em] uppercase text-gray-500">
            Mission Active
          </span>
          <h2 className="text-3xl font-serif font-bold text-white italic">
            {mission.title}
          </h2>
        </div>

        <div className="py-12 px-6 border-y border-gray-800">
          <p className="text-2xl md:text-3xl leading-relaxed font-medium text-gray-300">
            {mission.description}
          </p>
        </div>

        <div className="space-y-8">
          <p className="text-sm tracking-widest uppercase text-gray-600 font-bold animate-pulse">
            Put your phone away. Go.
          </p>
          <button
            onClick={onReturn}
            className="px-10 py-4 border-2 border-gray-700 rounded-full text-gray-400 hover:text-white hover:border-white transition-all duration-300 uppercase tracking-widest text-xs font-bold"
          >
            I am back
          </button>
        </div>
      </div>
    </div>
  );
}
