import type { ReactNode } from "react";

export const categoryIcons: Record<string, ReactNode> = {
  "stomatologicheskie-ustanovki": (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 21h16M8 21V10a4 4 0 0 1 8 0v11M8 14h8M12 6V3" />
      <circle cx="12" cy="2.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  ),
  "kompressory": (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="2" y="10" width="20" height="10" rx="2" />
      <path d="M6 10V7a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v3" />
      <circle cx="12" cy="15" r="2" />
      <path d="M6 15h2m8 0h2" />
    </svg>
  ),
  "rentgen-oborudovanie": (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v4m0 12v4M2 12h4m12 0h4M5.64 5.64l2.83 2.83m7.07 7.07 2.83 2.83M18.36 5.64l-2.83 2.83M7.05 16.95l-2.83 2.83" />
    </svg>
  ),
  "nakonechniki-i-motory": (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" viewBox="0 0 107 148" aria-hidden="true">
      <path d="M38.9141 127.16L36.8512 140.225C36.3339 143.501 33.2559 145.736 29.9801 145.214L7.55741 141.64C4.20105 141.104 1.95881 137.891 2.61484 134.556L5.25013 121.16L10.5643 94.1466C12.4539 84.5412 15.7457 75.2659 20.3342 66.6183C24.3705 59.0115 29.3738 51.9588 35.2197 45.6357L50.9141 28.6602M50.9141 28.6602L46.7561 26.1654C44.8965 25.0496 44.2647 22.6552 45.3318 20.7672L54.5077 4.53293C55.5703 2.65303 57.9331 1.95585 59.846 2.95783L84.1711 15.6996C86.2043 16.7646 86.9262 19.3183 85.7515 21.2901L82.8502 26.1602M50.9141 28.6602L67.4141 37.6602M82.8502 26.1602L80.9141 29.4102L75.8744 37.8696C74.7783 39.7095 72.4273 40.3596 70.5416 39.3442L67.4141 37.6602M67.4141 37.6602L51.189 70.1103C48.0245 76.4392 45.8524 83.2172 44.7488 90.2066L38.9141 127.16M104.414 42.6602L80.9141 29.4102M87.9141 29.4102L82.8502 26.1602M23.4141 98.6602C25.0807 91.1602 29.4141 74.8602 33.4141 69.6602M5.25013 121.16C15.5436 125.76 26.7873 127.834 38.0445 127.208L38.9141 127.16" />
    </svg>
  ),
  "sterilizatsiya-i-dezinfektsiya": (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  ),
  "mebel": (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2M12 12v3M9 13.5h6" />
    </svg>
  ),
  "raskhodnye-materialy": (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M21 8V21H3V8" />
      <path d="M1 3h22v5H1z" />
      <path d="M10 12h4" />
    </svg>
  ),
  "zapchasti-dlya-oborudovaniya": (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
  "zubotekhnicheskoe-oborudovanie": (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M9 3c-1 2-1 4 0 5s1 3 0 5c0 2 .5 4 1.5 5.5S12 21 12 21s1-.5 1.5-2.5S15 15 15 13c-1-2-1-3 0-5s1-3 0-5" />
      <path d="M9 3h6" />
    </svg>
  ),
};
