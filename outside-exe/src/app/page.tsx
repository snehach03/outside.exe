import React from 'react';
import Link from 'next/link';

export default function Page() {
  return (
    <div className="min-h-screen bg-[#fdfcf0] flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-2xl">
        <h1 className="text-8xl font-serif font-black mb-6 text-[#4a6741] tracking-tighter">
          Outside.exe
        </h1>
        <p className="text-2xl font-medium mb-12 text-gray-600 italic">
          "The real world is the game map."
        </p>
        <Link
          href="/adventure/setup"
          className="px-12 py-6 bg-[#4a6741] text-white rounded-full text-2xl font-bold hover:scale-105 transition-transform inline-block shadow-lg"
        >
          START EXPLORING
        </Link>
      </div>
    </div>
  );
}
