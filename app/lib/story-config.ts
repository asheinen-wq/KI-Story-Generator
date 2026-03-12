export const THEMEN = [
  "Freundschaft",
  "Mut & Tapferkeit",
  "Weltraum-Abenteuer",
  "Unterwasserwelt",
  "Einhorn-Magie",
] as const;

export type Thema = (typeof THEMEN)[number];

export type StoryRequest = {
  name: string;
  held: string;
  thema: Thema;
};

export type StoryResponse = {
  text?: string;
  error?: string;
};

export type PromptExample = {
  label: string;
  name: string;
  held: string;
  thema: Thema;
};

export const PROMPT_EXAMPLES: PromptExample[] = [
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

export const MAX_NAME_LENGTH = 40;
export const MAX_HELD_LENGTH = 80;

export function isValidThema(value: string): value is Thema {
  return THEMEN.includes(value as Thema);
}
