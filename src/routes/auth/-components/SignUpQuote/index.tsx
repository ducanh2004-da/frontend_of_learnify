import formatQuote from "@/assets/images/format-quote.svg";
import slideDots from "@/assets/images/slide-dots.svg";
import "./style.scss";

const SignUpQuote = () => {
  return (
    <div className="sign-up-right">
      <div className="sign-up-quote">
        <img
          className="sign-up-quote-icon"
          src={formatQuote}
          alt=""
          aria-hidden="true"
        />
        <p className="sign-up-quote-text regular">
          Okay this is genius. Crazy it took so long for a tutor like this to
          exist. Learnify is dominating this space.
        </p>
      </div>

      <div className="sign-up-person">
        <div className="sign-up-avatar" />
        <div className="sign-up-person-context">
          <p className="sign-up-person-name bold">Steven He</p>
          <p className="sign-up-person-title regular">
            CEO &amp; Founder @ Beijing Corn
          </p>
        </div>
      </div>

      <div className="sign-up-slide">
        <img src={slideDots} alt="" aria-hidden="true" />
      </div>
    </div>
  );
};

export default SignUpQuote;
