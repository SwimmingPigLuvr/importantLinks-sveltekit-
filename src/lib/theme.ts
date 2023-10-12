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
    gradient: {
      from: {
        hex: string,
        opacity: number,
      },
      to: {
        hex: string,
        opacity: number,
      },
      direction: string
    };
    hex: string | undefined;
    image: {
      position: string,
      repeat: "repeat" | "repeat-x" | "repeat-y" | "no-repeat" | "space" | "round",
      size: "auto" | "contain" | "cover",
      url: string,
    };
    opacity: number;
    style: string;
  };
  link: {
    border: {
      gradient: {
        from: {
          hex: string,
          opacity: number,
        },
        to: {
          hex: string,
          opacity: number,
        },
        direction: string,
      };
      hex: string | undefined;
      image: {
        url: string,
        repeat: "stretch" | "repeat" | "round" | "space",
      }
      isVisible: boolean,
      opacity: number;
      fillStyle: string;
      style: string;
      width: string;
    }
    fill: {
      gradient: {
        from: {
          hex: string,
          opacity: number,
        },
        to: {
          hex: string,
          opacity: number,
        },
        direction: string,
      };
      hex: string | undefined;
      isVisible: boolean,
      opacity: number;
      style: string;
      image: {
        position: string,
        repeat: "repeat" | "repeat-x" | "repeat-y" | "no-repeat" | "space" | "round",
        size: "auto" | "contain" | "cover",
        url: string,
      };
    }
    radius: string;
    shadow: {
      direction: string;
      gradient: {
        from: {
          hex: string,
          opacity: number,
        },
        to: {
          hex: string,
          opacity: number,
        },
        direction: string,
      };
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
    gradient: {
      from: { hex: '', opacity: 100 },
      to: { hex: '', opacity: 100 },
      direction: '0deg',
    },
    hex: '',
    image: {
      position: '',
      repeat: "repeat",
      size: "auto",
      url: '',
    },
    opacity: 100,
    style: 'solid',
  },
  link: {
    radius: 'full',
    fill: {
      gradient: {
        from: { hex: '', opacity: 100 },
        to: { hex: '', opacity: 100 },
        direction: '0deg',
      },
      hex: '',
      isVisible: true,
      opacity: 100,
      style: 'solid',
      image: {
        position: '',
        repeat: "repeat",
        size: "auto",
        url: '',
      },
    },
    border: {
      gradient: {
        from: { hex: '', opacity: 100 },
        to: { hex: '', opacity: 100 },
        direction: '0deg',
      },
      hex: '',
      image: {
        url: '',
        repeat: "repeat",
      },
      isVisible: true,
      opacity: 100,
      fillStyle: 'color',
      style: 'solid',
      width: '0.5rem',
    },
    shadow: {
      direction: '',
      gradient: {
        from: { hex: '', opacity: 100 },
        to: { hex: '', opacity: 100 },
        direction: '0deg',
      },
      hex: '',
      isVisible: true,
      opacity: 100,
      style: 'hard-shadow',
    },
    title: {
      effect: {
        effect: 'none',
        hex: '',
        onHover: false,
      },
      font: {
        hex: '',
        size: '1rem',
        tracking: '',
      },
      opacity: 100,
    },
  },
  font: {
    family: 'input-mono',
    hex: '',
    opacity: 100,
  },
};

export const emptyTheme: CustomTheme = {
  name: 'empty',
  background: {
    gradient: {
      from: { hex: '', opacity: 100 },
      to: { hex: '', opacity: 100 },
      direction: '0deg',
    },
    hex: '',
    image: {
      position: '',
      repeat: "repeat",
      size: "auto",
      url: '',
    },
    opacity: 100,
    style: 'solid',
  },
  link: {
    radius: 'half',
    fill: {
      gradient: {
        from: { hex: '', opacity: 100 },
        to: { hex: '', opacity: 100 },
        direction: '0deg',
      },
      hex: '',
      isVisible: true,
      opacity: 100,
      style: 'solid',
      image: {
        position: '',
        repeat: "repeat",
        size: "auto",
        url: '',
      },
    },
    border: {
      gradient: {
        from: { hex: '', opacity: 100 },
        to: { hex: '', opacity: 100 },
        direction: '0deg',
      },
      hex: '',
      image: {
        url: '',
        repeat: "repeat",
      },
      isVisible: true,
      opacity: 100,
      fillStyle: 'color',
      style: 'solid',
      width: '0.1rem',
    },
    shadow: {
      direction: '',
      gradient: {
        from: { hex: '', opacity: 100 },
        to: { hex: '', opacity: 100 },
      direction: '0deg',
      },
      hex: '',
      isVisible: true,
      opacity: 100,
      style: 'hard-shadow',
    },
    title: {
      effect: {
        effect: 'none',
        hex: '',
        onHover: false,
      },
      font: {
        hex: '',
        size: '1rem',
        tracking: '',
      },
      opacity: 100,
    },
  },
  font: {
    family: 'input-mono',
    hex: '',
    opacity: 100,
  },
};


export const light: CustomTheme = {
  name: 'light', 
  background: {
    style: 'gradient', 
    hex: '#F5F5F5',
    gradient: {
      from: { hex: '#FFFFFF', opacity: 100 },
      to: { hex: '#F5F5F5', opacity: 100 },
      direction: '0deg',
    },
    opacity: 100,
    image: {
      position: '',
      repeat: "no-repeat",
      size: "cover",
      url: '',
    },
  },
  link: {
    radius: 'full',
    fill: {
      isVisible: true,
      style: 'gradient',
      hex: '#FFFFFF',
      gradient: {
        from: { hex: '#EDEDED', opacity: 100 },
        to: { hex: '#FFFFFF', opacity: 100 },
        direction: '0deg',
      },
      opacity: 100,
      image: {
        position: '',
        repeat: "no-repeat",
        size: "cover",
        url: '',
      },
    },
    border: {
      gradient: {
        from: { hex: '#D0D0D0', opacity: 100 },
        to: { hex: '#D1D1D1', opacity: 100 },
        direction: '0deg',
      },
      hex: '#D1D1D1',
      isVisible: true,
      opacity: 100,
      fillStyle: 'color',
      style: 'solid',
      image: {
        url: '',
        repeat: "repeat",
      },
      width: '0.1rem',
    },
    shadow: {
      direction: '',
      gradient: {
        from: { hex: '#AFAFAF', opacity: 1 },
        to: { hex: '#B0B0B0', opacity: 100 },
        direction: '0deg',
      },
      hex: '#B0B0B0',
      isVisible: true,
      style: 'soft',
      opacity: 100,
    },
    title: {
      font: {
        hex: '#333333',
        tracking: '',
        size: '1rem',
      },
      effect: {
        effect: 'none',
        onHover: false,
        hex: '#000000'
      },
      opacity: 100,
    },
  },
  font: {
    family: 'input-mono',
    opacity: 100,
    hex: '#4A4A4A'
  },
};

export const dark: CustomTheme = {
  name: 'dark', 
  background: {
    style: 'gradient', 
    hex: '#121212',
    gradient: {
      from: { hex: '#121212', opacity: 100 },
      to: { hex: '#000000', opacity: 100 },
        direction: '0deg',
    },
    opacity: 100,
    image: {
      position: '',
      repeat: "no-repeat",
      size: "cover",
      url: '',
    },
  },
  link: {
    radius: 'full',
    fill: {
      isVisible: true,
      style: 'gradient',
      hex: '#1F1F1F',
      gradient: {
        from: { hex: '#1D1D1D', opacity: 100 },
        to: { hex: '#1F1F1F', opacity: 100 },
        direction: '0deg',
      },
      opacity: 100,
      image: {
        position: '',
        repeat: "no-repeat",
        size: "cover",
        url: '',
      },
    },
    border: {
      gradient: {
        from: { hex: '#373737', opacity: 100 },
        to: { hex: '#393939', opacity: 100 },
        direction: '0deg',
      },
      hex: '#393939',
      isVisible: true,
      fillStyle: 'color',
      style: 'double',
      image: {
        url: '',
        repeat: "repeat",
      },
      opacity: 100,
      width: '0.2rem'
    },
    shadow: {
      direction: '',
      gradient: {
        from: { hex: '#000000', opacity: 100 },
        to: { hex: '#010101', opacity: 100 },
        direction: '0deg',
      },
      hex: '#000000',
      isVisible: true,
      style: 'soft',
      opacity: 100,
    },
    title: {
      font: {
        hex: '#D0D0D0',
        tracking: 'none',
        size: '1rem',
      },
      effect: {
        effect: 'none',
        onHover: false,
        hex: '#E0E0E0'
      },
      opacity: 100,
    },
  },
  font: {
    family: 'input-mono',
    opacity: 100,
    hex: '#B0B0B0'
  },
};

export const themeStore = writable(defaultTheme);

export function setTheme(theme: string) {
  if (typeof window !== "undefined") {
    document.documentElement.setAttribute("data-theme", theme);
  }
}
