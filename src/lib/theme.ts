import { writable } from "svelte/store";
import { db, user, userTheme } from "$lib/firebase";
import { collection, doc, onSnapshot } from "firebase/firestore";
import colors from "tailwindcss/colors";

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
    value: 'sky-500'
  },
  button: {
    style: 'circleFill',
    color: 'lime-500',
    fontColor: 'slate-200',
    textEffect: {
      effect: 'none',
      onHover: false
    }
  },
  font: {
    family: 'input-mono',
    color: 'slate-800'
  }
};

export function convert(colorName: string = 'lime-400'): string | undefined {
  const [color, shade] = colorName.split('-');
  return (colors as any)[color]?.[shade];
};

export const themeStore = writable(defaultTheme);

export function setTheme(theme: string) {
  if (typeof window !== "undefined") {
    document.documentElement.setAttribute("data-theme", theme);
  }
}
