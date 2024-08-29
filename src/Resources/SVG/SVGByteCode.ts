import {Colors} from '@/Theme'

export default {
  info: (
    color: string = Colors.black
  ) => `<svg width="20" height="20" viewBox="0 0 20 20" fill="${color}" xmlns="http://www.w3.org/2000/svg">
  <path d="M10 20C4.477 20 0 15.523 0 10S4.477 0 10 0s10 4.477 10 10-4.477 10-10 10m0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16m1-9.5V13h1v2H8v-2h1v-2.5H8v-2zm.5-2.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
</svg>
`,

  wifi: (
    color: string = Colors.black
  ) => `<svg width="24" height="18" viewBox="0 0 24 18" fill="${color}" xmlns="http://www.w3.org/2000/svg">
  <path d="M.69 3.997A17.93 17.93 0 0 1 12 0c4.285 0 8.22 1.497 11.31 3.997l-1.256 1.556A15.93 15.93 0 0 0 12 2C8.19 2 4.694 3.33 1.946 5.553zm3.141 3.89A12.95 12.95 0 0 1 12 5a12.95 12.95 0 0 1 8.169 2.886l-1.257 1.556A10.95 10.95 0 0 0 12 7c-2.618 0-5.023.915-6.912 2.442zm3.142 3.89A7.97 7.97 0 0 1 12 10c1.904 0 3.653.665 5.027 1.776l-1.257 1.556A5.98 5.98 0 0 0 12 12c-1.428 0-2.74.499-3.77 1.332zm3.142 3.89A3 3 0 0 1 12 15c.714 0 1.37.25 1.885.666L12 18z" />
</svg>
`,

  setting: (
    color: string = Colors.black
  ) => `<svg width="22" height="22" viewBox="0 0 22 22" fill="${color}" xmlns="http://www.w3.org/2000/svg">
  <path d="M7.686 3 10.293.393a1 1 0 0 1 1.414 0L14.314 3H18a1 1 0 0 1 1 1v3.686l2.607 2.607a1 1 0 0 1 0 1.414L19 14.314V18a1 1 0 0 1-1 1h-3.686l-2.607 2.607a1 1 0 0 1-1.414 0L7.686 19H4a1 1 0 0 1-1-1v-3.686L.393 11.707a1 1 0 0 1 0-1.414L3 7.686V4a1 1 0 0 1 1-1zM5 5v3.515L2.515 11 5 13.485V17h3.515L11 19.485 13.485 17H17v-3.515L19.485 11 17 8.515V5h-3.515L11 2.515 8.515 5zm6 10a4 4 0 1 1 0-8 4 4 0 0 1 0 8m0-2a2 2 0 1 0 0-4 2 2 0 0 0 0 4" />
</svg>
`,

  tnc: (
    color: string = Colors.black
  ) => `<svg width="18" height="20" viewBox="0 0 18 20" fill="${color}" xmlns="http://www.w3.org/2000/svg">
  <path d="M18 6v12.993A1 1 0 0 1 17.007 20H.993A.993.993 0 0 1 0 19.008V.992C0 .455.449 0 1.002 0h10.995zm-2 1h-5V2H2v16h14zM5 5h3v2H5zm0 4h8v2H5zm0 4h8v2H5z"/>
</svg>
`,
  privacy: (
    color: string = Colors.black
  ) => `<svg width="18" height="20" viewBox="0 0 18 20" fill="${color}" xmlns="http://www.w3.org/2000/svg">
  <path d="M17 20H1a1 1 0 0 1-1-1V1a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1m-1-2V2H2v16zM5 5h8v2H5zm0 4h8v2H5zm0 4h8v2H5z"/>
</svg>

`,

  wifiLock: (
    color: string = Colors.black
  ) => `<svg width="24" height="24" viewBox="0 0 24 24" fill="${color}" xmlns="http://www.w3.org/2000/svg"><path d="M1 6.997A17.93 17.93 0 0 1 12.31 3c4.285 0 8.22 1.497 11.31 3.997l-1.256 1.556A15.93 15.93 0 0 0 12.31 5C8.502 5 5.004 6.33 2.257 8.553zm3.142 3.89A12.95 12.95 0 0 1 12.31 8a12.95 12.95 0 0 1 8.17 2.886l-1.258 1.556A10.95 10.95 0 0 0 12.31 10c-2.618 0-5.023.915-6.911 2.442zm3.142 3.89A7.97 7.97 0 0 1 12.31 13c1.905 0 2.816-.111 4.19 1l-.799 2.332C14.671 15.5 13.74 15 12.311 15s-2.74.499-3.77 1.332zm3.141 3.89A3 3 0 0 1 12.31 18c.714 0 1.37.25 1.885.666L12.31 21z" /><path d="M18.5 11a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11m0 1.998a1.75 1.75 0 0 0-1.744 1.607l-.006.143v.781c-.395.102-.696.44-.743.854l-.007.115v2.5a1 1 0 0 0 .883.993l.117.007h3a1 1 0 0 0 .993-.883l.007-.117v-2.5a1 1 0 0 0-.644-.935l-.105-.033-.001-.782a1.75 1.75 0 0 0-1.75-1.75m0 1a.75.75 0 0 1 .743.648l.007.102v.75h-1.5v-.75a.75.75 0 0 1 .75-.75"/></svg>
`,

  sleep: (
    color: string = Colors.subTextColor
  ) => `<svg width="18" height="20" viewBox="0 0 18 20" fill="${color}" xmlns="http://www.w3.org/2000/svg">
  <path d="M8 4v2a6 6 0 1 0 5.996 6.225L14 12h2a8 8 0 1 1-16 0c0-4.335 3.58-8 8-8m10-4v2l-5.327 6H18v2h-8V8l5.326-6H10V0z" />
</svg>
`,

  screen: (
    color: string = Colors.subTextColor
  ) => `<svg width="20" height="19" viewBox="0 0 20 19" fill="${color}" xmlns="http://www.w3.org/2000/svg">
  <path d="M0 1c0-.552.455-1 .992-1h18.016c.548 0 .992.445.992 1v14c0 .552-.455 1-.992 1H.992A.994.994 0 0 1 0 15zm2 1v12h16V2zm1 15h14v2H3z" />
</svg>
`,
  clock: (
    color: string = Colors.subTextColor
  ) => `<svg width="20" height="20" viewBox="0 0 20 20" fill="${color}" xmlns="http://www.w3.org/2000/svg">
  <path d="M10 20C4.477 20 0 15.523 0 10S4.477 0 10 0s10 4.477 10 10-4.477 10-10 10m0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16m1-8h4v2H9V5h2z" />
</svg>
`,
  arrowsUpDown: (
    color: string = Colors.borderColor
  ) => `<svg width="13" height="26" viewBox="0 0 13 26" fill="${color}" xmlns="http://www.w3.org/2000/svg">
  <path d="M6.636 3.05 1.686 8 .272 6.586 6.636.222 13 6.586 11.585 8zm0 19.9 4.95-4.95L13 19.414l-6.364 6.364-6.364-6.364L1.686 18z"/>
</svg>
`,

  settingToolbar: (
    color: string = Colors.black
  ) => `<svg width="33" height="38" viewBox="0 0 33 38" fill="${color}" xmlns="http://www.w3.org/2000/svg">
  <path d="m16.5.667 15.834 9.167v18.333L16.5 37.334.667 28.167V9.834zm0 3.852L4 11.755v14.49l12.5 7.237L29 26.245v-14.49zm0 21.148a6.667 6.667 0 1 1 0-13.333 6.667 6.667 0 0 1 0 13.333m0-3.333a3.333 3.333 0 1 0 0-6.667 3.333 3.333 0 0 0 0 6.667" />
</svg>
`,
  gallery: (
    color: string = Colors.black
  ) => `<svg width="31" height="30" viewBox="0 0 31 30" fill="${color}" xmlns="http://www.w3.org/2000/svg"><path d="m3.833 13.5 3.334-3.332 9.166 9.166 5.834-5.833 5 5V3.333H3.833zm0 4.715v8.452h5.168l4.975-4.976-6.81-6.81zm9.882 8.452h13.452v-3.452l-5-5zM2.167 0h26.666c.92 0 1.667.746 1.667 1.667v26.666c0 .92-.746 1.667-1.667 1.667H2.167C1.247 30 .5 29.254.5 28.333V1.667C.5.747 1.246 0 2.167 0m19.166 11.667a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5" /></svg>
`,
  addFriend: (
    color: string = Colors.black
  ) => `<svg width="33" height="36" viewBox="0 0 33 36" fill="${color}" xmlns="http://www.w3.org/2000/svg">
  <path d="M17.334 22.754v3.482A10 10 0 0 0 14 25.667c-5.523 0-10 4.477-10 10H.667c0-7.364 5.97-13.333 13.333-13.333 1.151 0 2.268.146 3.334.42M14 20.667c-5.525 0-10-4.475-10-10s4.475-10 10-10 10 4.475 10 10-4.475 10-10 10m0-3.333a6.665 6.665 0 0 0 6.667-6.667A6.665 6.665 0 0 0 14 4a6.665 6.665 0 0 0-6.666 6.667A6.665 6.665 0 0 0 14 17.334m10 10v-5h3.334v5h5v3.333h-5v5H24v-5h-5v-3.333z"/>
</svg>
`
}
