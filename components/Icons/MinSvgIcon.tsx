
import * as React from "react";

interface SvgIconProps extends React.SVGProps<SVGSVGElement> {}

const MinSvgIcon: React.FC<SvgIconProps> = (props) => (
  <svg {...props} width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 80C18.8667 80 17.9167 79.6167 17.15 78.85C16.3833 78.0833 16 77.1333 16 76C16 74.8667 16.3833 73.9167 17.15 73.15C17.9167 72.3833 18.8667 72 20 72H76C77.1333 72 78.0833 72.3833 78.85 73.15C79.6167 73.9167 80 74.8667 80 76C80 77.1333 79.6167 78.0833 78.85 78.85C78.0833 79.6167 77.1333 80 76 80H20Z" fill="#232323"/>
  </svg>
);

export default MinSvgIcon;