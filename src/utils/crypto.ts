const ENCRYPTION_KEY = 'WP'; // Shorter key for more compact output

export function encryptPuzzle(puzzle: string): string {
  const data = JSON.parse(puzzle);
  // Only encrypt essential data in a compact format: word|hint|category|creator
  const compactData = `${data.word}|${data.hint}|${data.category}|${data.creator}`;
  
  let result = '';
  for (let i = 0; i < compactData.length; i++) {
    const charCode = compactData.charCodeAt(i) ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length);
    result += String.fromCharCode(charCode);
  }
  return btoa(result).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

export function decryptPuzzle(encrypted: string): string {
  try {
    const base64 = encrypted.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, '=');
    const decoded = atob(padded);
    
    let result = '';
    for (let i = 0; i < decoded.length; i++) {
      const charCode = decoded.charCodeAt(i) ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length);
      result += String.fromCharCode(charCode);
    }
    
    // Split the compact data back into object format
    const [word, hint, category, creator] = result.split('|');
    return JSON.stringify({ word, hint, category, creator });
  } catch (e) {
    throw new Error('Invalid puzzle data');
  }
}