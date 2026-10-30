import { useTranslation } from "react-i18next";
import { useRouter } from "@tanstack/react-router";
import ErrorScene from "@/components/ErrorScene";
import TextButton from "@/components/TextButton";

const LessonError = () => {
  const { t } = useTranslation();
  const router = useRouter();
  return (
    <ErrorScene>
      <ErrorScene.Header>
        <ErrorScene.Title errorCode={500}>
          {t("lesson_error.server_error")}
        </ErrorScene.Title>
        <ErrorScene.Description>
          {t("lesson_error.load_error")}
        </ErrorScene.Description>
      </ErrorScene.Header>
      <ErrorScene.Content>
        <div className="error-scene__control">
          <TextButton
            text={t("errors.try_again")}
            onClick={() => router.invalidate()}
            className="error-scene__btn"
            size="medium"
            icon="refresh"
          />
          <TextButton
            text={t("errors.go_back")}
            onClick={() => window.history.back()}
            className="error-scene__btn error-scene__btn--secondary"
            size="medium"
            icon="arrow_back"
            type="outlined"
          />
        </div>
      </ErrorScene.Content>
    </ErrorScene>
  );
};

export default LessonError;
