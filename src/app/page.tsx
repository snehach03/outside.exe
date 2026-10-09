import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#fdfcf0] text-[#2d3436] p-6 flex flex-col items-center justify-center">
      <div className="max-w-2xl w-full text-center space-y-12">
        <div className="space-y-4">
          <h1 className="text-7xl font-serif font-black text-[#4a6741] leading-tight">
            Outside.exe
          </h1>
          <p className="text-2xl italic text-gray-600 font-medium">
            The world is your game board.
          </p>
        </div>

        <div className="bg-white p-12 rounded-3xl shadow-2xl border-4 border-[#4a6741] space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <div className="text-6xl font-serif font-bold">EXE</div>
          </div>

          <p className="text-xl leading-relaxed text-gray-700">
            Step away from the screen. Initialize a real-world adventure
            powered by adaptive AI that transforms your surroundings into
            a living quest.
          </p>

          <Link
            href="/adventure/setup"
            className="inline-block w-full py-5 bg-[#4a6741] text-white rounded-xl text-2xl font-bold hover:bg-[#3a5232] transition-all transform hover:scale-[1.02] active:scale-95 shadow-lg"
          >
            INITIALIZE ADVENTURE
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-6 text-sm font-bold uppercase tracking-widest text-gray-400">
          <div className="p-4 border-t border-gray-200">Local-First</div>
          <div className="p-4 border-t border-gray-200">Privacy-Centric</div>
          <div className="p-4 border-t border-gray-200">Adaptive AI</div>
        </div>
      </div>
    </div>
  );
}
