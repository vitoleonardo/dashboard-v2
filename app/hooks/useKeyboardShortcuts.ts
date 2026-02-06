import { useEffect } from 'react';

export function useKeyboardShortcuts(shortcuts: Record<string, () => void>) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check for Cmd/Ctrl key combinations
      const isCmdOrCtrl = event.metaKey || event.ctrlKey;
      
      Object.entries(shortcuts).forEach(([key, callback]) => {
        const parts = key.split('+');
        const needsCmd = parts.includes('cmd') || parts.includes('ctrl');
        const needsShift = parts.includes('shift');
        const keyChar = parts[parts.length - 1].toLowerCase();
        
        const cmdMatch = needsCmd ? isCmdOrCtrl : !isCmdOrCtrl;
        const shiftMatch = needsShift ? event.shiftKey : !event.shiftKey;
        const keyMatch = event.key.toLowerCase() === keyChar;
        
        if (cmdMatch && shiftMatch && keyMatch) {
          event.preventDefault();
          callback();
        }
      });
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
}
