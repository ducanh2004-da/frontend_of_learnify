import type { TSpecial } from "@/types/global";
import "../style.scss";
import { COLORS } from "@/styles/colors";

type TDecorationCardContextProps = {
  listBadge: React.ReactNode;
  typeSpecial: TSpecial;
  listFeature: string[];
  title: string;
  shape: React.ReactNode;
};

const DecorationCardContext = (props: TDecorationCardContextProps) => {
  const { listBadge, listFeature, title, shape, typeSpecial } = props;

  return (
    <div className="decoration-card-context">
      <div className="information">
        <div className="badge">{listBadge}</div>
        <h2
          className="medium"
          style={{
            color: typeSpecial == "roadmap" ? COLORS.white : COLORS.black,
          }}
        >
          {title}
        </h2>
        <div className="list-feature">
          {listFeature.map((features, idx) => (
            <p key={idx} className="medium feature-name">
              {features}
            </p>
          ))}
        </div>
      </div>
      {shape}
    </div>
  );
};

export default DecorationCardContext;
