import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

export default function MagneticButton({ children, onClick, className = "", type = "button", disabled = false, ...props }) {
    const buttonRef = useRef(null);

    useGSAP(() => {
        const button = buttonRef.current;
        if (!button || disabled) return;

        const xTo = gsap.quickTo(button, "x", { duration: 1, ease: "elastic.out(1, 0.3)" });
        const yTo = gsap.quickTo(button, "y", { duration: 1, ease: "elastic.out(1, 0.3)" });

        const handleMouseMove = (e) => {
            const { clientX, clientY } = e;
            const { left, top, width, height } = button.getBoundingClientRect();
            const x = clientX - (left + width / 2);
            const y = clientY - (top + height / 2);

            // Magnetic pull area
            xTo(x * 0.3);
            yTo(y * 0.3);
        };

        const handleMouseLeave = () => {
            xTo(0);
            yTo(0);
        };

        button.addEventListener("mousemove", handleMouseMove);
        button.addEventListener("mouseleave", handleMouseLeave);
        return () => {
            button.removeEventListener("mousemove", handleMouseMove);
            button.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, { scope: buttonRef, dependencies: [disabled] });

    return (
        <button
            ref={buttonRef}
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`relative inline-block ${className} ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
            {...props}
        >
            {children}
        </button>
    );
}
