import type { TAboutStatProps } from "@learner/about/-types/about";
import "./style.scss";

const AboutStat = (props: TAboutStatProps) => {
  const { label, value, color, index } = props;

  return (
    <div className={`about-stat ${label}`} style={{ backgroundColor: color }}>
      <p className="regular about-stat-index">
        /{index < 10 ? `0${index}` : index}
      </p>
      <div className="about-stat-context">
        <h3 className="about-stat-total semibold">{value}</h3>
        <p className="about-stat-type">{label}</p>
      </div>
    </div>
  );
};
export default AboutStat;
