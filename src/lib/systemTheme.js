import { browser } from '$app/environment';

/**
 * Initializes the system theme listener.
 * Detects the user's system preference for dark/light mode and applies it.
 * Listens for real-time changes to system preferences.
 */
export function initSystemTheme() {
	if (!browser) return;

	const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
	const preferDarkEnv = (import.meta.env.PREFER_DARK_MODE ?? '').toLowerCase();

	function applyTheme(isDark) {
		document.documentElement.classList.toggle('dark', isDark);
		// Dispatch event for map providers
		window.dispatchEvent(new CustomEvent('themeChange', { detail: { darkMode: isDark } }));
	}

	// Apply initial theme: use light if PREFER_DARK_MODE is false, otherwise use system preference
	const isDark = preferDarkEnv === 'false' ? false : mediaQuery.matches;
	applyTheme(isDark);

	// Only listen for system changes if not forcing light mode
	if (preferDarkEnv !== 'false') {
		mediaQuery.addEventListener('change', (e) => applyTheme(e.matches));
	}

	// Clean up old localStorage preference
	localStorage.removeItem('theme');
}
