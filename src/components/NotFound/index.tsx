import { Link } from "@tanstack/react-router";
import { OptimizeImage } from "@/components/Images";
import "./style.scss";

function NotFound() {
  return (
    <div className="not-found">
      <OptimizeImage
        src="/404-light.webp"
        alt="404 Not Found"
        className="cover-image"
      />
      <h4>This page cannot be found</h4>
      <p>
        Try a different link or return to the{" "}
        <Link className="link" to="/">
          homepage
        </Link>
      </p>
    </div>
  );
}

export default NotFound;
