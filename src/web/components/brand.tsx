export function FridaySymbol() {
  return (
    <>
      <path
        d="M18 2 32 10v16l-14 8L4 26V10Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M11 10h15l-3 5h-6v4h6l-3 5h-3v5h-6Z" fill="var(--brand-accent)" />
    </>
  );
}

export function BrandMark({ small = false }: { small?: boolean }) {
  return (
    <span className={`brand-glyph ${small ? 'brand-glyph-small' : ''}`} aria-hidden="true">
      <svg viewBox="0 0 36 36" fill="none">
        <FridaySymbol />
      </svg>
    </span>
  );
}
