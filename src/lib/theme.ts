type UserTheme = {
    background?: string;
    buttonStyle?: string;
    buttonFont?: string;
    buttonColor?: string;
    buttonFontColor?: string;
    font?: string;
    fontColor?: string;
}

export function setTheme(userTheme: UserTheme) {
    if (typeof window !== 'undefined') {
        // Always set custom background if it exists, even if it overrides other themes
        if (userTheme.background) {
            document.documentElement.setAttribute('data-background', userTheme.background);
            console.log('bg attempt to customize ', userTheme.background);
        }

        // Apply other theme properties
        for (const [key, value] of Object.entries(userTheme)) {
            if (value) {
                document.documentElement.setAttribute(`data-${key}`, value);
            }
        }
    }
}