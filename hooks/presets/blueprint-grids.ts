import { H, W, pace, scene } from './svg'
import type { Preset } from './types'

const FINE = 16
const BOLD = 80

// A pavilion in plan (above) and elevation (below), drawn 1344 by 752 and laid
// over the grid a little larger, centred. Line weights and strengths are the drawing's own.
const PLACE = 'translate(-40 30) scale(1.25)'
const DRAWING =
  '<g opacity=".26" stroke-width=".85"><circle cx="359" cy="296" r="190"/><circle cx="965" cy="216" r="198"/><circle cx="325" cy="249" r="61" stroke-dasharray="6 7"/><path d="M672 46V499 M499 274H839" stroke-dasharray="13 5 2 5"/><path d="M435 111A191 191 0 0 1 548 248 M774 294A188 188 0 0 0 959 444 M500 365V412 M540 360V441 M802 374V441 M248 600V686 M1084 609V688 M147 681H1154 M264 694V720 M1084 694V720"/></g><g stroke-width="1.35" opacity=".95"><path d="M236 242C239 167 299 105 385 99C472 91 505 125 593 147C659 165 702 158 767 151C833 144 865 134 925 149C1003 166 1055 207 1080 261C1104 312 1099 366 1070 403C1041 442 987 462 935 453C865 441 832 405 767 382C697 357 638 357 581 375C526 392 489 420 425 413C340 404 277 368 249 310C240 290 234 266 236 242Z"/><path d="M246 242C249 174 303 116 386 110C465 103 510 138 591 157C660 175 703 169 768 162C835 155 866 145 922 160C995 177 1046 215 1070 266C1092 312 1087 360 1061 396C1034 431 985 449 937 442C872 431 837 395 771 371C699 345 637 346 577 364C520 381 486 410 427 403C347 396 285 361 259 306C249 285 244 263 246 242Z"/><path d="M430 110V285H435V112 M435 116V192H520V131 M435 197H525V133 M430 324V403 M435 326V404 M292 345H430 M299 350H430 M435 345H444V405 M817 156V198H844 M822 156V193H844 M844 153V246C848 266 866 279 891 279H955V328H960V247H1061 M849 153V245C853 264 870 274 893 274H955V242H1059 M955 366V443 M960 366V443"/><path d="M535 392V430H548V388 M796 390V430H809V395"/></g><g stroke-width=".85" opacity=".7"><path d="M430 285A37 37 0 0 0 395 323H430 M435 287A39 39 0 0 0 395 324 M955 328A38 38 0 0 1 993 364H955 M960 363A36 36 0 0 0 993 327 M767 151A42 42 0 0 0 806 195V156"/><circle cx="672" cy="272" r="74"/><path d="M248 56H1084 M248 49V63 M1084 49V63 M525 49V63 M521 62L529 50 M850 49V63 M846 62L854 50 M199 113V430 M191 113H207 M191 430H207 M195 299H203 M1137 113V442 M1129 113H1145 M1129 442H1145 M1133 298H1141"/></g><g stroke-width="1.45" opacity=".97"><path d="M236 601C235 579 300 555 370 541C464 522 562 525 633 533C721 543 804 572 885 584C946 594 984 589 1026 589C1072 588 1105 596 1106 609C1108 617 1098 623 1081 628 M236 601C248 582 311 562 373 551C463 535 557 537 631 545C718 555 800 583 883 596C948 606 988 600 1029 601C1068 600 1098 606 1106 614 M236 601C234 610 244 617 264 623"/><path d="M264 679V605C273 592 347 578 395 581C448 582 445 598 489 600C559 604 591 578 668 579C754 578 792 600 857 613C891 620 918 621 949 615 M268 679V607C285 593 350 580 395 584C443 585 446 602 489 603C560 607 592 581 669 582C752 581 795 604 856 616C891 623 919 624 949 618" stroke-width=".8" opacity=".7"/><path d="M949 679V613C969 603 1056 601 1081 614V679 M953 679V616C978 606 1055 606 1077 616V679" stroke-width=".85" opacity=".8"/><rect x="535" y="550" width="12" height="130"/><path d="M796 680V585L809 589V680Z M263 680H1083 M184 681H1150"/></g><g stroke-width=".7" opacity=".55"><path d="M279 600V680 M312 590V680 M367 582V680 M425 587V680 M430 589V680 M482 603V680 M488 603V680 M609 585V680 M672 582V680 M736 588V680 M863 618V680 M912 623V680 M975 611V680 M1039 610V680 M1048 611V680"/></g><g stroke-width=".9" opacity=".88"><path d="M184 550V681 M176 550H192 M176 681H192 M181 615H187 M263 711H1084 M263 704V719 M1084 704V719 M540 704V719 M802 704V719"/></g>'

export const blueprintGrids: Preset = {
  id: 'blueprint-grids',
  name: 'Blueprint grids',
  kind: 'svg',
  roles: { accent: '#2f67c8', danger: '#c2413a', success: '#2f8a6a', warning: '#b5771a', pro: '#6a5cc8' },
  light: {
    'surface-0': '#dfe8f4',
    'surface-1': '#e8eff8',
    'surface-2': '#f3f7fc',
    'text-primary': '#14233d',
    'text-secondary': '#3a4a66',
    'text-muted': '#52627d',
  },
  dark: {
    'surface-0': '#0d1f44',
    'surface-1': '#12284f',
    'surface-2': '#18305b',
    'surface-3': '#1e3866',
    'text-primary': '#eaf1ff',
    'text-secondary': '#c1cfee',
    'text-muted': '#9dafd6',
  },
  minOpacity: 0.6,
  svg: motion => {
    let fine = ''

    for (let at = FINE; at < BOLD; at += FINE) {
      fine += `M${at} 0V${BOLD}M0 ${at}H${BOLD}`
    }

    return scene({
      motion,
      defs:
        `<pattern id="grid" width="${BOLD}" height="${BOLD}" patternUnits="userSpaceOnUse">` +
        `<path class="line" d="${fine}" fill="none" stroke="#3f6fb5" stroke-width="1" opacity="0.28"/>` +
        `<path class="line" d="M0 0H${BOLD}M0 0V${BOLD}" fill="none" stroke="#3f6fb5" stroke-width="2" opacity="0.55"/>` +
        '</pattern>' +
        '<radialGradient id="glow" cx="0.5" cy="0.4" r="0.8"><stop offset="0" stop-color="#ffffff" stop-opacity="0.16"/>' +
        '<stop offset="1" stop-color="#ffffff" stop-opacity="0"/></radialGradient>',
      style:
        '.ground{fill:#dce8f6}.draw{fill:none;stroke:#2c5aa0;stroke-linecap:round;stroke-linejoin:round}' +
        '@media (prefers-color-scheme: dark){.ground{fill:#0f3470}.line{stroke:#cfe0ff}.draw{stroke:#e2f3ff}}',
      // The sheet drifts a little and comes back, grid and drawing together.
      animation:
        `@keyframes pan{to{transform:translate(${motion === 'lively' ? 56 : 32}px,${motion === 'lively' ? 34 : 20}px)}}` +
        `.sheet{animation:pan ${pace(motion, 80, 40)}s ease-in-out infinite alternate}`,
      body:
        `<rect class="ground" width="${W}" height="${H}" fill="#dce8f6"/>` +
        `<g class="sheet"><rect x="${-BOLD}" y="${-BOLD}" width="${W + BOLD}" height="${H + BOLD}" fill="url(#grid)"/>` +
        `<g class="draw" transform="${PLACE}">${DRAWING}</g></g>` +
        `<rect width="${W}" height="${H}" fill="url(#glow)"/>`,
    })
  },
}
