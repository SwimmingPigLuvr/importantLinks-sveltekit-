import { writable } from "svelte/store";
import { db, storage, user, userData, userTheme } from "$lib/firebase";
import { collection, doc, onSnapshot, writeBatch, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import colors from "tailwindcss/colors";



export interface GradientValue {
  value: string,
  shade: string,
  opacity: number
}

export interface CustomTheme {
  name: string; 
  background: {
    style: "image" | "gradient" | "solid";
    value: string;
    opacity: number;
  };
  link: {
    radius: string;
    fill: {
      style: string;
      value: string;
      opacity: number;
    }
    border: {
      style: string;
      value: string;
      opacity: number;
    }
    shadow: {
      style: string;
      value: string;
      opacity: number;
    }
    title: {
      value: string;
      size: number;
      tracking: string;
      opacity: number;
      effect: string;
      onHover: boolean;
    }
  };
  font: {
    family: string;
    value: string;
    opacity: number;
  };
}


export const defaultTheme: CustomTheme = {
  name: 'default', 
  background: {
    style: 'solid', 
    value: 'lime-400',
    opacity: 100,
  },
  link: {
    radius: 'full',
    fill: {
      style: 'solid',
      value: 'lime-50',
      opacity: 100,
    },
    border: {
      style: 'solid',
      value: 'cyan-800',
      opacity: 100,
    },
    shadow: {
      style: 'hard',
      value: 'slate-950',
      opacity: 100,
    },
    title: {
      value: 'lime-400',
      size: 1,
      tracking: 'none',
      opacity: 100,
      effect: 'none',
      onHover: false,
    },
  },
  font: {
    family: 'input-mono',
    value: 'lime-200',
    opacity: 100,
  },
};

export const emptyTheme: CustomTheme = {
  name: 'empty', 
  background: {
    style: 'solid', 
    value: '',
    opacity: 100,
  },
  link: {
    radius: '',
    fill: {
      style: 'solid',
      value: '',
      opacity: 100,
    },
    border: {
      style: 'none',
      value: '',
      opacity: 100,
    },
    shadow: {
      style: 'none',
      value: '',
      opacity: 100,
    },
    title: {
      value: '',
      size: 1,
      tracking: 'none',
      opacity: 100,
      effect: 'none',
      onHover: false,
    },
  },
  font: {
    family: '',
    value: '',
    opacity: 100,
  },
};

export const light: CustomTheme = {
  name: 'light', 
  background: {
    style: 'solid', 
    value: 'slate-50',
    opacity: 100,
  },
  link: {
    radius: 'full',
    fill: {
      style: 'solid',
      value: 'slate-100',
      opacity: 100,
    },
    border: {
      style: 'solid',
      value: 'slate-200',
      opacity: 100,
    },
    shadow: {
      style: 'soft',
      value: 'slate-950',
      opacity: 100,
    },
    title: {
      value: 'slate-950',
      size: 1,
      tracking: 'none',
      opacity: 100,
      effect: 'none',
      onHover: false,
    },
  },
  font: {
    family: 'input-mono',
    value: 'slate-700',
    opacity: 100,
  },
};

export const dark: CustomTheme = {
  name: 'dark', 
  background: {
    style: 'solid', 
    value: 'slate-950',
    opacity: 100,
  },
  link: {
    radius: 'none',
    fill: {
      style: 'solid',
      value: 'slate-900',
      opacity: 100,
    },
    border: {
      style: 'solid',
      value: 'slate-800',
      opacity: 100,
    },
    shadow: {
      style: 'soft',
      value: 'slate-50',
      opacity: 100,
    },
    title: {
      value: 'slate-50',
      size: 1,
      tracking: 'none',
      opacity: 100,
      effect: 'none',
      onHover: false,
    },
  },
  font: {
    family: 'input-mono',
    value: 'slate-300',
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
