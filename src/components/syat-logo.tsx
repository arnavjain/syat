/**
 * The Syāt mark.
 *
 * "Syāt" means roughly "in some respect" — an assertion offered from a standpoint rather than
 * closed off. So the mark is three arcs around one centre, each covering a different sector and
 * none of them completing the circle. One subject, several partial views, nothing sealed shut.
 *
 * It is drawn rather than lettered so it survives being small: the arcs stay legible at 20px in a
 * browser tab, which a wordmark does not. Inline SVG, no request, no rights to clear.
 */
export function SyatLogo({ className = "" }: { className?: string }) {
  return (
    <svg className={`syat-logo ${className}`} viewBox="0 0 40 40" role="img" aria-label="Syāt" focusable="false">
      {/* Three standpoints on one question, each seeing a different arc of it. */}
      <path d="M20 5.5 A14.5 14.5 0 0 1 33.6 15" fill="none" stroke="var(--marigold, #ffc63b)" strokeWidth="4" strokeLinecap="round" />
      <path d="M33.1 26.5 A14.5 14.5 0 0 1 12.5 33.4" fill="none" stroke="var(--cobalt, #2b4bff)" strokeWidth="4" strokeLinecap="round" />
      <path d="M7.4 27.6 A14.5 14.5 0 0 1 11.2 8.3" fill="none" stroke="var(--hibiscus, #b4144b)" strokeWidth="4" strokeLinecap="round" />
      {/* The subject they are all looking at. */}
      <circle cx="20" cy="20" r="4.6" fill="currentColor" />
    </svg>
  );
}
