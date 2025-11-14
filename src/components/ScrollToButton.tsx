'use client';

import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ScrollToButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  targetId?: string | null;
  targetSelector?: string;
  scrollBehavior?: ScrollBehavior;
}

export default function ScrollToButton({
  children,
  targetId,
  targetSelector,
  scrollBehavior = 'smooth',
  onClick,
  type = 'button',
  ...rest
}: ScrollToButtonProps) {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    if (event.defaultPrevented) return;

    const targetElement = targetId
      ? document.getElementById(targetId)
      : targetSelector
        ? document.querySelector<HTMLElement>(targetSelector)
        : null;

    if (targetElement) {
      targetElement.scrollIntoView({ behavior: scrollBehavior, block: 'start' });
    }
  };

  return (
    <button type={type} {...rest} onClick={handleClick}>
      {children}
    </button>
  );
}

