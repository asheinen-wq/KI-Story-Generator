"use client";
import React, { useState } from 'react';
import { Sparkles, BookOpen, Star, Moon } from 'lucide-react';

export default function StoryGenerator() {
  const [name, setName] = useState('');
  const [held, setHeld] = useState('');
  const [thema, setThema] = useState('Freundschaft');
  const [story, setStory] = useState('');
  const [loading, setLoading] = useState(false);

  const generateStory = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, held, thema }),
      });
      const data = await response.json();
      setStory(data.text);
    } catch (error) {
      console.error("Fehler:", error);
      setStory("Oh weh! Die Zauberkraft hat gerade eine kleine Pause. Versuch es gleich noch einmal!");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 font-sans">
      <div className="max-w-2xl mx-auto pt-12">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <Sparkles className="text-yellow-400 w-12 h-12" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Magischer Geschichten-Erzähler
          </h1>
          <p className="text-slate-400 mt-2">Erschaffe dein eigenes Abenteuer in Sekunden</p>
        </div>

        <div className="bg-slate-800 p-6 rounded-3xl shadow-2xl border border-slate-700 mb-8">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-purple-300">Wie heißt das Kind?</label>
              <input 
                value={name} onChange={(e) => setName(e.target.value)}
                placeholder="z.B. Leo"
                className="w-full p-4 rounded-2xl bg-slate-900 border-none ring-1 ring-slate-700 focus:ring-2 focus:ring-purple-500 transition-all text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-purple-300">Wer ist der Held / Begleiter?</label>
              <input 
                value={held} onChange={(e) => setHeld(e.target.value)}
                placeholder="z.B. ein kleiner Drache namens Pups"
                className="w-full p-4 rounded-2xl bg-slate-900 border-none ring-1 ring-slate-700 focus:ring-2 focus:ring-purple-500 transition-all text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-purple-300">Wovon soll die Geschichte handeln?</label>
              <select 
                value={thema} onChange={(e) => setThema(e.target.value)}
                className="w-full p-4 rounded-2xl bg-slate-900 border-none ring-1 ring-slate-700 focus:ring-2 focus:ring-purple-500 transition-all text-white appearance-none"
              >
                <option value="Freundschaft">Freundschaft</option>
                <option value="Mut">Mut & Tapferkeit</option>
                <option value="Weltraum">Abenteuer im Weltraum</option>
                <option value="Unterwasser">Geheimnisse unter Wasser</option>
                <option value="Zauberei">Eine Zauberschule</option>
              </select>
            </div>
            
            <button 
              onClick={generateStory}
              disabled={loading || !name}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-bold text-lg hover:opacity-90 disabled:opacity-50 transition-all shadow-lg flex items-center justify-center gap-2"
            >
              {loading ? "Zaubere Geschichte..." : <><BookOpen size={20}/> Geschichte erschaffen</>}
            </button>
          </div>
        </div>

        {story && (
          <div className="bg-slate-800 p-8 rounded-3xl border border-purple-500/30 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="prose prose-invert max-w-none">
              <div className="flex items-center gap-2 mb-4 text-yellow-400">
                <Star fill="currentColor" size={16}/>
                <Star fill="currentColor" size={16}/>
                <Star fill="currentColor" size={16}/>
              </div>
              <div className="text-lg leading-relaxed whitespace-pre-wrap italic">
                {story}
              </div>
              <div className="mt-6 flex justify-center">
                <Moon className="text-purple-400 w-8 h-8" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
