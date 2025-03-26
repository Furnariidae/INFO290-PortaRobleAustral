import React from 'react';

interface CustomIconProps {
    width?: string; // Propiedad para el ancho
    height?: string; // Propiedad para la altura
}

const CustomIcon: React.FC<CustomIconProps> = ({ width = '28px', height = '28px' }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        viewBox="0 0 48 48"
    >
        <g fill="none" stroke="black" strokeWidth={4}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M24 21v23c-3.291-4-13.371-4-18-4V18c9.874 0 16.114 2 18 3m0 0v23c3.291-4 13.371-4 18-4V18c-9.874 0-16.114 2-18 3" />
            <circle cx={24} cy={12} r={8} />
        </g>
    </svg>
);

export default CustomIcon;
