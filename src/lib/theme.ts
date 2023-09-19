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
    hex: string | undefined;
  };
  link: {
    radius: string;
    fill: {
      visible: boolean,
      style: string;
      value: string;
      opacity: number;
      hex: string | undefined;
    }
    border: {
      visible: boolean,
      style: string;
      value: string;
      opacity: number;
      hex: string | undefined;
    }
    shadow: {
      visible: boolean,
      style: string;
      value: string;
      opacity: number;
      hex: string | undefined;
    }
    title: {
      value: string;
      size: number;
      tracking: string;
      opacity: number;
      hex: string | undefined;
      effect: string;
      onHover: boolean;
    }
  };
  font: {
    family: string;
    value: string;
    opacity: number;
    hex: string | undefined;
  };
}


export const defaultTheme: CustomTheme = {
  name: 'default', 
  background: {
    style: 'solid', 
    value: 'lime-400',
    opacity: 100,
    hex: convert('lime-400', 100)
  },
  link: {
    radius: 'full',
    fill: {
      visible: true,
      style: 'solid',
      value: 'lime-50',
      opacity: 100,
      hex: convert('lime-50', 100),
    },
    border: {
      visible: true,
      style: 'solid',
      value: 'cyan-800',
      opacity: 100,
      hex: convert('cyan-800', 100),
    },
    shadow: {
      visible: true,
      style: 'hard',
      value: 'slate-950',
      opacity: 100,
      hex: convert('slate-950', 100)
    },
    title: {
      value: 'lime-400',
      size: 1,
      tracking: 'none',
      opacity: 100,
      effect: 'none',
      onHover: false,
      hex: convert('lime-400', 100),
    },
  },
  font: {
    family: 'input-mono',
    value: 'lime-200',
    opacity: 100,
    hex: convert('lime-200', 100)
  },
};

export const emptyTheme: CustomTheme = {
  name: 'empty', 
  background: {
    style: 'solid', 
    value: '',
    opacity: 100,
    hex: undefined,
  },
  link: {
    radius: '',
    fill: {
      visible: true,
      style: 'solid',
      value: '',
      opacity: 100,
      hex: undefined,
    },
    border: {
      visible: true,
      style: 'none',
      value: '',
      opacity: 100,
      hex: undefined,
    },
    shadow: {
      visible: true,
      style: 'none',
      value: '',
      opacity: 100,
      hex: undefined,
    },
    title: {
      value: '',
      size: 1,
      tracking: 'none',
      opacity: 100,
      effect: 'none',
      onHover: false,
      hex: undefined,
    },
  },
  font: {
    family: '',
    value: '',
    opacity: 100,
    hex: undefined,
  },
};

export const light: CustomTheme = {
  name: 'light', 
  background: {
    style: 'solid', 
    value: 'slate-50',
    opacity: 100,
    hex: convert('slate-50', 100)
  },
  link: {
    radius: 'full',
    fill: {
      visible: true,
      style: 'solid',
      value: 'slate-100',
      opacity: 100,
      hex: convert('slate-100', 100)
    },
    border: {
      visible: true,
      style: 'solid',
      value: 'slate-200',
      opacity: 100,
      hex: convert('slate-200', 100)
    },
    shadow: {
      visible: true,
      style: 'soft',
      value: 'slate-950',
      opacity: 100,
      hex: convert('slate-950', 100)
    },
    title: {
      value: 'slate-950',
      size: 1,
      tracking: 'none',
      opacity: 100,
      effect: 'none',
      onHover: false,
      hex: convert('slate-950', 100)
    },
  },
  font: {
    family: 'input-mono',
    value: 'slate-700',
    opacity: 100,
    hex: convert('slate-700', 100)
  },
};

export const dark: CustomTheme = {
  name: 'dark', 
  background: {
    style: 'solid', 
    value: 'slate-950',
    opacity: 100,
    hex: convert('slate-950', 100)
  },
  link: {
    radius: 'none',
    fill: {
      visible: true,
      style: 'solid',
      value: 'slate-900',
      opacity: 100,
      hex: convert('slate-900', 100)
    },
    border: {
      visible: true,
      style: 'solid',
      value: 'slate-800',
      opacity: 100,
      hex: convert('slate-800', 100)
    },
    shadow: {
      visible: true,
      style: 'soft',
      value: 'slate-50',
      opacity: 100,
      hex: convert('slate-50', 100)
    },
    title: {
      value: 'slate-50',
      size: 1,
      tracking: 'none',
      opacity: 100,
      effect: 'none',
      onHover: false,
      hex: convert('slate-50', 100)
    },
  },
  font: {
    family: 'input-mono',
    value: 'slate-300',
    opacity: 100,
    hex: convert('slate-300' , 100)
  },
};

export function convert(value: string, opacity: number): string {
  const [color, shade] = value.split('-');
  const hex = (colors as any)[color]?.[shade];

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
