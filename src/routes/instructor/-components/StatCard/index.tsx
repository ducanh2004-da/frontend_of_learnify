import Icon, { type TIconName } from "@/components/Icon";
import "./style.scss";

type TStatCardProps = {
  icon: TIconName;
  label: string;
  value: number;
  accent: string;
};

const StatCard = ({ icon, label, value, accent }: TStatCardProps) => (
  <div
    className="stat-card"
    style={{ "--stat-accent": accent } as React.CSSProperties}
  >
    <div className="stat-card__icon-wrapper">
      <Icon name={icon} size={24} />
    </div>
    <div className="stat-card__info">
      <span className="stat-card__value">{value}</span>
      <span className="stat-card__label">{label}</span>
    </div>
  </div>
);

export default StatCard;
