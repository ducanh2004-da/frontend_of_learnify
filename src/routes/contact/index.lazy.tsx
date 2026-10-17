import { createLazyFileRoute } from "@tanstack/react-router";
import CustomLink from "@/components/CustomLink";
import Icon, { type TIconName } from "@/components/Icon";
import PillTopNav from "@/components/PillTopNav";
import { CONTACT_INFO, SOCIAL_LINKS } from "@/mock/contact";
import { Trans, useTranslation } from "react-i18next";

export const Route = createLazyFileRoute("/contact/")({
  component: Contact,
});

function Contact() {
  const { t, i18n } = useTranslation();
  return (
    <div className="contact">
      <PillTopNav />
      <main className="contact__content">
        <section className="contact__hero">
          <div className="contact__hero-content">
            <h1>
              <Trans
                key={i18n.language}
                i18nKey="contact.title"
                components={{ Beauty: <span className="beauty" /> }}
              />
            </h1>
            <p>{t("contact.description")}</p>
          </div>
        </section>

        <section className="contact__section">
          <div className="contact__grid contact__grid--2col">
            {CONTACT_INFO.map((item) => (
              <div key={item.key} className="contact__card">
                <div className="contact__card-icon">
                  <Icon name={item.icon as TIconName} size="2em" />
                </div>
                <h3>{t(`contact_info.${item.key}.label`, item.label)}</h3>
                {item.href ? (
                  <CustomLink to={item.href} className="contact__card-link">
                    {t(`contact_info.${item.key}.value`, item.value)}
                  </CustomLink>
                ) : (
                  <p>{t(`contact_info.${item.key}.value`, item.value)}</p>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="contact__section contact__section--social">
          <h2>{t("contact.follow_us")}</h2>
          <div className="contact__socials">
            {SOCIAL_LINKS.map((social) => (
              <a
                key={social.key}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="contact__social"
                aria-label={t(`social_links.${social.key}`, social.name)}
              >
                <Icon name={social.icon as TIconName} size="1.5em" />
                <span>{t(`social_links.${social.key}`, social.name)}</span>
              </a>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
