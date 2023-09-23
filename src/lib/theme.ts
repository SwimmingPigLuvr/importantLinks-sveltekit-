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
    gradient: string;
    hex: string | undefined;
    opacity: number;
    style: "image" | "gradient" | "solid";
    url: string;
  };
  link: {
    border: {
      gradient: string;
      hex: string | undefined;
      isVisible: boolean,
      opacity: number;
      style: string;
      url: string;
      width: string;
    }
    fill: {
      gradient: string;
      hex: string | undefined;
      isVisible: boolean,
      opacity: number;
      style: string;
      url: string;
    }
    radius: string;
    shadow: {
      direction: string;
      gradient: string;
      hex: string | undefined;
      isVisible: boolean,
      opacity: number;
      style: string;
    }
    title: {
      effect: {
        effect: string;
        hex: string;
        onHover: boolean;
      }
      font: {
        size: string;
        tracking: string;
        hex: string | undefined;
      }
      opacity: number;
    }
  };
  font: {
    family: string;
    hex: string | undefined;
    opacity: number;
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
    hex: '',
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
    url: '',
    opacity: 100,
    gradient: '',
    hex: '#F5F5F5',
  },
  link: {
    radius: 'full',
    fill: {
      isVisible: true,
      style: 'solid',
      url: '',
      hex: '#FFFFFF',
      gradient: '',
      opacity: 100,
    },
    border: {
      isVisible: true,
      style: 'solid',
      url: '',
      hex: '#D1D1D1',
      gradient: '',
      opacity: 100,
    },
    shadow: {
      isVisible: true,
      style: 'soft',
      gradient: '',
      opacity: 100,
      hex: '#B0B0B0'
    },
    title: {
      hex: '#333333',
      size: 1,
      tracking: 'none',
      opacity: 100,
      effect: {
        effect: 'none',
        onHover: false,
        hex: '#000000'
      }
    },
  },
  font: {
    family: 'input-mono',
    opacity: 100,
    hex: '#4A4A4A'
  },
};

export const dark: CustomTheme = {
  name: 'light', 
  background: {
    style: 'solid', 
    url: '',
    opacity: 100,
    gradient: '',
    hex: '#121212',
  },
  link: {
    radius: 'full',
    fill: {
      isVisible: true,
      style: 'solid',
      url: '',
      hex: '#1F1F1F',
      gradient: '',
      opacity: 100,
    },
    border: {
      isVisible: true,
      style: 'solid',
      url: '',
      hex: '#393939',
      gradient: '',
      opacity: 100,
    },
    shadow: {
      isVisible: true,
      style: 'soft',
      gradient: '',
      opacity: 100,
      hex: '#000000'
    },
    title: {
      hex: '#333333',
      size: 1,
      tracking: 'none',
      opacity: 100,
      effect: {
        effect: 'none',
        onHover: false,
        hex: '#E0E0E0'
      }
    },
  },
  font: {
    family: 'input-mono',
    opacity: 100,
    hex: '#B0B0B0'
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
