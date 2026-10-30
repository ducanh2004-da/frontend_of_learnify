import "./LandingFooter.scss";

const YEAR = new Date().getFullYear();

export default function LandingFooter() {
  return (
    <footer className="landing-footer">
      <p>&copy; {YEAR} Learnify.</p>
    </footer>
  );
}
