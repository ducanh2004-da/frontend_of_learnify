import { useState, useRef, useEffect } from "react";
import { Image } from "@unpic/react";
import classnames from "classnames";
import "./style.scss";

type TOptimizeImageProps = {
  src: string;
  alt: string;
  folder?: string;
  className?: string;
  priority?: boolean;
};

const OptimizeImage = ({
  src,
  alt,
  folder,
  className,
  priority = false,
}: TOptimizeImageProps) => {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [currentSrc, setCurrentSrc] = useState<string>(src);
  const imgRef = useRef<HTMLImageElement>(null);

  if (src !== currentSrc) {
    setCurrentSrc(src);
    setIsLoaded(false);
  }

  useEffect(() => {
    if (imgRef.current?.complete && !isLoaded) {
      const timer = setTimeout(() => setIsLoaded(true), 0);
      return () => clearTimeout(timer);
    }
  }, [currentSrc, isLoaded]);

  const renderContent = () => {
    if (!src) {
      return (
        <div className="optimize-image-empty">
          <span className="optimize-image-empty-text">No image available</span>
        </div>
      );
    }

    const isExternal =
      src.startsWith("http") || src.startsWith("/") || src.startsWith("data:");
    const imageKitURL = isExternal
      ? src
      : `https://ik.imagekit.io/q4phit8d9e/${folder ? `${folder}/` : ""}${src}.png`;

    return (
      <>
        {!isLoaded && <div className="optimize-image-skeleton" />}
        <Image
          ref={imgRef}
          src={imageKitURL}
          layout="fullWidth"
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          decoding={priority ? "sync" : "async"}
          fetchpriority={priority ? "high" : undefined}
          onLoad={() => setIsLoaded(true)}
          className={classnames(
            "optimize-image-element",
            isLoaded ? "optimize-image-loaded" : "optimize-image-loading",
            className
          )}
        />
      </>
    );
  };

  return <div className="optimize-image-container">{renderContent()}</div>;
};

export default OptimizeImage;
