import { writable } from "svelte/store";
import { db, storage, user, userData, userTheme } from "$lib/firebase";
import { collection, doc, onSnapshot, writeBatch, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import colors from "tailwindcss/colors";

export const light: CustomTheme = {
  name: 'light',
  current: false,
  background: {
    style: "solid",
    value: "sky-50",
    opacity: 100,
  },
  button: {
    style: "circleBorder",
    color: "zinc-200",
    opacity: 100,
    border: 'zinc-600',
    borderOpacity: 0,
    shadow: '',
    shadowOpacity: 0,
    fontColor: "zinc-800",
    fontOpacity: 100,
    textEffect: {
      effect: "none",
      onHover: false,
    },
  },
  font: {
    family: "input-mono",
    color: "slate-800",
    opacity: 100,
  },

};

export const dark: CustomTheme = { 
  name: 'dark',
  current: false,
  background: {
    style: "solid",
    value: "zinc-900",
    opacity: 100,
  },
  button: {
    style: "circleBorder",
    color: "zinc-700",
    opacity: 100,
    border: 'zinc-500',
    borderOpacity: 0,
    shadow: '',
    shadowOpacity: 0,
    fontColor: "slate-200",
    fontOpacity: 100,
    textEffect: {
      effect: "none",
      onHover: false,
    },
  },
  font: {
    family: "input-mono",
    color: "slate-400",
    opacity: 100,
  },

}

export const buttonStyles = {
  squareHardShadow: {
    buttonRadius: "none",
    fill: false,
    border: false,
    shadow: false,
    hardShadow: true,
  },
  roundHardShadow: {
    buttonRadius: "[0.5rem]",
    fill: false,
    border: false,
    shadow: false,
    hardShadow: true,
  },
  circleHardShadow: {
    buttonRadius: "full",
    fill: false,
    border: false,
    shadow: false,
    hardShadow: true,
  },
  squareFill: {
    buttonRadius: "none",
    fill: true,
    border: false,
    shadow: false,
    hardShadow: false,
  },
  roundFill: {
    buttonRadius: "[0.5rem]",
    fill: true,
    border: false,
    shadow: false,
    hardShadow: false,
  },
  circleFill: {
    buttonRadius: "full",
    fill: true,
    border: false,
    shadow: false,
    hardShadow: false,
  },
  squareBorder: {
    buttonRadius: "none",
    border: true,
    fill: false,
    shadow: false,
    hardShadow: false,
  },
  roundBorder: {
    buttonRadius: "[0.5rem]",
    border: true,
    fill: false,
    shadow: false,
    hardShadow: false,
  },
  circleBorder: {
    buttonRadius: "full",
    border: true,
    fill: false,
    shadow: false,
    hardShadow: false,
  },
  squareShadow: {
    buttonRadius: "none",
    shadow: true,
    fill: false,
    border: false,
    hardShadow: false,
  },
  roundShadow: {
    buttonRadius: "[0.5rem]",
    shadow: true,
    fill: false,
    border: false,
    hardShadow: false,
  },
  circleShadow: {
    buttonRadius: "full",
    shadow: true,
    fill: false,
    border: false,
    hardShadow: false,
  },
};

export interface CustomTheme {
  name: string; 
  current: boolean;
  background: {
    style: "image" | "gradient" | "solid";
    value: string;
    opacity: number;
  };
  button: {
    style:
      | "squareHardShadow"
      | "roundHardShadow"
      | "circleHardShadow"
      | "squareFill"
      | "roundFill"
      | "circleFill"
      | "squareBorder"
      | "roundBorder"
      | "circleBorder"
      | "squareShadow"
      | "roundShadow"
      | "circleShadow";
    color: string;
    opacity: number;
    fontColor: string;
    fontOpacity: number;
    border: string;
    borderOpacity: number;
    shadow: string;
    shadowOpacity: number;
    textEffect: {
      effect: "none" | "glow" | "gradient" | "highlight";
      onHover: boolean;
    };
  };
  font: {
    family: string;
    color: string;
    opacity: number;
  };
  }


export const defaultTheme: CustomTheme = {
  name: 'default',
  current: false,
  background: {
    style: "solid",
    value: "sky-500",
    opacity: 100,
  },
  button: {
    style: "circleFill",
    color: "lime-500",
    opacity: 100,
    border: '',
    borderOpacity: 0,
    shadow: '',
    shadowOpacity: 0,
    fontColor: "slate-200",
    fontOpacity: 100,
    textEffect: {
      effect: "none",
      onHover: false,
    },
  },
  font: {
    family: "input-mono",
    color: "slate-800",
    opacity: 100,
  },
};

export function convert(colorName: string = "lime-400"): string {
  const [color, shade] = colorName.split("-");
  return (colors as any)[color]?.[shade];
}

export function concatOpacity(
  hex: string | undefined,
  opacity: number,
): string {
  if (opacity >= 0 && opacity <= 99) {
    // If opacity is a single digit, prepend a '0' for formatting.
    const paddedOpacity =
      opacity < 10 ? "0" + opacity.toString() : opacity.toString();
    return hex?.concat(paddedOpacity) ?? "";
  } else {
    return hex?.concat("FF") ?? "";
  }
}

export const themeStore = writable(defaultTheme);

export function setTheme(theme: string) {
  if (typeof window !== "undefined") {
    document.documentElement.setAttribute("data-theme", theme);
  }
}
