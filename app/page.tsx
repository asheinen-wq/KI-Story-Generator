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
    <main className="container">
      <div className="shooting-star"></div>
<div className="shooting-star"></div>
<div className="shooting-star"></div>
      <div className="magic-card">
        <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1>Magischer Geschichten-Erzähler</h1>
          <p>Erschaffe dein eigenes Abenteuer in Sekunden</p>
        </header>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
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
