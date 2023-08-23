import { writable } from "svelte/store";
import { db, user, userTheme } from "$lib/firebase";
import { collection, doc, onSnapshot } from "firebase/firestore";

export const buttonStyles = {
  squareFill: {
    buttonRadius: "none",
    fill: true,
    outline: false,
    shadow: false,
  },
  roundFill: {
    buttonRadius: "[0.5rem]",
    fill: true,
    outline: false,
    shadow: false,
  },
  circleFill: {
    buttonRadius: "full",
    fill: true,
    outline: false,
    shadow: false,
  },
  squareOutline: {
    buttonRadius: "none",
    outline: true,
    fill: false,
    shadow: false,
  },
  roundOutline: {
    buttonRadius: "[0.5rem]",
    outline: true,
    fill: false,
    shadow: false,
  },
  circleOutline: {
    buttonRadius: "full",
    outline: true,
    fill: false,
    shadow: false,
  },
  squareShadow: {
    buttonRadius: "none",
    shadow: true,
    fill: false,
    outline: false,
  },
  roundShadow: {
    buttonRadius: "[0.5rem]",
    shadow: true,
    fill: false,
    outline: false,
  },
  circleShadow: {
    buttonRadius: "full",
    shadow: true,
    fill: false,
    outline: false,
  },
};

export interface CustomTheme {
  background: {
    style: 'image' | 'gradient' | 'solid',
    value: string
  };
  button: {
    style: | "squareFill"
    | "roundFill"
    | "circleFill"
    | "squareOutline"
    | "roundOutline"
    | "circleOutline"
    | "squareShadow"
    | "roundShadow"
    | "circleShadow",
    color: string,
    fontColor: string,
    textEffect: {
      effect: 'none' | 'glow' | 'gradient' | 'highlight',
      onHover: boolean
    }
  };
  font: {
    family: string,
    color: string,
  }
}

export const defaultTheme: CustomTheme = {
  background: {
    style: 'solid',
    value: 'accent'
  },
  button: {
    style: 'circleFill',
    color: 'primary',
    fontColor: 'primary-content',
    textEffect: {
      effect: 'none',
      onHover: false
    }
  },
  font: {
    family: 'input-mono',
    color: 'black'
  }
};

export const themeStore = writable(defaultTheme);

export function setTheme(theme: string) {
  if (typeof window !== "undefined") {
    document.documentElement.setAttribute("data-theme", theme);
  }
}
