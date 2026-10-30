import "./style.scss";

import PillTopNav from "@/components/PillTopNav";
import { ABOUT_STATS, ABOUT_VALUES } from "@/mock/about";
import { SUBSCRIPTIONS } from "@learner/subscriptions/-constants";
import { useNavigate } from "@tanstack/react-router";
import HeroSection from "./-components/HeroSection";
import LandingAudience from "./-components/LandingAudience";
import LandingFooter from "./-components/LandingFooter";
import LandingHow from "./-components/LandingHow";
import LandingStats from "./-components/LandingStats";
import LandingSubs from "./-components/LandingSubs";
import LandingValues from "./-components/LandingValues";
import { AUDIENCES, HOW_IT_WORKS } from "./constants";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing">
      <PillTopNav />
      <HeroSection
        onLearnerClick={() => navigate({ to: "/learner" })}
        onTeacherClick={() => navigate({ to: "/instructor" })}
      />
      <LandingStats stats={ABOUT_STATS} />
      <LandingHow steps={HOW_IT_WORKS} />
      <LandingAudience audiences={AUDIENCES} />
      <LandingSubs subscriptions={SUBSCRIPTIONS} />
      <LandingValues values={ABOUT_VALUES} />
      <LandingFooter />
    </div>
  );
}
