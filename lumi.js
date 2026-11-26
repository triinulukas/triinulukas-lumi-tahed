// Lumi the snow fairy: an original character (lilac hair in two snowball buns, snowflake tiara,
// icy-blue cloak). Plain SVG so it works offline and scales to any screen.
export const lumiSvg = () => `
<svg class="lumi" viewBox="0 0 200 230" role="img" aria-label="Lumi">
  <defs>
    <linearGradient id="cloak" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#bfe6ff"/><stop offset="1" stop-color="#7fb4f0"/>
    </linearGradient>
    <linearGradient id="hair" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#f3eaff"/><stop offset="1" stop-color="#c9b6f5"/>
    </linearGradient>
    <radialGradient id="glow"><stop offset="0" stop-color="#fff" stop-opacity=".9"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
  </defs>
  <circle cx="100" cy="110" r="100" fill="url(#glow)" opacity=".35"/>
  <!-- cloak -->
  <path d="M100 128 C60 132 38 178 30 226 L170 226 C162 178 140 132 100 128Z" fill="url(#cloak)"/>
  <path d="M100 140 L86 226 M100 140 L114 226" stroke="#e8f6ff" stroke-width="3" opacity=".7"/>
  <g transform="translate(100 190)" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".9">
    <path d="M0 -12V12M-10 -6L10 6M-10 6L10 -6"/>
  </g>
  <!-- buns -->
  <circle cx="48" cy="52" r="24" fill="url(#hair)"/>
  <circle cx="152" cy="52" r="24" fill="url(#hair)"/>
  <!-- hair back -->
  <ellipse cx="100" cy="86" rx="62" ry="60" fill="url(#hair)"/>
  <!-- face -->
  <ellipse cx="100" cy="94" rx="48" ry="46" fill="#ffe6d8"/>
  <!-- fringe -->
  <path d="M52 84 C56 50 80 40 100 42 C124 40 146 52 148 84 C136 66 122 60 110 62 C104 70 92 72 84 64 C72 66 60 74 52 84Z" fill="url(#hair)"/>
  <!-- tiara -->
  <g transform="translate(100 40)" stroke="#8fd3ff" stroke-width="3.5" stroke-linecap="round">
    <path d="M0 -14V14M-12 -7L12 7M-12 7L12 -7"/>
    <circle r="3.5" fill="#fff" stroke="none"/>
  </g>
  <!-- eyes -->
  <g class="eyes">
    <ellipse cx="82" cy="96" rx="9" ry="11" fill="#3b3366"/>
    <ellipse cx="118" cy="96" rx="9" ry="11" fill="#3b3366"/>
    <circle cx="85" cy="92" r="3.5" fill="#fff"/><circle cx="121" cy="92" r="3.5" fill="#fff"/>
    <circle cx="79" cy="100" r="1.6" fill="#fff"/><circle cx="115" cy="100" r="1.6" fill="#fff"/>
  </g>
  <!-- cheeks -->
  <ellipse cx="68" cy="112" rx="8" ry="5" fill="#ffb3c4" opacity=".7"/>
  <ellipse cx="132" cy="112" rx="8" ry="5" fill="#ffb3c4" opacity=".7"/>
  <!-- mouth: smile when quiet, open oval while talking -->
  <path class="smile" d="M90 116 Q100 126 110 116" stroke="#c2506b" stroke-width="3.5" fill="none" stroke-linecap="round"/>
  <ellipse class="talk" cx="100" cy="119" rx="7" ry="6" fill="#c2506b"/>
</svg>`;
