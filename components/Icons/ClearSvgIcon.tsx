import * as React from "react";

interface SvgIconProps extends React.SVGProps<SVGSVGElement> {
  title?: string;
}

const ClearSvgIcon: React.FC<SvgIconProps> = ({ title, ...props }) => (
  <svg
    {...props}
    viewBox="0 0 32 32"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.4}
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
  >
    {title ? <title>{title}</title> : null}
    <line x1="5" y1="29" x2="27" y2="29" />
    <line x1="12" y1="10" x2="22" y2="20" />
    <path d="M9.9,25H17l10.1-10.1c1.6-1.6,1.6-4.1,0-5.7l-4.3-4.3c-1.6-1.6-4.1-1.6-5.7,0L6.3,15.7c-1.6,1.6-1.6,4.1,0,5.7L9.9,25z" />
  </svg>
);

export default ClearSvgIcon;