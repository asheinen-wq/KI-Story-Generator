"use client";

import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Sparkles, Star, Moon, Copy, Check, RefreshCw } from "lucide-react";

import {
  MAX_HELD_LENGTH,
  MAX_NAME_LENGTH,
  PROMPT_EXAMPLES,
  THEMEN,
} from "./lib/story-config";

import type {
  PromptExample,
  StoryRequest,
  StoryResponse,
  Thema,
} from "./lib/story-config";

export default function StoryGenerator() {
  const [name, setName] = useState("");
  const [held, setHeld] = useState("");
  const [thema, setThema] = useState<Thema>("Freundschaft");
  const [story, setStory] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const trimmedName = name.trim();
  const trimmedHeld = held.trim();

  const validationError = useMemo(() => {
    if (!trimmedName || !trimmedHeld) {
      return "Bitte fülle beide Felder aus.";
    }

    if (trimmedName.length > MAX_NAME_LENGTH) {
      return `Der Name darf maximal ${MAX_NAME_LENGTH} Zeichen lang sein.`;
    }

    if (trimmedHeld.length > MAX_HELD_LENGTH) {
      return `Der Held oder Begleiter darf maximal ${MAX_HELD_LENGTH} Zeichen lang sein.`;
    }

    return "";
  }, [trimmedName, trimmedHeld]);

  const isFormValid = validationError === "";

  const applyPromptExample = (example: PromptExample) => {
    if (loading) return;

    setName(example.name);
    setHeld(example.held);
    setThema(example.thema);
    setError("");
    setStory("");
  };

  const resetStory = () => {
    if (loading) return;

    setName("");
    setHeld("");
    setThema("Freundschaft");
    setStory("");
    setError("");
  };

  const copyStory = async () => {
    if (!story) return;

    await navigator.clipboard.writeText(story);
    setCopySuccess(true);

    setTimeout(() => setCopySuccess(false), 2000);
  };

  const generateStory = async (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();

    if (loading) return;

    if (!isFormValid) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError("");
    setStory("");

    const payload: StoryRequest = {
      name: trimmedName,
      held: trimmedHeld,
      thema,
    };

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as StoryResponse;

      if (!response.ok) {
        throw new Error(data.error || "Serverfehler");
      }

      if (!data.text) {
        throw new Error("Keine Geschichte erhalten.");
      }

      setStory(data.text);
    } catch (err) {
      setError(
        "Oh weh! Die Zauberkraft hat gerade eine kleine Pause. Versuch es gleich noch einmal!"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container">
      <div className="shooting-star star-1" />
      <div className="shooting-star star-2" />
      <div className="shooting-star star-3" />
      <div className="shooting-star star-4" />

      <div className="forest-container">
        <svg className="forest-svg" viewBox="0 0 1200 200">
          <path d="M0,200 L1200,200 L1200,150 L1180,160 L1160,120 L1140,155 L1120,130 L1100,165 L1080,110 L1060,150 L1040,125 L1020,160 L1000,140 L980,170 L960,115 L940,155 L920,135 L900,170 L880,120 L860,155 L840,130 L820,165 L800,145 L780,175 L760,110 L740,160 L720,130 L700,170 L680,140 L660,175 L640,115 L620,160 L600,135 L580,175 L560,120 L540,165 L520,135 L500,175 L480,145 L460,180 L440,110 L420,160 L400,135 L380,175 L360,140 L340,180 L320,115 L300,165 L280,130 L260,175 L240,145 L220,185 L200,110 L180,165 L160,135 L140,180 L120,145 L100,185 L80,120 L60,170 L40,140 L20,180 L0,150 Z"/>
        </svg>
      </div>

      <div className="magic-card">
        <header className="magic-header">
          <h1>Magischer Geschichten-Erzähler</h1>
          <p>Erschaffe dein eigenes Abenteuer in Sekunden</p>
        </header>

        <section>
          <h2>Beispiel-Prompts</h2>

          <div className="prompt-chip-list">
            {PROMPT_EXAMPLES.map((example) => (
              <button
                key={example.label}
                className="prompt-chip"
                type="button"
                onClick={() => applyPromptExample(example)}
              >
                {example.label}
              </button>
            ))}
          </div>
        </section>

        <form className="form-group" onSubmit={generateStory}>
          <div className="field-group">
            <label>Wie heißt das Kind?</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={MAX_NAME_LENGTH}
            />
          </div>

          <div className="field-group">
            <label>Wer ist der Held / Begleiter?</label>
            <input
              value={held}
              onChange={(e) => setHeld(e.target.value)}
              maxLength={MAX_HELD_LENGTH}
            />
          </div>

          <div className="field-group">
            <label>Thema</label>
            <select
              value={thema}
              onChange={(e) => setThema(e.target.value as Thema)}
            >
              {THEMEN.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>

          {error && <p className="error-message">{error}</p>}

          <button disabled={loading || !isFormValid} className="primary-button">
            {loading ? "Die Feder schreibt..." : "Geschichte erschaffen"}
          </button>

          <button type="button" className="secondary-button" onClick={resetStory}>
            Neue Geschichte
          </button>
        </form>

        {story && (
          <section className="story-area">
            <div className="story-topbar">
              <div className="story-stars">
                <Star size={20} fill="#c084fc" />
                <Star size={20} fill="#c084fc" />
                <Star size={20} fill="#c084fc" />
              </div>

              <button className="copy-button" onClick={copyStory}>
                {copySuccess ? <Check size={18}/> : <Copy size={18}/>}
              </button>
            </div>

            <p>{story}</p>

            <div className="story-moon">
              <Moon size={24}/>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
