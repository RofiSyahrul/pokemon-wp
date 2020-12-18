import { useEffect } from 'react';

const defaultTItle = 'Pokemon Explorer by Rofi';

export function useDocumentTitle(title = '') {
  useEffect(() => {
    if (title) {
      document.title = title;
    }
    return () => {
      document.title = defaultTItle;
    };
  }, [title]);
}
