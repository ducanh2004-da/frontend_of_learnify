import { teamMembers } from "@/mock";
import "./style.scss";
import MemberItem from "@learner/about/-components/MemberItem";

const TeamList = () => {
  return (
    <div className="team-list">
      {teamMembers.map((member, index) => (
        <MemberItem key={`team-${index}`} {...member} />
      ))}
    </div>
  );
};

export default TeamList;
