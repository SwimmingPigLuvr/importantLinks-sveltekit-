import { writable } from "svelte/store";
import { defaultTheme } from "./theme";
import type { CustomTheme } from "./theme";


export const themeStore = writable(defaultTheme);

export function updateTheme(customTheme: CustomTheme) {
  themeStore.set(customTheme);
}
