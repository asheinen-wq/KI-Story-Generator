"use client";

import { useEffect, useMemo, useState } from "react";
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
  const [title, setTitle] = useState("");
  const [displayedStory, setDisplayedStory] = useState("");

  const [illustrationScene, setIllustrationScene] = useState("");
  const [illustrationPrompt, setIllustrationPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [isWriting, setIsWriting] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

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
useEffect(() => {
  if (!story) {
    setDisplayedStory("");
    setIsWriting(false);
    return;
  }

  let index = 0;
  setDisplayedStory("");
  setIsWriting(true);

  const interval = setInterval(() => {
    index++;

    setDisplayedStory(story.slice(0, index));

    if (index >= story.length) {
      clearInterval(interval);
      setIsWriting(false);
    }
  }, 18);

  return () => clearInterval(interval);
}, [story]);
  const applyPromptExample = (example: PromptExample) => {
    if (loading) return;

    setName(example.name);
    setHeld(example.held);
    setThema(example.thema);
    setError("");
    setStory("");
    setCopySuccess(false);
    setHasSubmitted(false);
  };

  const resetStory = () => {
    if (loading) return;

    setName("");
    setHeld("");
    setThema("Freundschaft");
    setStory("");
    setError("");
    setCopySuccess(false);
    setHasSubmitted(false);
  };

  const copyStoryToClipboard = async () => {
    if (!story) return;

    try {
      await navigator.clipboard.writeText(story);
      setCopySuccess(true);

      setTimeout(() => {
        setCopySuccess(false);
      }, 2000);
    } catch (err) {
      console.error("Fehler beim Kopieren:", err);
      setError(
        "Die Geschichte konnte leider nicht in die Zwischenablage kopiert werden."
      );
    }
  };

 const generateStory = async () => {
  setHasSubmitted(true);

  if (loading) return;

  if (!isFormValid) {
    setError(validationError);
    setStory("");
    setDisplayedStory("");
    return;
  }

  setLoading(true);
  setError("");
  setStory("");
  setDisplayedStory("");
  setTitle("");
  setIllustrationScene("");
  setIllustrationPrompt("");
  setImageUrl("");
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
   data = (await response.json()) as StoryResponse;
    } catch (err) {
     throw new Error("Ungültige Serverantwort.");
    }

    if (!response.ok) {
      throw new Error(data.error || `HTTP-Fehler: ${response.status}`);
    }

    if (!data.story || data.story.trim() === "") {
      throw new Error("Keine Geschichte von der API erhalten.");
    }

    setTitle(data.title?.trim() || "");
    setStory(data.story.trim());

    setIllustrationScene(data.illustrationScene || "");
    setIllustrationPrompt(data.illustrationPrompt || "");

    console.log("illustrationPrompt:", data.illustrationPrompt);

    const imageResponse = await fetch("/api/illustration", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: data.illustrationPrompt,
      }),
    });

    console.log(
      "imageResponse.ok:",
      imageResponse.ok,
      "status:",
      imageResponse.status
    );

    const imageData = await imageResponse.json();
    console.log("imageData:", imageData);

    if (imageData.imageUrl) {
      setImageUrl(imageData.imageUrl);
    }
  } catch (err) {
    console.error("Fehler beim Generieren der Geschichte:", err);
    setError(
      err instanceof Error
        ? err.message
        : "Beim Generieren der Geschichte ist ein Fehler aufgetreten."
    );
  } finally {
    setLoading(false);
  }

const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  void generateStory();

  return (

<main className={isWriting ? "container writing" : "container"}>
  <div className="starfield" aria-hidden="true">
    <div className="stars stars-layer-1"></div>
    <div className="stars stars-layer-2"></div>
    <div className="stars stars-layer-3"></div>
  </div>
  
      <div className="shooting-star star-1" aria-hidden="true" />
      <div className="shooting-star star-2" aria-hidden="true" />
      <div className="shooting-star star-3" aria-hidden="true" />
      <div className="shooting-star star-4" aria-hidden="true" />

      <div className="mist-layer" aria-hidden="true"></div>
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

        {!story && !loading && (
          <p className="magic-hint">
            🪄 Die Magie wartet auf deinen ersten Helden...
          </p>
        )}

        {trimmedName && !story && !loading && (
          <p className="magic-preview">
            ✨ Heute Abend erlebt {trimmedName} ein magisches Abenteuer...
          </p>
        )}

        <section
          className="prompt-examples"
          aria-labelledby="prompt-examples-title"
        >
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
                <span className="prompt-chip-icon" aria-hidden="true">
                  {example.label === "Mutiger Drache" && "✨"}
                  {example.label === "Freundschaft im Wald" && "🌲"}
                  {example.label === "Weltraumreise" && "🚀"}
                  {example.label === "Zauber der Meere" && "🌊"}
                </span>
                {example.label}
              </button>
            ))}
          </div>
        </section>

        <form className="form-group" onSubmit={handleSubmit} noValidate>
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
              aria-invalid={Boolean(hasSubmitted && validationError && !trimmedName)}
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
              aria-invalid={Boolean(hasSubmitted && validationError && !trimmedHeld)}
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

          {!error && hasSubmitted && validationError && (
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
                  <span className="button-spinner" aria-hidden="true" />
                  ✍️ Die magische Feder schreibt...
                </span>
              ) : (
                <span className="button-content">
                  <Sparkles size={20} />
                  Magische Geschichte erschaffen
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
                Neue Geschichte beginnen
              </span>
            </button>
          </div>
        </form>

        {story && (
          <section className="story-area" aria-live="polite">
            {isWriting && (
  <div className="writing-sparkles">
    ✨ ✨ ✨
  </div>
)}
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

{imageUrl && (
  <div className="mb-6 flex justify-center items-center overflow-hidden rounded-xl bg-black/20 p-2">
    <img
      src={imageUrl}
      alt="Illustration"
style={{ maxHeight: "220px", maxWidth: "320px", width: "auto", objectFit: "contain", display: "block" }}
    />
  </div>
)}
            
<div className="text-center">
  {title && (
    <h2 className="mb-4 text-3xl font-bold text-white">
      {title}
    </h2>
  )}

<div className="mx-auto max-w-md text-center space-y-4">
  {displayedStory.split("\n\n").map((paragraph, i) => (
    <p key={i} className="leading-8 text-center">
      {paragraph}
    </p>
  ))}
</div>
            <div className="story-actions">
              <button
                type="button"
                className="secondary-button story-secondary-button"
                onClick={generateStory}
                disabled={loading}
              >
                <span className="button-content">
                  <Sparkles size={18} />
                  Weiteres Abenteuer
                </span>
              </button>
            </div>

    <div className={`story-moon ${isWriting ? "moon-glow" : ""}`}>
            <Moon size={24} />
          </div>
  </section>
    )}
      </div>
    </main>
  );
}
