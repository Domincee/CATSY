import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import styles from './CatsyLogo.module.css';

const CatsyLogo = ({ shouldStart = true, onAnimationComplete }) => {
    const containerRef = useRef(null);
    const svgRef = useRef(null);
    const hasAnimated = useRef(false);

    useLayoutEffect(() => {
        if (!shouldStart) return;
        if (hasAnimated.current) return; // Prevent double animation on re-renders

        hasAnimated.current = true;

        let ctx = gsap.context(() => {
            const tl = gsap.timeline({
                defaults: { ease: "back.out(1.7)", duration: 0.6 }
            });


            // 1. INITIAL STATE GUARDRAIL
            // Ensure eyes start clean before any animation
            gsap.set(["#eye-right", "#eye-left"], {
                clearProps: "scale",
                scale: 1,
                transformOrigin: "center center"
            });

            // 2. MAIN INITIALIZATION
            gsap.set(["#eye-left", "#eye-right", "#nose-mouth", "#whiskers path", "#top-head", "#chin"], {
                opacity: 0,
                scale: 0,
                transformOrigin: "center center"
            });

            tl.fromTo("#circle",
                { strokeDasharray: 500, strokeDashoffset: 500 },
                { strokeDashoffset: 0, duration: 1.2, ease: "power2.inOut" }
            )
                .addLabel("midpoint", 0.6)

                .to("#top-head", {
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    startAt: { y: -20 },
                }, "midpoint")
                .to("#chin", {
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    startAt: { y: 20 }, // Slide up from +20px
                }, "midpoint")

                // EYES AWAKENING
                .to("#eye-left", {
                    opacity: 1,
                    scale: 1,
                }, "+=0.1")
                .to("#eye-right", {
                    opacity: 1,
                    scale: 1,
                }, "-=0.4")

                .fromTo("#whiskers path",
                    {
                        scaleX: 0,
                        rotate: (i) => i % 2 === 0 ? -1 : 10, // Starts slightly angled
                        opacity: 0
                    },
                    {
                        scaleX: 1,
                        rotate: 0,
                        opacity: 1,
                        stagger: 0.08,
                        duration: 0.8,
                        ease: "elastic.out(1, 0.5)"
                    },
                    "-=0.3"
                )

                // FINAL DETAILS
                .to(["#nose-mouth", "#whiskers path"], {
                    opacity: 1,
                    scale: 1,
                    stagger: 0.05,
                    onComplete: () => {
                        if (onAnimationComplete) {
                            onAnimationComplete();
                        }
                    }
                }, "-=0.2")

            // Target the containers for movement (Eyes) - keeping refs for clarity
            // We no longer use quickSetter - using gsap.to for "lazy" effect

            // 3D TILT: Setup perspective on SVG
            gsap.set(svgRef.current, {
                transformPerspective: 1000,
                transformOrigin: "center center",
                transformStyle: "preserve-3d"
            });

            const triggerWink = () => {
                gsap.to("#eye-right", {
                    scaleY: 0.1,
                    duration: 0.1,
                    yoyo: true,
                    repeat: 1,
                    transformOrigin: "center center",
                    force3D: true,
                    ease: "power2.inOut",
                    overwrite: "auto",
                    onComplete: () => {
                        gsap.delayedCall(gsap.utils.random(3, 7), triggerWink);
                    }
                });
            };

            // Blink on tap for personality
            const triggerBlink = () => {
                gsap.to(["#eye-right", "#eye-left"], {
                    scaleY: 0.1,
                    duration: 0.08,
                    yoyo: true,
                    repeat: 1,
                    transformOrigin: "center center",
                    ease: "power2.inOut",
                    overwrite: "auto"
                });
            };

            const handleClick = () => {
                triggerBlink();
            };

            const handleMouseMove = (e) => {
                if (!svgRef.current) return;
                const rect = svgRef.current.getBoundingClientRect();
                const relX = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
                const relY = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);

                // 1. Head Tilt (Subtle & Slightly faster than eyes)
                gsap.to(svgRef.current, {
                    rotateY: gsap.utils.clamp(-6, 6, relX * 8),
                    rotateX: gsap.utils.clamp(-6, 6, -relY * 8),
                    duration: 0.6,
                    ease: "power2.out",
                    overwrite: "auto"
                });

                // 2. The "Catch-Up" Eyes - they take time to follow
                gsap.to(["#eye-right-container", "#eye-left-container"], {
                    x: gsap.utils.clamp(-10, 10, relX * 15),
                    y: gsap.utils.clamp(-10, 10, relY * 15),
                    duration: 1.2,
                    ease: "elastic.out(1, 0.75)",
                    overwrite: "auto"
                });
            };

            // Mobile touch handling
            const handleTouch = (e) => {
                if (!svgRef.current) return;
                const touch = e.touches[0];
                const rect = svgRef.current.getBoundingClientRect();
                const relX = (touch.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
                const relY = (touch.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);

                // Force scale back to 1 to prevent shrinking
                gsap.to(["#eye-right-container", "#eye-left-container"], {
                    x: gsap.utils.clamp(-12, 12, relX * 18),
                    y: gsap.utils.clamp(-12, 12, relY * 18),
                    scale: 1, // Explicitly reset scale to prevent "shrunk" state
                    duration: 0.8,
                    ease: "back.out(1.2)", // Adds a slight "bounce" to the catch-up
                    overwrite: "auto",
                    transformOrigin: "center center"
                });

                // Removed triggerBlink() to prevent rapid-fire blinking during scroll
            };

            tl.add(() => {
                triggerWink(); // START THE WINKING
                window.addEventListener("mousemove", handleMouseMove);
                window.addEventListener("touchmove", handleTouch);
                // click listener for tap interaction
                containerRef.current.addEventListener("click", handleClick);

                gsap.to("#whiskers path", {
                    rotate: "random(-4, 4)",
                    duration: 2,
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut",
                    stagger: { each: 0.5, from: "center" }
                });
            });

            // Aroma Steam Evaporation Loop

            return () => {
                window.removeEventListener("mousemove", handleMouseMove);
                window.removeEventListener("touchmove", handleTouch);
                if (containerRef.current) {
                    containerRef.current.removeEventListener("click", handleClick);
                }
            };

        }, containerRef);

        return () => ctx.revert();
    }, [shouldStart, onAnimationComplete]);
    return (
        <div ref={containerRef} className={styles.logoWrapper}>
            <svg
                ref={svgRef}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 155 155"
                className={styles.svgContainer}
                style={{ fill: 'none' }} /* Force a global fill reset */
            >


                <g id="Group_5">
                    {/* All paths below MUST have fill="none" explicitly */}

                    <circle id="circle" cx="77.5" cy="77.5" r="76.5" stroke="#000" strokeWidth="2" fill="none" />


                    <g id="top-head" stroke="#000" strokeLinecap="round" strokeWidth="4" fill="none">
                        {/* Uniform Shift +5.8 from Original to center Nose */}
                        {/* Original Right Ear m102.5 -> 108.3 */}
                        <path id="ear-right" d="m108.3 57-3.972-9.433a1 1 0 0 1-.046-.137L101.36 36.163c-.217-.837-1.321-1.023-1.8-.304L92.8 46l-6 7.5" />
                        {/* Original Head m59.75 -> 65.55 */}
                        <path id="head" d="m65.55 51.2 5.75-.7h4.11a18 18 0 0 1 8.287 2.02L86.55 54" />
                        {/* Original Left Ear m34 -> 39.8 */}
                        <path id="ear-left" d="m39.8 58.5 8.955-13.93q.045-.07.078-.147l3.74-8.726a1 1 0 0 1 1.751-.161L59.3 43l6 7" />
                    </g>
                    {/* Original Chin m39 -> 44.8 */}
                    <path id="chin" fill="none" stroke="#000" strokeLinecap="round" strokeWidth="4" d="m44.8 104 .99.989a41.8 41.8 0 0 0 20.35 11.217l2.873.649a51.4 51.4 0 0 0 29.369-2.011l8.918-3.344" />
                    <g id="whiskers" fill="none" stroke="#000" strokeLinecap="round" strokeWidth="4">
                        {/* Original Left: M 42 -> 47.8 */}
                        <path id="whisker-left-bottom" d="M 47.8 87.5 Q 38.8 89, 30.3 90.5" />
                        <path id="whisker-left-top" d="M 47.8 77.5 Q 35.8 75, 23.8 73" />

                        {/* Original Right: M 111 -> 116.8 */}
                        <path id="whisker-right-bottom" d="M 116.8 89 Q 125.8 91, 136.3 92.5" />
                        <path id="whisker-right-top" d="M 116.8 80.5 Q 128.8 79, 141.8 76.5" />
                    </g>
                    {/* ONLY the eyes get the fill */}
                    <g id="eyes" fill="#000">
                        {/* Right Eye: 88.5 + 5.8 = 94.3 */}
                        <g id="eye-right-container">
                            <circle id="eye-right" cx="94.3" cy="75.5" r="4.5" stroke="none" />
                        </g>

                        {/* Left Eye: 61.5 + 5.8 = 67.3 */}
                        <g id="eye-left-container">
                            <circle id="eye-left" cx="67.3" cy="73.5" r="4.5" stroke="none" />
                        </g>
                    </g>
                    <g id="nose-mouth" fill="none" stroke="#000" strokeLinecap="round">
                        {/* Nose: 71.9 + 5.8 = 77.7 */}
                        <path id="nose" strokeWidth="9" d="M77.7 88.3h-.4" />
                        {/* Mouth: 65 + 5.8 = 70.8 */}
                        <path id="mouth" strokeWidth="4" d="M70.8 98.5s3.055 1.11 5 .5c2.77-.868 2-7.5 2-7.5s.5 4 1 6 1.71 2.426 2.5 3c1.58 1.148 5-.5 5-.5" />
                    </g>

                </g>
            </svg>
        </div>
    );
};

export default CatsyLogo;
