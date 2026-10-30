import { createLazyFileRoute } from "@tanstack/react-router";
import Icon from "@/components/Icon";
import PillTopNav from "@/components/PillTopNav";
import { BLOG_POSTS } from "@/mock/blogs";
import { Trans, useTranslation } from "react-i18next";

export const Route = createLazyFileRoute("/blogs/")({
  component: Blogs,
});

function Blogs() {
  const { t, i18n } = useTranslation();
  return (
    <div className="blogs">
      <PillTopNav />
      <main className="blogs__content">
        <section className="blogs__hero">
          <div className="blogs__hero-content">
            <h1>
              <Trans
                key={i18n.language}
                i18nKey="blogs.title"
                components={{ Beauty: <span className="beauty" /> }}
              />
            </h1>
            <p>{t("blogs.description")}</p>
          </div>
        </section>

        <section className="blogs__section">
          <div className="blogs__grid">
            {BLOG_POSTS.map((post) => (
              <article key={post.id} className="blogs__card">
                <div className="blogs__card-meta">
                  <span className="blogs__card-category">
                    {t(`blogs.posts.${post.id}.category`, post.category)}
                  </span>
                  <span className="blogs__card-date">{post.date}</span>
                </div>
                <h3>{t(`blogs.posts.${post.id}.title`, post.title)}</h3>
                <p>{t(`blogs.posts.${post.id}.excerpt`, post.excerpt)}</p>
                <div className="blogs__card-footer">
                  <span className="blogs__card-readtime">
                    <Icon name="schedule" size="1em" />
                    {t(`blogs.posts.${post.id}.readTime`, post.readTime)}
                  </span>
                  <div className="blogs__card-tags">
                    {post.tags.map((tag) => (
                      <span key={tag} className="blogs__card-tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
