export function setTheme(theme: string) {
    if (typeof window !== 'undefined') {
        document.documentElement.setAttribute('data-theme', theme);
    }
}