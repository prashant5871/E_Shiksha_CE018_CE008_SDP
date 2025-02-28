import React from 'react'

const Logo = ({h,w,color}) => {
    return (
        <div>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" className={`h-${h} w-${w}`}>
                <path d="M10,60 Q30,20 60,40 Q90,20 110,60" fill="none" stroke="#4F46E5" strokeWidth="6" />
                <path d="M20,55 Q40,30 60,45 Q80,30 100,55" fill="none" stroke="#FACC15" strokeWidth="4" />
                <text x="60" y="75" fontSize="16" fill={color} textAnchor="middle" fontWeight="bold" fontFamily="Poppins, sans-serif">
                    eShiksha
                </text>
            </svg>
        </div>
    )
}

export default Logo
