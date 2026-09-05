/**
 * The Syāt mark.
 *
 * An S under a macron: the ā of "syāt", which is the one letter that makes the name its own.
 * A purely abstract mark was tried first and read as a loading spinner rather than as anything
 * belonging to this project, so the mark is drawn from the name instead.
 *
 * Drawn rather than lettered so it does not depend on a font being loaded, and so it stays legible
 * at tab size. Inline SVG: no request, nothing to license.
 */
export function SyatLogo({ className = "" }: { className?: string }) {
  return (
    <svg className={`syat-logo ${className}`} viewBox="0 0 40 40" role="img" aria-label="Syāt" focusable="false">
      <rect width="40" height="40" rx="9" fill="var(--ink, #241021)" />
      <path d="M13.5 7.5 H26.5" stroke="var(--marigold, #ffc63b)" strokeWidth="3.6" strokeLinecap="round" fill="none" />
      <path d="M26 16.5 C26 12.2 14 12.2 14 17.6 C14 22.6 26 22.6 26 27.8 C26 33.2 14 33.2 14 28.6"
        stroke="var(--paper, #f4eddd)" strokeWidth="4.2" strokeLinecap="round" fill="none" />
    </svg>
  );
}
