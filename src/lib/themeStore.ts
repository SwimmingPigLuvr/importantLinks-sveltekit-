import { writable } from "svelte/store";
import type { CustomTheme } from "./theme";

const defaultTheme: CustomTheme = {
    customF: "input-mono",
    customFC: "black",
    customBG: "primary",
    customBS: "squareFill",
    customBC: "secondary",
    customBFC: "secondary-content", 
};

export const themeStore = writable(defaultTheme);

export function updateTheme(customTheme: CustomTheme) {
    themeStore.set(customTheme);
};