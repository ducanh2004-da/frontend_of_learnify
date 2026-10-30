import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import SpinnerLoader from "./SpinnerLoader";

type TLogoLoaderProps = {
  ready?: boolean;
};

const LogoLoader = (props: TLogoLoaderProps) => {
  const { ready } = props;
  const logoDivRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!ready) return;
      gsap.to(logoDivRef.current, {
        opacity: 0,
        duration: 0.8,
        ease: "hop",
        onComplete: () => {
          gsap.set(logoDivRef.current, { visibility: "hidden" });
        },
      });
    },
    { scope: logoDivRef, dependencies: [ready] }
  );

  return (
    <div className="logo" ref={logoDivRef}>
      <h2 className="black">
        {Array.from("Learnify").map((char, i) => (
          <span
            key={i}
            className="char"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            {char}
          </span>
        ))}
      </h2>
      <SpinnerLoader />
    </div>
  );
};

export default LogoLoader;
