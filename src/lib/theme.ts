import { writable } from "svelte/store";

export const buttonStyles = {
  squareFill: {
    buttonRadius: 'none',
    fill: true,
    outline: false,
    shadow: false,
  },
  roundFill: {
    buttonRadius: '[0.5rem]',
    fill: true,
    outline: false,
    shadow: false,
  },
  circleFill: {
    buttonRadius: 'full',
    fill: true,
    outline: false,
    shadow: false,
  },
  squareOutline: {
    buttonRadius: 'none',
    outline: true,
    fill: false,
    shadow: false,
  },
  roundOutline: {
    buttonRadius: '[0.5rem]',
    outline: true,
    fill: false,
    shadow: false,
  },
  circleOutline: {
    buttonRadius: 'full',
    outline: true,
    fill: false,
    shadow: false,
  },
  squareShadow: {
    buttonRadius: 'none',
    shadow: true,
    fill: false,
    outline: false,
  },
  roundShadow: {
    buttonRadius: '[0.5rem]',
    shadow: true,
    fill: false,
    outline: false,
  },
  circleShadow: {
    buttonRadius: 'full',
    shadow: true,
    fill: false,
    outline: false,
  },
};

const defaultTheme = {
  customBackground: 'primary',
  customButtonStyle: 'squareFill' as keyof typeof buttonStyles,
  customButtonColor: 'secondary',
  customButtonFontColor: 'secondary-content',
  customFont: 'input-mono',
};

export const themeStore = writable(defaultTheme);

export function setTheme(theme: string) {
    if (typeof window !== 'undefined') {
        document.documentElement.setAttribute('data-theme', theme);
    }
};







export function getCustomStyles(data: any) {
    let customBackground, customButtonStyle, customButtonColor, customButtonFontColor, customFont;

    if (data && data.customTheme) {

        customBackground = data.customTheme.buttonStyle;
        customButtonStyle = data.customTheme.buttonStyle;
        customButtonColor = data.customTheme.buttonColor;
        customButtonFontColor = data.customTheme.buttonFontColor;
        customFont = data.customTheme.font;
    }

    return {
        customBackground,
        customButtonStyle,
        customButtonColor,
        customButtonFontColor,
        customFont,
    };
}