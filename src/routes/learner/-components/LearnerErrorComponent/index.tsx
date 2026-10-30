import GraphqlError from "@/components/GraphqlError";
import RouterComponentHolder from "@/components/RouterComponentHolder";

type TLearnerErrorComponentProps = {
  error?: unknown;
};

function LearnerErrorComponent({ error }: TLearnerErrorComponentProps) {
  return (
    <RouterComponentHolder>
      <GraphqlError error={error} />
    </RouterComponentHolder>
  );
}

export default LearnerErrorComponent;
