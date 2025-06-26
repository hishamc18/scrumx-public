"use client";
import Features from "@/components/LandingPage/Features";
import InfiniteScroller from "@/components/LandingPage/InfiniteSlider";
import Footer from "@/components/Footer";
import GetStart from "@/components/LandingPage/GetStart";
import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
    useEffect(() => {
        const cursorDot = document.querySelector("[data-cursor-dot]") as HTMLElement;
        const cursorOutline = document.querySelector("[data-cursor-outline]") as HTMLElement;
        const contentArea = document.querySelector(".content2") as HTMLElement;
    
        const moveCursor = (e: MouseEvent) => {
            const posX = e.clientX;
            const posY = e.clientY;
    
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;
    
            cursorOutline.animate(
                { left: `${posX}px`, top: `${posY}px` },
                { duration: 500, fill: "forwards" }
            );
        };
    
        const mouseDownHandler = (e: MouseEvent) => {
            if (e.buttons === 1) {
                cursorOutline?.animate(
                    { transform: ["translate(-50%, -50%) scale(2)"] },
                    { duration: 300, fill: "forwards", easing: "ease-out" }
                );
            }
        };
    
        const mouseUpHandler = () => {
            cursorOutline?.animate(
                { transform: ["translate(-50%, -50%) scale(1)"] },
                { duration: 300, fill: "forwards", easing: "ease-out" }
            );
        };
    
        const showCursor = () => {
            cursorDot.style.display = "block";
            cursorOutline.style.display = "block";
        };
    
        const hideCursor = () => {
            cursorDot.style.display = "none";
            cursorOutline.style.display = "none";
        };
        const handleScroll = () => {
            cursorOutline?.animate(
                { width: "30px", height: "80px", borderRadius: "50px" },
                { duration: 300, fill: "forwards", easing: "ease-out" }
            );
        };
        const handleScrollend = () => {
            cursorOutline?.animate(
                { width: "30px", height: "30px", borderRadius: "50%" },
                { duration: 300, fill: "forwards", easing: "ease-out" }
            );
        };
    
        // Show/hide cursor on specific area
        contentArea?.addEventListener("mouseenter", showCursor);
        contentArea?.addEventListener("mouseleave", hideCursor);
    
        window.addEventListener("mousemove", moveCursor);
        window.addEventListener("mousedown", mouseDownHandler);
        window.addEventListener("mouseup", mouseUpHandler);
        window.addEventListener("scroll", handleScroll);
        window.addEventListener("scrollend", handleScrollend);
    
        return () => {
            contentArea?.removeEventListener("mouseenter", showCursor);
            contentArea?.removeEventListener("mouseleave", hideCursor);
            window.removeEventListener("mousemove", moveCursor);
            window.removeEventListener("mousedown", mouseDownHandler);
            window.removeEventListener("mouseup", mouseUpHandler);
        };
    }, []);

    useEffect(() => {
        gsap.set(".footer", { yPercent: -50 });

        const tl = gsap.timeline({ paused: true });
        tl.to(".footer", { yPercent: 0, ease: "none" });

        ScrollTrigger.create({
            trigger: ".content2",
            // markers: true,
            start: "bottom bottom",
            end: "+=50%",
            animation: tl,
            scrub: true,
        });
    }, []);
    return (
        <div className="bg-white  ">
            <div className="content2 cursor-none ">
                <GetStart />
                <InfiniteScroller />
                <Features />
                <div className="w-[5px] h-[5px] bg-black rounded-full z-40 fixed pointer-events-none transform -translate-x-1/2 -translate-y-1/2" data-cursor-dot></div>
            <div className="w-[30px] h-[30px] bg-primaryDark rounded-full z-40 fixed pointer-events-none transform -translate-x-1/2 -translate-y-1/2" data-cursor-outline></div>

            </div>
            <footer className="footer   z-[-1] h-[48vh] w-full bg-primaryDark flex flex-col justify-around absolute overflow-hidden">
               
                <Footer></Footer>
            </footer>
            
        </div>
    );
}
