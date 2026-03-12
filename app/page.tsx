"use client";

import React, { FormEvent, useMemo, useState } from "react";
import { Sparkles, Star, Moon, Copy, Check, RefreshCw } from "lucide-react";

const THEMEN = [
  "Freundschaft",
  "Mut & Tapferkeit",
  "Weltraum-Abenteuer",
  "Unterwasserwelt",
  "Einhorn-Magie",
] as const;

type Thema = (typeof THEMEN)[number];

type StoryRequest = {
  name: string;
  held: string;
  thema: Thema;
};

type StoryResponse = {
  text?: string;
  error?: string;
};

type PromptExample = {
  label: string;
  name: string;
  held: string;
  thema: Thema;
};

const PROMPT_EXAMPLES: PromptExample[] = [
  {
    label: "Mutiger Drache",
    name: "Leo",
    held: "ein kleiner Drache namens Funki",
    thema: "Mut & Tapferkeit",
  },
  {
    label: "Freundschaft im Wald",
    name: "Mila",
    held: "ein schlauer Fuchs namens Lumi",
    thema: "Freundschaft",
  },
  {
    label: "Weltraumreise",
    name: "Noah",
    held: "ein Roboter namens Zapp",
    thema: "Weltraum-Abenteuer",
  },
  {
    label: "Zauber der Meere",
    name: "Lina",
    held: "eine mutige Meerjungfrau namens Neri",
    thema: "Unterwasserwelt",
  },
];

const MAX_NAME_LENGTH = 40;
const MAX_HELD_LENGTH = 80;

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
    setCopySuccess(false);
  };

  const resetStory = () => {
    if (loading) return;

    setName("");
    setHeld("");
    setThema("Freundschaft");
    setStory("");
    setError("");
    setCopySuccess(false);
  };

  const copyStoryToClipboard = async () => {
    if (!story) return;

    try {
      await navigator.clipboard.writeText(story);
      setCopySuccess(true);

      window.setTimeout(() => {
        setCopySuccess(false);
      }, 2000);
    } catch (err) {
      console.error("Fehler beim Kopieren:", err);
      setError("Die Geschichte konnte leider nicht in die Zwischenablage kopiert werden.");
    }
  };

  const generateStory = async (e?: FormEvent<HTMLFormElement>) => {
    e?.preventDefault();

    if (loading) return;

    if (!isFormValid) {
      setError(validationError);
      setStory("");
      return;
    }

    setLoading(true);
    setError("");
    setStory("");
    setCopySuccess(false);

    const payload: StoryRequest = {
      name: trimmedName,
      held: trimmedHeld,
      thema,
    };

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      let data: StoryResponse = {};

      try {
        data = await response.json();
      } catch {
        throw new Error("Ungültige Serverantwort.");
      }

      if (!response.ok) {
        throw new Error(data.error || `HTTP-Fehler: ${response.status}`);
      }

      if (!data.text || data.text.trim() === "") {
        throw new Error("Keine Geschichte von der API erhalten.");
      }

      setStory(data.text.trim());
    } catch (err) {
      console.error("Fehler beim Generieren der Geschichte:", err);
      setError(
        "Oh weh! Die Zauberkraft hat gerade eine kleine Pause. Versuch es gleich noch einmal!"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container">
      <div className="shooting-star star-1" aria-hidden="true"></div>
      <div className="shooting-star star-2" aria-hidden="true"></div>
      <div className="shooting-star star-3" aria-hidden="true"></div>
      <div className="shooting-star star-4" aria-hidden="true"></div>

      <div className="forest-container" aria-hidden="true">
        <svg
          className="forest-svg"
          viewBox="0 0 1200 200"
          preserveAspectRatio="none"
        >
          <path d="M0,200 L1200,200 L1200,150 L1180,160 L1160,120 L1140,155 L1120,130 L1100,165 L1080,110 L1060,150 L1040,125 L1020,160 L1000,140 L980,170 L960,115 L940,155 L920,135 L900,170 L880,120 L860,155 L840,130 L820,165 L800,145 L780,175 L760,110 L740,160 L720,130 L700,170 L680,140 L660,175 L640,115 L620,160 L600,135 L580,175 L560,120 L540,165 L520,135 L500,175 L480,145 L460,180 L440,110 L420,160 L400,135 L380,175 L360,140 L340,180 L320,115 L300,165 L280,130 L260,175 L240,145 L220,185 L200,110 L180,165 L160,135 L140,180 L120,145 L100,185 L80,120 L60,170 L40,140 L20,180 L0,150 Z" />
        </svg>
      </div>

      <div className="magic-card">
        <header className="magic-header">
          <h1>Magischer Geschichten-Erzähler</h1>
          <p>Erschaffe dein eigenes Abenteuer in Sekunden</p>
        </header>

        <section className="prompt-examples" aria-labelledby="prompt-examples-title">
          <h2 id="prompt-examples-title">Beispiel-Prompts</h2>
          <div className="prompt-chip-list">
            {PROMPT_EXAMPLES.map((example) => (
              <button
                key={example.label}
                type="button"
                className="prompt-chip"
                onClick={() => applyPromptExample(example)}
                disabled={loading}
              >
                {example.label}
              </button>
            ))}
          </div>
        </section>

        <form className="form-group" onSubmit={generateStory} noValidate>
          <div className="field-group">
            <label htmlFor="child-name">Wie heißt das Kind?</label>
            <input
              id="child-name"
              type="text"
              placeholder="z.B. Leo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="given-name"
              maxLength={MAX_NAME_LENGTH}
              aria-invalid={!!validationError && !trimmedName}
            />
            <small className="input-hint">
              {trimmedName.length}/{MAX_NAME_LENGTH}
            </small>
          </div>

          <div className="field-group">
            <label htmlFor="hero-name">Wer ist der Held / Begleiter?</label>
            <input
              id="hero-name"
              type="text"
              placeholder="z.B. ein kleiner Drache namens Funki"
              value={held}
              onChange={(e) => setHeld(e.target.value)}
              maxLength={MAX_HELD_LENGTH}
              aria-invalid={!!validationError && !trimmedHeld}
            />
            <small className="input-hint">
              {trimmedHeld.length}/{MAX_HELD_LENGTH}
            </small>
          </div>

          <div className="field-group">
            <label htmlFor="story-theme">Wovon soll die Geschichte handeln?</label>
            <select
              id="story-theme"
              value={thema}
              onChange={(e) => setThema(e.target.value as Thema)}
            >
              {THEMEN.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <p className="error-message" role="alert">
              {error}
            </p>
          )}

          {!error && validationError && (
            <p className="validation-message" aria-live="polite">
              {validationError}
            </p>
          )}

          <div className="action-group">
            <button
              type="submit"
              disabled={loading || !isFormValid}
              className="primary-button"
              aria-busy={loading}
            >
              {loading ? (
                <span className="button-content">
                  <span className="button-spinner" aria-hidden="true"></span>
                  Die Feder schreibt...
                </span>
              ) : (
                <span className="button-content">
                  <Sparkles size={20} />
                  Geschichte erschaffen
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={resetStory}
              className="secondary-button"
              disabled={loading}
            >
              <span className="button-content">
                <RefreshCw size={18} />
                Neue Geschichte generieren
              </span>
            </button>
          </div>
        </form>

        {story && (
          <section className="story-area" aria-live="polite">
            <div className="story-topbar">
              <div className="story-stars">
                <Star size={20} fill="#c084fc" />
                <Star size={20} fill="#c084fc" />
                <Star size={20} fill="#c084fc" />
              </div>

              <button
                type="button"
                className="copy-button"
                onClick={copyStoryToClipboard}
              >
                <span className="button-content">
                  {copySuccess ? <Check size={18} /> : <Copy size={18} />}
                  {copySuccess ? "Kopiert" : "Kopieren"}
                </span>
              </button>
            </div>

            <p>{story}</p>

            <div className="story-moon">
              <Moon size={24} />
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
