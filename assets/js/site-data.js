/* =============================================================
   SITE DATA — single source of truth for contact info + nav.
   Never hard-code a phone, email, or address anywhere else.
   ============================================================= */

export const SITE = Object.freeze({
  name:   { en: "Al Zahraa General Contracting", ar: "شركة الزهراء للمقاولات العمومية" },
  domain: "https://alzahraa-construction.com",
  founded: 1995,

  phones: [
    { display: "01031764534", tel: "+201031764534" },
    { display: "01080005220", tel: "+201080005220" }
  ],

  emails: {
    info:    "info@alzahraa-construction.com",
    service: "service@alzahraa-construction.com",
    support: "support@alzahraa-construction.com",
    sarah:   "sarah.idris@alzahraa-construction.com",
    morad:   "morad.talaat@alzahraa-construction.com"
  },

  address: {
    en: "127 Mohamed Farid St. – Al-Bustan Building – Apartment 53, 5th Floor – Abdin – Cairo",
    ar: "١٢٧ شارع محمد فريد – عمارة البستان – شقة ٥٣، الدور الخامس – عابدين – القاهرة"
  },

  /* Both offices. `phones` / `address` above stay as-is for the pages
     that already read them (they mirror the Cairo HQ entry here).
     Fax numbers carry no `tel` on purpose — never render them as links. */
  branches: [
    {
      id: "cairo-hq",
      en: "Cairo — Head Office",
      ar: "القاهرة – المقر الرئيسي",
      address: {
        en: "127 Mohamed Farid St. – Al-Bustan Building – Apartment 53, 5th Floor – Abdin – Cairo",
        ar: "١٢٧ شارع محمد فريد – عمارة البستان – شقة ٥٣، الدور الخامس – عابدين – القاهرة"
      },
      mobiles: [
        { display: "01031764534", tel: "+201031764534" },
        { display: "01080005220", tel: "+201080005220" }
      ],
      landline: { display: "0223337276", tel: "+20223337276" },
      fax: { display: "0223337277" }
    },
    {
      id: "sharqia",
      en: "Sharqia Branch",
      ar: "فرع الشرقية",
      address: {
        en: "Hesham Zidan Street, off Zagazig–Ismailia Road (36 Military), next to the Psychiatric Hospital, Al-Qurain, Sharqia",
        ar: "شارع هشام زيدان – متفرع من طريق الزقازق – الإسماعيلية (36 عسكري) – بجوار مستشفى الأمراض النفسية – القرين – الشرقية"
      },
      landline: { display: "0554442522", tel: "+20554442522" },
      fax: { display: "0553316266" }
    }
  ],

  socials: {
    facebook:  "",
    instagram: "",
    linkedin:  "",
    twitter:   "",
    youtube:   ""
  },

  nav: [
    { slug: "",                en: "Home",             ar: "الرئيسية" },
    { slug: "about-us",        en: "About Us",         ar: "من نحن" },
    { slug: "our-services",    en: "Services",         ar: "خدماتنا" },
    { slug: "our-projects",    en: "Projects",         ar: "مشاريعنا" },
    { slug: "equipment",       en: "Equipment",        ar: "المعدات والآليات" },
    { slug: "quality-safety",  en: "Quality & Safety", ar: "الجودة والسلامة" },
    { slug: "media-center",    en: "Media Center",     ar: "المركز الإعلامي" },
    { slug: "careers",         en: "Careers",          ar: "الوظائف" },
    { slug: "contact-us",      en: "Contact Us",       ar: "اتصل بنا" }
  ]
});
