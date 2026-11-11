import { Platform } from 'react-native';
import * as Clipboard from 'expo-clipboard';

/**
 * Copies text to the clipboard and reports whether it worked.
 *
 * On web the async Clipboard API can stay pending (no answer) in some
 * browsers, so we first try the synchronous textarea + execCommand way,
 * which works inside a click handler. Native platforms use expo-clipboard.
 */
export async function copyText(text: string): Promise<boolean> {
  if (Platform.OS === 'web' && typeof document !== 'undefined') {
    const el = document.createElement('textarea');
    el.value = text;
    el.setAttribute('readonly', '');
    el.style.position = 'fixed';
    el.style.opacity = '0';
    document.body.appendChild(el);
    el.select();
    let ok = false;
    try {
      ok = document.execCommand('copy');
    } catch {
      ok = false;
    }
    document.body.removeChild(el);
    if (ok) return true;
  }

  try {
    await Promise.race([
      Clipboard.setStringAsync(text),
      new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 1500)),
    ]);
    return true;
  } catch {
    return false;
  }
}
