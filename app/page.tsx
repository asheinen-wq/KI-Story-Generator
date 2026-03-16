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
 const generateStory = async () => {
};

const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  void generateStory();
};

return (

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
<div className="mx-auto flex max-w-md flex-col items-center text-center">
  {imageUrl && (
    <div className="mb-6 flex justify-center items-center overflow-hidden rounded-xl bg-black/20 p-2">
      <img
        src={imageUrl}
        alt="Illustration"
        style={{
          maxHeight: "220px",
          maxWidth: "320px",
          width: "auto",
          objectFit: "contain",
          display: "block",
        }}
      />
    </div>
  )}

  {title && (
    <h2 className="mb-4 text-3xl font-bold text-white text-center">
      {title}
    </h2>
  )}

  <div className="w-full space-y-4 text-center">
    {displayedStory.split("\n\n").map((paragraph, i) => (
      <p key={i} className="leading-8 text-center">
        {paragraph}
      </p>
    ))}
  </div>
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

    <div className="mx-auto flex max-w-md flex-col items-center text-center">
      {imageUrl && (
        <div className="mb-6 flex items-center justify-center overflow-hidden rounded-xl bg-black/20 p-2">
          <img
            src={imageUrl}
            alt="Illustration"
            style={{
              maxHeight: "220px",
              maxWidth: "320px",
              width: "auto",
              objectFit: "contain",
              display: "block",
            }}
          />
        </div>
      )}

      {title && (
        <h2 className="mb-4 text-3xl font-bold text-white text-center">
          {title}
        </h2>
      )}

      <div className="w-full space-y-4 text-center">
        {displayedStory.split("\n\n").map((paragraph, i) => (
          <p key={i} className="leading-8 text-center">
            {paragraph}
          </p>
        ))}
      </div>
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
