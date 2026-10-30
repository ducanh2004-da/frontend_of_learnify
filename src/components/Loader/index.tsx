import { useEffect, useState } from "react";
import LogoLoader from "./components/LogoLoader";
import ScreenLoader from "./components/ScreenLoader";
import "./style.scss";

type TLoaderProps = {
  disabled?: boolean;
  onPhase1Complete?: () => void;
  ready?: boolean;
  onPhase2Complete?: () => void;
};

const Loader = (props: TLoaderProps) => {
  const { disabled = false, onPhase1Complete, ready, onPhase2Complete } = props;
  const [logoReady, setLogoReady] = useState(false);

  useEffect(() => {
    if (!ready) return;
    // Match bar-1's 0.5s stagger so logo fade ends when last bar does
    const timer = setTimeout(() => setLogoReady(true), 300);
    return () => clearTimeout(timer);
  }, [ready]);

  if (disabled) return null;

  return (
    <section className="loader-container" data-lenis-prevent>
      <ScreenLoader
        onPhase1Complete={onPhase1Complete}
        ready={ready}
        onPhase2Complete={onPhase2Complete}
      />
      <LogoLoader ready={logoReady} />
    </section>
  );
};

export default Loader;
