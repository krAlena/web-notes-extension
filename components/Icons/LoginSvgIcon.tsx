

import * as React from "react";

interface SvgIconProps extends React.SVGProps<SVGSVGElement> {}

const LoginSvgIcon: React.FC<SvgIconProps> = (props) => (
  <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.5 8.25V6.375C7.5 5.87772 7.72388 5.40081 8.1224 5.04917C8.52091 4.69754 9.06141 4.5 9.625 4.5H18.125C18.6886 4.5 19.2291 4.69754 19.6276 5.04917C20.0261 5.40081 20.25 5.87772 20.25 6.375V17.625C20.25 18.1223 20.0261 18.5992 19.6276 18.9508C19.2291 19.3025 18.6886 19.5 18.125 19.5H10.05C8.87647 19.5 7.5 18.6605 7.5 17.625V15.75" stroke="black" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M13.5 15.75L17.25 12L13.5 8.25" stroke="black" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3.75 12H16.5" stroke="black" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default LoginSvgIcon;