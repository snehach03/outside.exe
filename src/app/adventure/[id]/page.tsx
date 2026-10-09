"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Mission, AdventureContext } from '@/core/ai/ai-provider';
import { getAIProvider } from '@/core/ai/provider-factory';
import PutPhoneAway from '@/components/game/PutPhoneAway';

export const dynamic = 'force-dynamic';

export default function AdventurePage() {
  const { id } = useParams();
  const [adventure, setAdventure] = useState<{
    context: AdventureContext;
    missions: Mission[];
    currentMissionIndex: number;
  } | null>(null);

  const [isExploring, setIsExploring] = useState(false);
  const [observation, setObservation] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadAdventure() {
      try {
        const res = await fetch(`/api/adventure/${id}`);
        const data = await res.json();
        if (data.error) return;

        setAdventure({
          context: data.context,
          missions: data.missions,
          currentMissionIndex: data.missions.filter((m: any) => !m.isCompleted).length === data.missions.length
            ? 0
            : data.missions.filter((m: any) => m.isCompleted).length,
        });
      } catch (e) {
        console.error('Load error:', e);
      }
    }
    if (id) loadAdventure();
  }, [id]);

  const handleAcceptMission = () => {
    setIsExploring(true);
  };

  const handleReturn = () => {
    setIsExploring(false);
  };

  const handleCheckIn = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/adventure/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adventureId: id,
          observation,
          missionId: adventure?.missions[adventure.currentMissionIndex]?.id,
          mode: 'demo'
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      const updatedMissions = [...adventure!.missions];
      updatedMissions[adventure!.currentMissionIndex].isCompleted = true;
      updatedMissions[adventure!.currentMissionIndex].observation = observation;
      updatedMissions.push(data.nextMission);

      setAdventure({
        ...adventure!,
        missions: updatedMissions,
        currentMissionIndex: adventure!.currentMissionIndex + 1,
      });
      setObservation('');
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!adventure) return <div className="min-h-screen bg-[#fdfcf0] flex items-center justify-center">Loading...</div>;

  const currentMission = adventure.missions[adventure.currentMissionIndex];

  if (!currentMission) {
    return (
      <div className="min-h-screen bg-[#fdfcf0] flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-4xl font-serif font-bold text-[#4a6741] mb-4">Adventure Complete!</h1>
        <p className="text-xl mb-8">You have successfully navigated the real world.</p>
        <button
          onClick={() => window.location.href = `/report/${id}`}
          className="px-8 py-4 bg-[#4a6741] text-white rounded-full text-xl font-bold hover:bg-[#3a5232]"
        >
          VIEW FINAL REPORT
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdfcf0] text-[#2d3436] p-6 flex flex-col items-center justify-center">
      {isExploring && (
        <PutPhoneAway
          mission={currentMission}
          onReturn={handleReturn}
        />
      )}

      <div className="max-w-md w-full space-y-8 text-center">
        <div className="space-y-2">
          <h1 className="text-4xl font-serif font-bold text-[#4a6741]">Current Mission</h1>
          <p className="text-gray-500 uppercase tracking-widest text-xs font-bold">
            Adventure: {adventure.context.environment}
          </p>
        </div >

        <div className="bg-white p-8 rounded-3xl shadow-xl border-4 border-[#4a6741] animate-in zoom-in duration-500">
          <h2 className="text-2xl font-serif font-bold mb-4">{currentMission.title}</h2>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            {currentMission.description}
          </p>

          {!currentMission.isCompleted ? (
            <button
              onClick={handleAcceptMission}
              className="w-full py-4 bg-[#4a6741] text-white rounded-xl text-xl font-bold hover:bg-[#3a5232] transition-all"
            >
              ACCEPT MISSION
            </button>
          ) : (
            <div className="p-4 bg-green-50 rounded-xl text-green-700 font-bold">
              ✓ Mission Completed
            </div >
          )}
        </div >

        {currentMission.isCompleted && (
          <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
            <textarea
              className="w-full p-4 bg-white rounded-2xl border-2 border-gray-200 focus:border-[#4a6741] outline-none"
              placeholder="What did you find?"
              rows={3}
              value={observation}
              onChange={(e) => setObservation(e.target.value)}
            />
            <button
              onClick={handleCheckIn}
              disabled={loading || !observation}
              className="w-full py-4 bg-[#4a6741] text-white rounded-xl text-xl font-bold hover:bg-[#3a5232] transition-all disabled:opacity-50"
            >
              {loading ? 'Interpreting...' : 'SUBMIT OBSERVATION'}
            </button>
          </div >
        )}
      </div >
    </div >
  );
}
