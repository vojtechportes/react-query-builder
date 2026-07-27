import { useCallback, useEffect, useRef, useState } from 'react';

export interface IUseSelectMultiProps {
  disabled: boolean;
}

export const useSelectMulti = ({ disabled }: IUseSelectMultiProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggle = useCallback(() => {
    if (disabled) {
      return;
    }

    setIsOpen((currentValue) => !currentValue);
  }, [disabled]);

  useEffect(() => {
    const handleClickAway = (event: MouseEvent) => {
      const target = event.target;

      if (!(target instanceof Node)) {
        return;
      }

      if (rootRef.current?.contains(target)) {
        return;
      }

      close();
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close();
        triggerRef.current?.focus();
      }
    };

    document.addEventListener('mousedown', handleClickAway);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickAway);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [close]);

  return {
    close,
    isOpen,
    rootRef,
    toggle,
    triggerRef,
  };
};
