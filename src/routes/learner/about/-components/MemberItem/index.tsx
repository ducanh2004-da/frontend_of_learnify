import type { TMemberProps } from "@learner/about/-types/about";
import { OptimizeImage } from "@/components/Images";
import "./style.scss";

const MemberItem = (props: TMemberProps) => {
  const { name, jobTitle, image } = props;
  const imageSrc = image.name || "";
  const imageFolder = image.folder || "";

  return (
    <div className="member-item">
      <div className="member-item-avatar-wrapper">
        <OptimizeImage
          src={imageSrc}
          alt={name || "Team member"}
          folder={imageFolder}
          className="member-item-avatar-wrapper-img"
        />
      </div>
      <div className="member-item-info">
        <h3 className="member-item-info-name semibold">{name}</h3>
        <h4 className="member-item-info-job-title regular">{jobTitle}</h4>
      </div>
    </div>
  );
};

export default MemberItem;
