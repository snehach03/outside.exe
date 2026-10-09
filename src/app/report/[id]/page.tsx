"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getAIProvider } from '@/core/ai/provider-factory';
import { AdventureRepo } from '@/core/game-logic/adventure-repo';

export const dynamic = 'force-dynamic';

export default function ReportPage() {
  const { id } = useParams();
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReport() {
      try {
        const res = await fetch(`/api/adventure/${id}`);
        const adventure = await res.json();
        if (adventure.error || !adventure) throw new Error('Adventure not found');

        const provider = getAIProvider('demo');
        const finalReport = await provider.generateAdventureReport(adventure);
        setReport({
          ...finalReport,
          adventure,
        });
      } catch (error) {
        console.error('Report error:', error);
      } finally {
        setLoading(false);
      }
    }
    if (id) loadReport();
  }, [id]);

  if (loading) return <div className="min-h-screen bg-[#fdfcf0] flex items-center justify-center">Calculating your discoveries...</div>;
  if (!report) return <div className="min-h-screen bg-[#fdfcf0] flex items-center justify-center">Report not found.</div>;

  return (
    <div className="min-h-screen bg-[#fdfcf0] text-[#2d3436] p-6 flex flex-col items-center">
      <div className="max-w-2xl w-full space-y-12 py-12">
        <div className="text-center space-y-4">
          <h1 className="text-6xl font-serif font-black text-[#4a6741]">Adventure Report</h1>
          <p className="text-xl italic text-gray-600">A chronicle of your exploration</p>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-white p-6 rounded-3xl shadow-sm border-2 border-gray-100">
            <p className="text-xs uppercase font-bold text-gray-400 mb-1">XP Earned</p>
            <p className="text-3xl font-serif font-bold text-[#4a6741]">{report.adventure.totalXP}</p>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border-2 border-gray-100">
            <p className="text-xs uppercase font-bold text-gray-400 mb-1">Time Spent</p>
            <p className="text-3xl font-serif font-bold text-[#4a6741]">{report.timeSpent}m</p>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border-2 border-gray-100">
            <p className="text-xs uppercase font-bold text-gray-400 mb-1">Discoveries</p>
            <p className="text-3xl font-serif font-bold text-[#4a6741]">{report.discoveries.length}</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-xl border-4 border-[#4a6741] space-y-8">
          <section>
            <h3 className="text-xl font-serif font-bold mb-4 text-[#4a6741]">The Journey</h3>
            <p className="text-lg leading-relaxed text-gray-700 italic">"{report.summary}"</p>
          </section>

          <section>
            <h3 className="text-xl font-serif font-bold mb-4 text-[#4a6741]">Observations</h3>
            <ul className="space-y-3">
              {report.adventure.missions.filter((m: any) => m.observation).map((m: any, i: number) => (
                <li key={i} className="flex gap-4 p-3 bg-gray-50 rounded-xl border-l-4 border-[#4a6741]">
                  <span className="font-bold text-gray-400">{i + 1}.</span>
                  <p className="text-gray-700">{m.observation}</p>
                </li>
              ))}
            </ul>
          </section>

          <section className="pt-8 border-t border-gray-100 text-center">
            <h3 className="text-2xl font-serif font-bold mb-4 text-[#4a6741]">Final Reflection</h3>
            <p className="text-xl leading-relaxed text-gray-600 italic">
              {report.finalReflection}
            </p>
          </section>
        </div>

        <div className="text-center">
          <button
            onClick={() => window.location.href = '/'}
            className="px-8 py-4 bg-[#4a6741] text-white rounded-full text-lg font-bold hover:bg-[#3a5232] transition-all"
          >
            START A NEW JOURNEY
          </button>
        </div>
      </div>
    </div>
  );
}
