"use client";

import React, { useState } from 'react';
import { AdventureContext } from '@/core/ai/ai-provider';
import { getAIProvider } from '@/core/ai/provider-factory';

export default function SetupPage() {
  const [formData, setFormData] = useState({
    timeLimit: 30,
    energy: 'Medium' as 'Low' | 'Medium' | 'High',
    mood: 'Curious' as 'Curious' | 'Adventurous' | 'Calm' | 'Social',
    groupSize: 'Solo' as 'Solo' | 'Group',
    environment: '',
  });
  const [loading, setLoading] = useState(false);
  const [adventureStarted, setAdventureStarted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const provider = getAIProvider('demo');
      const missions = await provider.generateInitialMissions(formData as AdventureContext);
      console.log('Missions generated:', missions);
      setAdventureStarted(true);
    } catch (error) {
      console.error('Error starting adventure:', error);
      alert('Failed to start adventure. Check console.');
    } finally {
      setLoading(false);
    }
  };

  if (adventureStarted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center bg-[#fdfcf0] text-[#2d3436]">
        <h1 className="text-4xl font-serif font-bold mb-4">Adventure Initialized</h1>
        <p className="text-xl mb-8">Your physical map is ready. Prepare to step outside.</p>
        <button
          onClick={() => window.location.href = '/adventure/demo'}
          className="px-8 py-4 bg-[#4a6741] text-white rounded-full text-xl font-bold hover:bg-[#3a5232] transition-colors"
        >
          ENTER THE WILD
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdfcf0] text-[#2d3436] p-6 flex flex-col items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border-4 border-[#4a6741]">
        <h1 className="text-5xl font-serif font-bold mb-2 text-center text-[#4a6741]">Outside.exe</h1>
        <p className="text-center mb-8 text-gray-600 font-medium">Initialize your real-world adventure</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold mb-2 uppercase tracking-wider text-gray-500">Environment</label>
            <input
              type="text"
              required
              placeholder="e.g. Central Park, Campus, Downtown"
              className="w-full p-3 bg-gray-100 rounded-xl border-2 border-transparent focus:border-[#4a6741] outline-none transition-all"
              value={formData.environment}
              onChange={(e) => setFormData({...formData, environment: e.target.value})}
            />
          </div >

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-2 uppercase tracking-wider text-gray-500">Time (Min)</label>
              <select
                className="w-full p-3 bg-gray-100 rounded-xl border-2 border-transparent focus:border-[#4a6741] outline-none"
                value={formData.timeLimit}
                onChange={(e) => setFormData({...formData, timeLimit: parseInt(e.target.value)})}
              >
                <option value={15}>15</option>
                <option value={30}>30</option>
                <option value={45}>45</option>
                <option value={60}>60</option>
              </select>
            </div >
            <div>
              <label className="block text-sm font-bold mb-2 uppercase tracking-wider text-gray-500">Energy</label>
              <select
                className="w-full p-3 bg-gray-100 rounded-xl border-2 border-transparent focus:border-[#4a6741] outline-none"
                value={formData.energy}
                onChange={(e) => setFormData({...formData, energy: e.target.value as any})}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div >
          </div >

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-2 uppercase tracking-wider text-gray-500">Mood</label>
              <select
                className="w-full p-3 bg-gray-100 rounded-xl border-2 border-transparent focus:border-[#4a6741] outline-none"
                value={formData.mood}
                onChange={(e) => setFormData({...formData, mood: e.target.value as any})}
              >
                <option value="Curious">Curious</option>
                <option value="Adventurous">Adventurous</option>
                <option value="Calm">Calm</option>
                <option value="Social">Social</option>
              </select>
            </div >
            <div>
              <label className="block text-sm font-bold mb-2 uppercase tracking-wider text-gray-500">Party</label>
              <select
                className="w-full p-3 bg-gray-100 rounded-xl border-2 border-transparent focus:border-[#4a6741] outline-none"
                value={formData.groupSize}
                onChange={(e) => setFormData({...formData, groupSize: e.target.value as any})}
              >
                <option value="Solo">Solo</option>
                <option value="Group">Group</option>
              </select>
            </div >
          </div >

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[#4a6741] text-white rounded-xl text-xl font-bold hover:bg-[#3a5232] transition-all disabled:opacity-50"
          >
            {loading ? 'GENERATING QUEST...' : 'GENERATE ADVENTURE'}
          </button>
        </form>
      </div >
    </div >
  );
}
