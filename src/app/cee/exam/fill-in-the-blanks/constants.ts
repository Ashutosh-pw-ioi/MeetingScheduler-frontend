// Types
export interface Question {
  id: number;
  question: string;
  answer: string;
}

export interface Paper {
  id: string;
  title: string;
  questions: Question[];
}

export interface Category {
  id: string;
  title: string;
  papers: Paper[];
}

export interface FillBlankCategories {
  [key: string]: Category;
}

// Data
import codingFillBlanks from "./codingFillBlanks.json";
import languageFillBlanks from "./languageFillBlanks.json";
import reasoningFillBlanks from "./reasoningFillBlanks.json";
import aptitudeFillBlanks from "./aptitudeFillBlanks.json";

export const fillBlankCategories: FillBlankCategories = {
  coding: { id: "coding", title: "Ability to Code", papers: codingFillBlanks },
  language: { id: "language", title: "Language Reasoning", papers: languageFillBlanks },
  reasoning: { id: "reasoning", title: "Analytical Reasoning", papers: reasoningFillBlanks },
  aptitude: { id: "aptitude", title: "Aptitude", papers: aptitudeFillBlanks },
};
