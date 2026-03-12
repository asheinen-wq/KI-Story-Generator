"use client";
import React, { useState } from 'react';
import { Sparkles, Star, Moon } from 'lucide-react';

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
    <main className="container">
      {/* Sternschnuppen Animationselemente */}
      <div className="shooting-star"></div>
      <div className="shooting-star"></div>
      <div className="shooting-star"></div>
      <div className="shooting-star"></div>

      {/* Die Wald-Silhouette am Boden */}
      <div className="forest-container">
        <svg className="forest-svg" viewBox="0 0 1200 200" preserveAspectRatio="none">
          <path d="M0,200 L1200,200 L1200,150 L1180,160 L1160,120 L1140,155 L1120,130 L1100,165 L1080,110 L1060,150 L1040,125 L1020,160 L1000,140 L980,170 L960,115 L940,155 L920,135 L900,170 L880,120 L860,155 L840,130 L820,165 L800,145 L780,175 L760,110 L740,160 L720,130 L700,170 L680,140 L660,175 L640,115 L620,160 L600,135 L580,175 L560,120 L540,165 L520,135 L500,175 L480,145 L460,180 L440,110 L420,160 L400,135 L380,175 L360,140 L340,180 L320,115 L300,165 L280,130 L260,175 L240,145 L220,185 L200,110 L180,165 L160,135 L140,180 L120,145 L100,185 L80,120 L60,170 L40,140 L20,180 L0,150 Z" />
        </svg>
      </div>

      <div className="magic-card">
        <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1>Magischer Geschichten-Erzähler</h1>
          <p>Erschaffe dein eigenes Abenteuer in Sekunden</p>
        </header>

        <div className="form-group">
          <div>
            <label>Wie heißt das Kind?</label>
            <input 
              type="text" 
              placeholder="z.B. Leo" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
            />
          </div>

          <div>
            <label>Wer ist der Held / Begleiter?</label>
            <input 
              type="text" 
              placeholder="z.B. ein kleiner Drache namens Funki" 
              value={held} 
              onChange={(e) => setHeld(e.target.value)} 
            />
          </div>

          <div>
            <label>Wovon soll die Geschichte handeln?</label>
            <select value={thema} onChange={(e) => setThema(e.target.value)}>
              <option value="Freundschaft">Freundschaft</option>
              <option value="Mut & Tapferkeit">Mut & Tapferkeit</option>
              <option value="Weltraum-Abenteuer">Weltraum-Abenteuer</option>
              <option value="Unterwasserwelt">Unterwasserwelt</option>
              <option value="Einhorn-Magie">Einhorn-Magie</option>
            </select>
          </div>

          <button 
            onClick={generateStory} 
            disabled={loading || !name || !held}
            className={loading ? 'loading' : ''}
          >
            {loading ? 'Die Feder schreibt...' : <><Sparkles size={20} /> Geschichte erschaffen</>}
          </button>
        </div>

        {story && (
          <div className="story-area">
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', color: '#c084fc' }}>
              <Star size={20} fill="#c084fc" />
              <Star size={20} fill="#c084fc" />
              <Star size={20} fill="#c084fc" />
            </div>
            <p>{story}</p>
            <div style={{ textAlign: 'right', color: '#94a3b8' }}>
              <Moon size={24} />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
