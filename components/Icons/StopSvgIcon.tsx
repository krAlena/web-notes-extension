import * as React from "react";

interface SvgIconProps extends React.SVGProps<SVGSVGElement> {}

const StopSvgIcon: React.FC<SvgIconProps> = (props) => (
    <svg {...props} width="800px" height="800px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
        <rect x="1" y="1" width="14" height="14"/>
    </svg>
)
export default StopSvgIcon;