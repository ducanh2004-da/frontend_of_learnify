import "./roadmaps.scss";

import Card from "@/components/Card";
import Empty from "@/components/Empty";
import ErrorScene from "@/components/ErrorScene";
import Icon from "@/components/Icon";
import Search from "@/components/Search";
import TetrisLoader from "@/components/TetrisLoader";
import TextButton from "@/components/TextButton";
import { useSuspenseAllRoadmaps } from "@/hooks/useRoadmap";
import { createLearnerHead } from "@/utils";
import {
  createFileRoute,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { Suspense, useMemo } from "react";
import { Trans, useTranslation } from "react-i18next";
import { z } from "zod";
import CategoryItem from "./-components/CategoryItem";
import { CATEGORIES, type TCategoryKey } from "./-constants";
import RouterComponentHolder from "@/components/RouterComponentHolder";
import NotFound from "@/components/NotFound";

const searchSchema = z.object({
  q: z.string().catch(""),
  category: z.string().optional().catch(undefined),
});

function RoadmapsErrorComponent() {
  const router = useRouter();
  const { t } = useTranslation();
  return (
    <ErrorScene>
      <ErrorScene.Header>
        <ErrorScene.Title errorCode={500}>
          {t("errors.server_error")}
        </ErrorScene.Title>
        <ErrorScene.Description>
          {t("errors.load_roadmaps")}
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
}

export const Route = createFileRoute("/learner/roadmaps/")({
  validateSearch: searchSchema,
  head: () => createLearnerHead("Roadmaps"),
  errorComponent: RoadmapsErrorComponent,
  pendingComponent: () => <RouterComponentHolder children={<TetrisLoader />} />,
  notFoundComponent: () => <RouterComponentHolder children={<NotFound />} />,
  component: RoadmapsPage,
});

function RoadmapsPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { q, category } = Route.useSearch();

  const { data: roadmapData } = useSuspenseAllRoadmaps();

  const activeCategory = category as TCategoryKey | undefined;

  const displayRoadmaps = useMemo(() => {
    if (!roadmapData?.roadmap) return [];
    return roadmapData.roadmap.map((item) => ({
      id: item.id,
      typeSpecial: "roadmap" as const,
      title: item.roadMapName,
      description: item.abstract,
      duration: undefined,
      status: "default" as const,
      percentage: 0,
    }));
  }, [roadmapData]);

  const filteredRoadmaps = useMemo(() => {
    let result = displayRoadmaps;

    if (q) {
      const query = q.toLowerCase();
      result = result.filter(
        (r) =>
          r.title.toLowerCase().includes(query) ||
          (r.description?.toLowerCase() ?? "").includes(query)
      );
    }

    if (activeCategory) {
      const cat = CATEGORIES.find((c) => c.key === activeCategory);
      if (cat) {
        result = result.filter((r) => {
          const text = `${r.title} ${r.description ?? ""}`.toLowerCase();
          return cat.keywords.some((kw) => text.includes(kw));
        });
      }
    }

    return result;
  }, [displayRoadmaps, q, activeCategory]);

  const handleCategoryClick = (key: TCategoryKey) => {
    navigate({
      to: "/learner/roadmaps",
      search: {
        q,
        category: key === activeCategory ? undefined : key,
      },
    });
  };

  return (
    <div className="roadmaps-container">
      <Suspense fallback={<TetrisLoader />}>
        <div className="roadmaps-container__title">
          <h2 className="medium">
            <Trans
              key={i18n.language}
              i18nKey="roadmaps.headline"
              components={{ Beauty: <span className="beauty" /> }}
            />
          </h2>
          <p className="regular">{t("roadmaps.description")}</p>
        </div>
        <div className="roadmaps-content">
          <Search
            placeholder={t("roadmaps.search_placeholder")}
            onSearch={(query) =>
              navigate({
                to: "/learner/roadmaps",
                search: { q: query || "", category: category },
              })
            }
          />
          <div className="roadmaps-container__categories-list">
            {CATEGORIES.map((item) => (
              <CategoryItem
                key={item.key}
                icon={item.icon}
                labelKey={item.labelKey}
                selected={activeCategory === item.key}
                onClick={() => handleCategoryClick(item.key)}
              />
            ))}
            {activeCategory && (
              <TextButton
                text={t("courses.filter_clear")}
                size="tiny"
                type="outlined"
                icon="close"
                onClick={() =>
                  navigate({
                    to: "/learner/roadmaps",
                    search: { q, category: undefined },
                  })
                }
              />
            )}
          </div>

          {filteredRoadmaps.length > 0 ? (
            <div className="roadmaps-container__list">
              {filteredRoadmaps.map((roadmap) => (
                <Card
                  key={roadmap.id}
                  typeSpecial={roadmap.typeSpecial}
                  title={roadmap.title}
                  description={roadmap.description}
                  duration={roadmap.duration}
                  status={roadmap.status}
                  percentage={roadmap.percentage}
                  onClick={() =>
                    navigate({
                      to: "/learner/roadmaps/$roadmapId",
                      params: {
                        roadmapId: roadmap.id.toString(),
                      },
                    })
                  }
                />
              ))}
            </div>
          ) : (
            <Empty>
              <Empty.Header>
                <Empty.Media variant="icon">
                  <Icon name="close" />
                </Empty.Media>
                <Empty.Title>{t("search.no_results")}</Empty.Title>
                <Empty.Description>
                  {t("search.no_results_desc")}
                </Empty.Description>
              </Empty.Header>
            </Empty>
          )}
        </div>
      </Suspense>
    </div>
  );
}
