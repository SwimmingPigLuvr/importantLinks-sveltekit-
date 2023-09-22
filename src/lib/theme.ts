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
    hex: string | undefined;
    url: string;
    gradient: string;
    opacity: number;
  };
  link: {
    radius: string;
    fill: {
      isVisible: boolean,
      style: string;
      url: string;
      hex: string | undefined;
      gradient: string;
      opacity: number;
    }
    border: {
      isVisible: boolean,
      style: string;
      url: string;
      hex: string | undefined;
      gradient: string;
      opacity: number;
    }
    shadow: {
      isVisible: boolean,
      style: string;
      gradient: string;
      hex: string | undefined;
      opacity: number;
    }
    title: {
      size: number;
      tracking: string;
      opacity: number;
      hex: string | undefined;
      effect: {
        effect: string;
        hex: string;
        onHover: boolean;
      }
    }
  };
  font: {
    family: string;
    opacity: number;
    hex: string | undefined;
  };
}


export const defaultTheme: CustomTheme = {
  name: 'default', 
  background: {
    style: 'solid', 
    url: '',
    hex: '',
    gradient: '',
    opacity: 100,
  },
  link: {
    radius: 'full',
    fill: {
      isVisible: true,
      style: 'solid',
      url: '',
      hex: '',
      gradient: '',
      opacity: 100,
    },
    border: {
      isVisible: true,
      style: 'solid',
      url: '',
      hex: '',
      gradient: '',
      opacity: 100,
    },
    shadow: {
      isVisible: true,
      style: 'hard',
      gradient: '',
      hex: '',
      opacity: 100,
    },
    title: {
      size: 1,
      tracking: 'none',
      effect: {
        effect: 'none',
        hex: '',
        onHover: false,
      },
      hex: '',
      opacity: 100,
    },
  },
  font: {
    family: 'input-mono',
    opacity: 100,
    hex: convert('lime-200', 100)
  },
};

export const emptyTheme: CustomTheme = {
  name: 'empty', 
  background: {
    style: 'solid', 
    url: '',
    hex: '',
    gradient: '',
    opacity: 100,
  },
  link: {
    radius: 'full',
    fill: {
      isVisible: true,
      style: 'solid',
      url: '',
      hex: '',
      gradient: '',
      opacity: 100,
    },
    border: {
      isVisible: true,
      style: 'solid',
      url: '',
      hex: '',
      gradient: '',
      opacity: 100,
    },
    shadow: {
      isVisible: true,
      style: 'hard',
      gradient: '',
      hex: '',
      opacity: 100,
    },
    title: {
      size: 1,
      tracking: 'none',
      effect: {
        effect: 'none',
        hex: '',
        onHover: false,
      },
      hex: '',
      opacity: 100,
    },
  },
  font: {
    family: 'input-mono',
    opacity: 100,
    hex: convert('lime-200', 100)
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
      isVisible: true,
      style: 'solid',
      url: '',
      hex: '#',
      gradient: '',
      opacity: 100,
    },
    border: {
      isVisible: true,
      style: 'solid',
      value: 'slate-200',
      opacity: 100,
      hex: convert('slate-200', 100)
    },
    shadow: {
      isVisible: true,
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
      isVisible: true,
      style: 'solid',
      value: 'slate-900',
      opacity: 100,
      hex: convert('slate-900', 100)
    },
    border: {
      isVisible: true,
      style: 'solid',
      value: 'slate-800',
      opacity: 100,
      hex: convert('slate-800', 100)
    },
    shadow: {
      isVisible: true,
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
