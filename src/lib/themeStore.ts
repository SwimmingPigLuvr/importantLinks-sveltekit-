import { writable } from "svelte/store";
import type { CustomTheme } from "./theme";

const defaultTheme: CustomTheme = {
    font: "elven",
    fontColor: "black",
    background: "lime-400",
    buttonStyle: "squareFill",
    buttonColor: "secondary",
    buttonFontColor: "secondary-content", 
};

export const themeStore = writable(defaultTheme);

export function updateTheme(customTheme: CustomTheme) {
    themeStore.set(customTheme);
};