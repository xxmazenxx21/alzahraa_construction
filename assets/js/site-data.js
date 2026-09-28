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
