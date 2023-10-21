import { writable } from "svelte/store";

export interface CustomTheme {
    name: string;
    background: {
        gradient: Gradient;
        hex: string | undefined;
        image: Image;
        opacity: number;
        style: string;
    };
    link: {
        border: Border;
        fill: Fill;
        radius: string;
        shadow: Shadow;
        title: Title;
    };
    font: Font;
}

export interface Gradient {
    from: Color;
    to: Color;
    direction: string;
}

export interface Color {
    hex: string;
    opacity: number;
}

export interface Image {
    position: PositionValue;
    repeat: RepeatValue;
    size: string;
    url: string;
}

export type RepeatValue = "stretch" | "repeat" | "round" | "space" | "repeat-x" | "repeat-y" | "no-repeat";
export type PositionValue = "left" | "center" | "right" | "top" | "bottom" | "top-left" | "top-right" | "bottom-left" | "bottom-right";

export interface Border {
    gradient: Gradient;
    hex: string | undefined;
    image: BorderImage;
    isVisible: boolean;
    opacity: number;
    fillStyle: string;
    style: string;
    width: string;
}

export interface BorderImage {
    url: string;
    repeat: "stretch" | "repeat" | "round" | "space";
}

export interface Fill {
    gradient: Gradient;
    hex: string | undefined;
    isVisible: boolean;
    opacity: number;
    style: string;
    image: Image;
}

export interface Shadow {
    direction: string;
    gradient: Gradient;
    hex: string | undefined;
    isVisible: boolean;
    opacity: number;
    style: string;
}

export interface Title {
    effect: Effect;
    font: TitleFont;
    opacity: number;
}

export interface Effect {
    effect: string;
    hex: string;
    onHover: boolean;
}

export interface TitleFont {
    size: string;
    tracking: string;
    hex: string | undefined;
}

export interface Font {
    family: string;
    hex: string | undefined;
    opacity: number;
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
      position: 'center',
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
      style: 'link-solid',
      image: {
        position: 'center',
        repeat: "repeat",
        size: "auto",
        url: '/linkDefault.png',
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
      fillStyle: 'border-solid',
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

export const dataTheme: CustomTheme = { 
  name: 'default',
  background: {
    gradient: {
      from: { hex: '', opacity: 100 },
      to: { hex: '', opacity: 100 },
      direction: '0deg',
    },
    hex: '',
    image: {
      position: 'center',
      repeat: "repeat",
      size: "auto",
      url: '',
    },
    opacity: 100,
    style: 'background-gradient',
  },
  link: {
    radius: '',
    fill: {
      gradient: {
        from: { hex: '', opacity: 100 },
        to: { hex: '', opacity: 100 },
        direction: '0deg',
      },
      hex: '',
      isVisible: true,
      opacity: 100,
      style: 'link-solid',
      image: {
        position: 'center',
        repeat: "repeat",
        size: "auto",
        url: '/linkDefault.png',
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
      fillStyle: 'border-solid',
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

export const themeStore = writable(defaultTheme);

export function setTheme(theme: string) {
    if (typeof window !== "undefined") {
        document.documentElement.setAttribute("data-theme", theme);
    }
}

export function hexToRgb(hex: string) {
    let bigint = parseInt(hex.slice(1), 16);
    let r = (bigint >> 16) & 255;
    let g = (bigint >> 8) & 255;
    let b = bigint & 255;
    return r + ',' + g + ',' + b;
}
