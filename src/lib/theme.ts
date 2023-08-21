import { writable } from "svelte/store";
import { db, user, userTheme } from "$lib/firebase";
import { collection, doc, onSnapshot } from "firebase/firestore";

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

export interface CustomTheme {
  customBG: string;
  customBS: "squareFill" | "roundFill" | "circleFill" | "squareOutline" | "roundOutline" | "circleOutline" | "squareShadow" | "roundShadow" | "circleShadow";
  customBC: string;
  customBFC: string;
  customF: string;
  customFC: string;
}

export const defaultTheme: CustomTheme = {
  customBG: 'primary',
  customBS: 'squareFill',
  customBC: 'secondary',
  customBFC: 'secondary-content',
  customF: 'input-mono',
  customFC: 'black',
};


export const themeStore = writable(defaultTheme);



export function setTheme(theme: string) {
    if (typeof window !== 'undefined') {
        document.documentElement.setAttribute('data-theme', theme);
    }
};







export function getCustomStyles(data: {customTheme?: CustomTheme }): CustomTheme {

  let customF = '';
  let customFC = '';
  let customBG = '';
  let customBS: CustomTheme['customBS'] = 'squareFill'; // Default value or a suitable one
  let customBC = '';
  let customBFC = '';

    if (data && data.customTheme) {

        customF = data.customTheme.customF;
        customFC = data.customTheme.customFC;
        customBG = data.customTheme.customBG;
        customBS = data.customTheme.customBS;
        customBC = data.customTheme.customBC;
        customBFC = data.customTheme.customBFC;
    }

    return {
        customF,
        customFC,
        customBG,
        customBS,
        customBC,
        customBFC,
    };
}