import { createLazyFileRoute } from "@tanstack/react-router";
import { Suspense, useEffect } from "react";
import { useTranslation } from "react-i18next";
import TetrisLoader from "@/components/TetrisLoader";
import { useLayout } from "@/contexts/LayoutContext";
import {
  useSuspenseGetUserProfile,
  useUpdateUserProfile,
} from "@/hooks/useProfile";
import { MOCK_USER_PROFILE } from "@/mock/user";
import { logger } from "@/utils/logger";
import EditableField from "../-components/EditableField";

export const Route = createLazyFileRoute("/learner/user/$userId/")({
  component: UserProfile,
});

function UserProfile() {
  const { t } = useTranslation();
  const { user } = Route.useRouteContext();
  const { setLayoutConfigState } = useLayout();
  const currentUserId = user?.id || "mock-id";

  logger.debug("UserProfile render:", { user, currentUserId });

  useEffect(() => {
    if (user?.username)
      setLayoutConfigState((prev) => ({ ...prev, customTitle: user.username }));
  }, [user?.username, setLayoutConfigState]);

  const { data } = useSuspenseGetUserProfile(currentUserId);
  const updateUserMutation = useUpdateUserProfile();

  const isBackendSuccess = !!data?.currentUser?.users?.length;
  const successCourses = data.countSuccessEnrollments?.data || [];
  const inProgressCourses = data.countInProgressEnrollments?.data || [];

  const userDisplay = isBackendSuccess
    ? (() => {
        const backendUser = data.currentUser.users[0]!;
        return {
          ...MOCK_USER_PROFILE,
          id: backendUser.id,
          username: backendUser.username || MOCK_USER_PROFILE.username,
          email: backendUser.email || MOCK_USER_PROFILE.email,
          diamond: backendUser.diamond ?? MOCK_USER_PROFILE.diamond,
          currentSteak:
            backendUser.currentSteak ?? MOCK_USER_PROFILE.currentSteak,
          phoneNumber: backendUser.phoneNumber || MOCK_USER_PROFILE.phoneNumber,
          enrollment: [
            ...successCourses.map((c) => ({ course: c })),
            ...inProgressCourses.map((c) => ({ course: c })),
          ],
        };
      })()
    : MOCK_USER_PROFILE;

  const handleUpdateUser = (field: string, newValue: string) => {
    updateUserMutation.mutate({
      id: userDisplay.id,
      [field]: newValue,
    });
  };

  return (
    <div className="profile">
      <Suspense fallback={<TetrisLoader />}>
        <div className="profile-banner"></div>

        <div className="profile-info">
          <div className="profile-info-avatar">
            <img
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userDisplay.username}`}
              alt={t("profile.avatar_alt")}
            />
          </div>

          <div className="profile-info-content">
            <div className="profile-info-content-header">
              <h1 className="profile-info-content-header-name">
                {userDisplay.username}
              </h1>
            </div>

            <div className="profile-info-content-stats">
              <span className="profile-info-content-stats-user">
                @{userDisplay.username}
              </span>
              <span className="profile-info-content-stats-dot">•</span>
              <span className="profile-info-content-stats-item">
                <strong>{userDisplay.diamond}</strong> {t("profile.diamonds")}
              </span>
              <span className="profile-info-content-stats-dot">•</span>
              <span className="profile-info-content-stats-item">
                <strong>{userDisplay.followers}</strong>{" "}
                {t("profile.followers")}
              </span>
              <span className="profile-info-content-stats-dot">•</span>
              <span className="profile-info-content-stats-item">
                <strong>{userDisplay.currentSteak}</strong>{" "}
                {t("profile.streak")}
              </span>
            </div>

            <div className="profile-info-content-details">
              <span>{userDisplay.email}</span>
              <span className="profile-info-content-details-dot">•</span>
              <span>{userDisplay.phoneNumber}</span>
            </div>
          </div>
        </div>

        <div className="profile-personal-info-card">
          <h2 className="profile-personal-info-title">
            {t("profile.personal_info")}
          </h2>

          <EditableField
            label={t("profile.username_label")}
            value={userDisplay.username}
            fieldName="username"
            onSave={handleUpdateUser}
            isLoading={updateUserMutation.isPending}
          />

          <EditableField
            label={t("profile.email_label")}
            value={userDisplay.email}
            fieldName="email"
            onSave={handleUpdateUser}
            isLoading={updateUserMutation.isPending}
          />

          <EditableField
            label={t("profile.phone_label")}
            value={userDisplay.phoneNumber}
            fieldName="phoneNumber"
            onSave={handleUpdateUser}
            isLoading={updateUserMutation.isPending}
          />
        </div>

        <div className="profile-courses">
          <h2 className="profile-courses-title">{t("profile.my_courses")}</h2>
          <div className="profile-courses-list">
            {userDisplay.enrollment.map((item) => (
              <div key={item.course.id} className="profile-courses-list-card">
                <div className="profile-courses-list-card-icon">
                  <div className="profile-courses-list-card-icon-shape"></div>
                </div>
                <h3 className="profile-courses-list-card-name">
                  {item.course.courseName}
                </h3>
                <p className="profile-courses-list-card-abstract">
                  {item.course.abstract}
                </p>
                <div className="profile-courses-list-card-status">
                  {item.course.isDone
                    ? t("profile.completed")
                    : t("profile.in_progress")}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Suspense>
    </div>
  );
}
