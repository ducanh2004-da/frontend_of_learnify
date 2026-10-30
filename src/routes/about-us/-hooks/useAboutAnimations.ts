import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

export type TAboutSectionRefs = {
  headRef: React.RefObject<HTMLElement | null>;
  heroRef: React.RefObject<HTMLElement | null>;
  directionRef: React.RefObject<HTMLElement | null>;
  statsRef: React.RefObject<HTMLElement | null>;
  visionRef: React.RefObject<HTMLElement | null>;
  teamRef: React.RefObject<HTMLElement | null>;
};

export function useAboutAnimations(): TAboutSectionRefs {
  const headRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const directionRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLElement>(null);
  const visionRef = useRef<HTMLElement>(null);
  const teamRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ".about-us__head-title",
        { opacity: 0, y: 48 },
        { opacity: 1, y: 0, duration: 0.8, ease: "glide" }
      );
      gsap.fromTo(
        ".about-us__head-tagline",
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.6, ease: "glide", delay: 0.2 }
      );
    },
    { scope: headRef }
  );

  useGSAP(
    () => {
      gsap.fromTo(
        ".about-us__story-content > p",
        { opacity: 0, x: -32 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          stagger: 0.15,
          ease: "glide",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top 80%",
          },
        }
      );
      gsap.fromTo(
        ".about-us__story-image",
        { opacity: 0, x: 32 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          ease: "glide",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top 80%",
          },
        }
      );
    },
    { scope: heroRef }
  );

  useGSAP(
    () => {
      gsap.fromTo(
        ".about-us__direction-heading",
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "glide",
          scrollTrigger: {
            trigger: directionRef.current,
            start: "top 85%",
          },
        }
      );
      gsap.fromTo(
        ".about-us__direction-text",
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          delay: 0.15,
          ease: "glide",
          scrollTrigger: {
            trigger: directionRef.current,
            start: "top 85%",
          },
        }
      );
    },
    { scope: directionRef }
  );

  useGSAP(
    () => {
      gsap.fromTo(
        ".about-stat",
        { opacity: 0, y: 32, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: "glide",
          scrollTrigger: {
            trigger: statsRef.current,
            start: "top 85%",
          },
        }
      );
    },
    { scope: statsRef }
  );

  useGSAP(
    () => {
      gsap.fromTo(
        ".about-us__vision-heading",
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "glide",
          scrollTrigger: {
            trigger: visionRef.current,
            start: "top 85%",
          },
        }
      );
      gsap.fromTo(
        ".about-us__vision-text",
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          delay: 0.15,
          ease: "glide",
          scrollTrigger: {
            trigger: visionRef.current,
            start: "top 85%",
          },
        }
      );
    },
    { scope: visionRef }
  );

  useGSAP(
    () => {
      gsap.fromTo(
        ".about-us__team-heading",
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "glide",
          scrollTrigger: {
            trigger: teamRef.current,
            start: "top 85%",
          },
        }
      );
      gsap.fromTo(
        ".about-us__team-subtitle",
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          delay: 0.1,
          ease: "glide",
          scrollTrigger: {
            trigger: teamRef.current,
            start: "top 85%",
          },
        }
      );
      gsap.fromTo(
        ".member-item",
        { opacity: 0, y: 32 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.12,
          ease: "glide",
          scrollTrigger: {
            trigger: teamRef.current,
            start: "top 80%",
          },
        }
      );
    },
    { scope: teamRef }
  );

  return {
    headRef,
    heroRef,
    directionRef,
    statsRef,
    visionRef,
    teamRef,
  };
}
