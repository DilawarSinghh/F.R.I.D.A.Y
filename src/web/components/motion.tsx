import { type CSSProperties, type HTMLAttributes } from 'react';
import { FridaySymbol } from './brand';
import { cn } from '../lib/utils';

export function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  );
}

type GlyphReaction = { kind: 'on' | 'off'; count: number };

export function NodGlyph({
  size = 32,
  mode = 'idle',
  reaction,
  className,
  progress,
  waiting = false,
}: {
  size?: number;
  mode?: 'idle' | 'thinking' | 'still' | 'bounce';
  reaction?: GlyphReaction | null;
  className?: string;
  progress?: number;
  waiting?: boolean;
}) {
  const received = Math.max(0, Math.min(1, progress ?? 0));
  return (
    <svg
      className={cn('ob-glyph', 'friday-signal', className)}
      data-mode={mode}
      data-waiting={waiting || undefined}
      viewBox="0 0 36 36"
      width={size}
      height={size}
      fill="none"
      aria-hidden="true"
    >
      {progress !== undefined && (
        <circle
          cx="18"
          cy="18"
          r="17"
          className="ob-glyph-trail"
          pathLength="100"
          strokeDasharray={`${received * 100} 100`}
          transform="rotate(-90 18 18)"
        />
      )}
      <g key={reaction?.count} data-reaction={reaction?.kind}>
        <FridaySymbol />
      </g>
    </svg>
  );
}

export function Rise({
  show = true,
  index = 0,
  className,
  style,
  ...props
}: HTMLAttributes<HTMLDivElement> & { show?: boolean; index?: number }) {
  return (
    <div
      className={cn('ob-rise', className)}
      data-show={show}
      inert={!show}
      style={{ '--rise-delay': `${index * 70}ms`, ...style } as CSSProperties}
      {...props}
    />
  );
}
