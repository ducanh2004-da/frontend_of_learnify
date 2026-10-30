import "./index.scss";

import TetrisLoader from "@/components/TetrisLoader";
import { useGetAllAdminUsers } from "@/hooks/useAdminUsers";
import { createLazyFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { useTranslation } from "react-i18next";
import RecentUsers from "./-components/RecentUsers";
import StatsGrid from "./-components/StatsGrid";
import SystemActivity from "./-components/SystemActivity";
import WelcomeHeader from "./-components/WelcomeHeader";
import CubeLoader from "@/components/CubeLoader";

const ChartSection = lazy(() => import("./-components/ChartSection"));

export const Route = createLazyFileRoute("/admin/")({
  component: AdminDashboardPage,
});

function AdminDashboardPage() {
  const { t, i18n } = useTranslation();
  const { data, isLoading, isError } = useGetAllAdminUsers();

  if (isLoading) {
    return <TetrisLoader />;
  }

  if (isError) {
    return (
      <div className="admin-dashboard-error">
        {t("admin.dashboard.load_error")}
      </div>
    );
  }

  const users = data?.users || [];
  const totalUsers = data?.count || 0;

  const todayDateStr = new Date().toDateString();
  const todaySubscribers = users.filter(
    (user) => new Date(user.createdAt).toDateString() === todayDateStr
  ).length;

  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d;
  });

  const chartLabels = last7Days.map((d) =>
    d.toLocaleDateString(i18n.language, { weekday: "short" })
  );

  const chartDataPoints = [0, 0, 0, 0, 0, 0, 0];
  users.forEach((user) => {
    const userDate = new Date(user.createdAt).toDateString();
    last7Days.forEach((day, index) => {
      if (day.toDateString() === userDate) {
        chartDataPoints[index] = (chartDataPoints[index] ?? 0) + 1;
      }
    });
  });

  const recentUsers = [...users]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  return (
    <div className="admin-dashboard">
      <WelcomeHeader name="Admin" />
      <StatsGrid totalUsers={totalUsers} todaySubscribers={todaySubscribers} />
      <Suspense
        fallback={
          <div style={{ width: "100%", height: "20dvh" }}>
            <CubeLoader />
          </div>
        }
      >
        <ChartSection labels={chartLabels} dataPoints={chartDataPoints} />
      </Suspense>
      <div className="admin-dashboard__bottom-row">
        <RecentUsers users={recentUsers} />
        <SystemActivity />
      </div>
    </div>
  );
}
