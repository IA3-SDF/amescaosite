export interface EventData {
  id: string; // UUID Supabase
  title: string;
  date: string;
  location?: string;
  description?: string;
  content?: string;
  cover_photo?: string; // URL directe Supabase Storage
  other_photos?: string[]; // Array d'URLs Supabase Storage
}

export interface AlbumData {
  id: string; // UUID Supabase
  event_title: string;
  event_date: string;
  photos: string[]; // Array d'URLs Supabase Storage
}

export interface ReportData {
  id: string; // UUID Supabase
  title: string;
  date?: string;
  year?: string;
  content?: string;
  document_pdf_link?: string; // URL directe du PDF
}

export interface BoardMemberData {
  id: string; // UUID Supabase
  name: string;
  surname?: string;
  order: number;
  role: string;
  photo?: string; // URL directe Supabase Storage
  biography?: string;
}

export interface AboutData {
  id: string;
  text?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  surname: string;
  email: string;
  photo?: string;
  googleAvatarUrl?: string;
  role: string;
}

export type Language = "fr" | "en";

export interface Translation {
  nav: {
    home: string;
    events: string;
    albums: string;
    contact: string;
    support: string;
  };
  common: {
    close: string;
    cancel: string;
    save: string;
    edit: string;
    active: string;
    theme: string;
    themeToggleLight: string;
    themeToggleDark: string;
    light: string;
    dark: string;
    language: string;
    logout: string;
    openMenu: string;
    closeMenu: string;
    account: string;
    accountDescription: string;
    privacy: string;
    privacyDescription: string;
    terms: string;
    termsDescription: string;
    login: string;
    signup: string;
    navigation: string;
    profileOf: string;
    logoutError: string;
    logoutConfirmTitle: string;
    logoutConfirmDescription: string;
    logoutConfirmCancel: string;
    logoutConfirmAction: string;
    quickLinks: string;
    allRightsReserved: string;
    developerLabel: string;
    developerName: string;
  };
  legal: {
    backToHome: string;
    backToProfile: string;
    themeToggleLabel: string;
    privacyEyebrow: string;
    privacyTitle: string;
    privacyIntro: string;
    privacySections: Array<{ title: string; body: string }>;
    termsEyebrow: string;
    termsTitle: string;
    termsIntro: string;
    termsSections: Array<{ title: string; body: string }>;
    contactLabel: string;
    contactEmail: string;
  };
  home: {
    heroTitle: string;
    heroSubtitle: string;
    presentationTitle: string;
    presentationText: string;
    recentEvents: string;
    seeAll: string;
    boardTitle: string;
    reportsTitle: string;
    statsAnnualActions: string;
    statsYoungSupported: string;
    statsYearsImpact: string;
    sidebarButton: string;
    sidebarTitle: string;
    noMembers: string;
    noReports: string;
    noBiography: string;
    noSummary: string;
    read: string;
    newsTitle: string;
  };
  events: {
    title: string;
    timeline: string;
    readMore: string;
    close: string;
    searchPlaceholder: string;
    resultsCountOne: string;
    resultsCountOther: string;
    viewGrid: string;
    viewTimeline: string;
    emptyState: string;
  };
  albums: {
    title: string;
    year: string;
    noTitle: string;
    unknownDate: string;
  };
  contact: {
    title: string;
    introText: string;
    emailTitle: string;
    phoneTitle: string;
    addressTitle: string;
    openingHoursTitle: string;
    openingHoursWeekdays: string;
    openingHoursSaturday: string;
    formName: string;
    formEmail: string;
    formMessage: string;
    formSubmit: string;
    sending: string;
    successMessage: string;
    errorMessage: string;
    errorSendMessage: string;
    historyTitle: string;
    missionTitle: string;
    partnersTitle: string;
    achievementsTitle: string;
  };
  support: {
    title: string;
    motivation: string;
    donateTitle: string;
    donateButton: string;
    mobileMoneyTitle: string;
    paymentTitle: string;
    holderLabel: string;
    expiresLabel: string;
  };
  about: {
    title: string;
    text: string;
  };
  history: {
    title: string;
    text: string;
  };
  profile: {
    title: string;
    editTitle: string;
    loading: string;
    loadError: string;
    close: string;
    edit: string;
    save: string;
    cancel: string;
    nameLabel: string;
    namePlaceholder: string;
    surnameLabel: string;
    surnamePlaceholder: string;
    emailLabel: string;
    emailReadonly: string;
    photoAdd: string;
    photoEdit: string;
    photoRemove: string;
    accountCardTitle: string;
    accountCardDescription: string;
    themeTitle: string;
    themeLightActive: string;
    themeDarkActive: string;
    languageTitle: string;
    languageDescription: string;
    languageModalTitle: string;
    languageModalDescription: string;
    languageFrench: string;
    languageFrenchDescription: string;
    languageEnglish: string;
    languageEnglishDescription: string;
    privacyTitle: string;
    privacyDescription: string;
    termsTitle: string;
    termsDescription: string;
    logout: string;
    logoutConfirmTitle: string;
    logoutConfirmDescription: string;
    logoutConfirmCancel: string;
    logoutConfirmAction: string;
    roleAdmin: string;
    roleModerator: string;
    successProfileUpdated: string;
    errorProfileUpdated: string;
    errorProfileLoad: string;
    successPhotoUpdated: string;
    errorPhotoUpload: string;
    errorLogout: string;
    languageChangedFr: string;
    languageChangedEn: string;
    activeLabel: string;
  };
}

export const translations: Record<Language, Translation> = {
  fr: {
    nav: {
      home: "Accueil",
      events: "Événements",
      albums: "Albums",
      contact: "Contact",
      support: "Soutenir",
    },
    common: {
      close: "Fermer",
      cancel: "Annuler",
      save: "Enregistrer",
      edit: "Modifier",
      active: "Actif",
      theme: "Thème",
      themeToggleLight: "Activer le mode sombre",
      themeToggleDark: "Activer le mode clair",
      light: "Clair",
      dark: "Sombre",
      language: "Langue",
      logout: "Se déconnecter",
      openMenu: "Ouvrir le menu",
      closeMenu: "Fermer le menu",
      account: "Mon compte",
      accountDescription: "Modifier mes informations",
      privacy: "Confidentialité",
      privacyDescription: "Voir notre politique de confidentialité",
      terms: "CGU",
      termsDescription: "Lire nos conditions générales d’utilisation",
      login: "Connexion",
      signup: "S'inscrire",
      navigation: "Navigation",
      profileOf: "Profil de",
      logoutError: "Erreur lors de la déconnexion. Veuillez réessayer.",
      logoutConfirmTitle: "Confirmer la déconnexion",
      logoutConfirmDescription: "Êtes-vous sûr de vouloir vous déconnecter ?",
      logoutConfirmCancel: "Annuler",
      logoutConfirmAction: "Déconnexion",
      quickLinks: "Liens Rapides",
      allRightsReserved: "Tous droits réservés.",
      developerLabel: "Développeur :",
      developerName: "Félix kpanoga",
    },
    legal: {
      backToHome: "Retour à l’accueil",
      backToProfile: "Retour au profil",
      themeToggleLabel: "Changer de thème",
      privacyEyebrow: "Politique de Confidentialité",
      privacyTitle: "Protection des données et respect de votre vie privée",
      privacyIntro:
        "Cette politique décrit les informations collectées par AM.E.S.C.A.O, leur usage, ainsi que les mesures prises pour les protéger.",
      privacySections: [
        {
          title: "1. Données collectées",
          body: "Lors de votre connexion via Google OAuth, AM.E.S.C.A.O peut collecter les informations suivantes : votre nom, votre adresse e-mail et votre photo de profil, lorsque ces informations sont fournies par Google.",
        },
        {
          title: "2. Utilisation des données",
          body: "Ces informations sont utilisées exclusivement pour permettre et sécuriser votre authentification sur AM.E.S.C.A.O, administrer votre compte et améliorer votre expérience d’utilisation.",
        },
        {
          title: "3. Partage des données",
          body: "AM.E.S.C.A.O ne vend ni ne partage vos données personnelles à des tiers à des fins commerciales. Les données peuvent être traitées uniquement dans le cadre technique et opérationnel du service.",
        },
        {
          title: "4. Sécurité",
          body: "Nous mettons en œuvre des mesures raisonnables pour protéger vos données contre l’accès non autorisé, la perte ou l’utilisation abusive.",
        },
      ],
      termsEyebrow: "Conditions Générales d’Utilisation",
      termsTitle: "Conditions d’accès et d’utilisation du service",
      termsIntro:
        "En utilisant AM.E.S.C.A.O, vous acceptez les présentes conditions d’utilisation.",
      termsSections: [
        {
          title: "1. Accès au service",
          body: "AM.E.S.C.A.O met à disposition un service web et mobile destiné à faciliter l’accès à l’information, aux événements et aux ressources de l’organisation.",
        },
        {
          title: "2. Usage autorisé",
          body: "L’utilisateur s’engage à utiliser le service de manière licite, responsable et à ne pas porter atteinte à l’intégrité, à la sécurité ou à la réputation de l’application.",
        },
        {
          title: "3. Propriété intellectuelle",
          body: "Le nom « AM.E.S.C.A.O » ainsi que les contenus, visuels et éléments de marque associés restent la propriété de l’organisation, sauf indication contraire.",
        },
        {
          title: "4. Responsabilité limitée",
          body: "AM.E.S.C.A.O s’efforce de fournir un service fiable, mais ne saurait être tenu responsable des interruptions, erreurs techniques ou conséquences indirectes liées à l’utilisation du service.",
        },
        {
          title: "5. Modifications",
          body: "Ces conditions peuvent être mises à jour à tout moment afin de refléter l’évolution du service ou des exigences légales applicables.",
        },
      ],
      contactLabel:
        "Pour toute question relative à cette politique ou à vos données, vous pouvez nous contacter à l’adresse :",
      contactEmail: "badaguemkpanoga@gmail.com",
    },
    home: {
      heroTitle: "AMESCAO",
      heroSubtitle: "Bâtir ensemble l’avenir de la jeunesse du Canton d’Aouda",

      presentationTitle: "Notre Vision, Notre Avenir",

      presentationText:
        "L’AMESCAO œuvre pour une jeunesse unie, responsable et engagée dans le développement du canton d’Aouda. À travers l’éducation, la solidarité, la culture et l’accompagnement des jeunes, nous voulons créer un cadre où chacun peut Evenements, évoluer et contribuer positivement à sa communauté. Nous croyons que chaque élève, étudiant et stagiaire représente une richesse pour l’avenir du canton. Ensemble, nous bâtissons une amicale forte, dynamique et tournée vers le progrès collectif.",

      recentEvents: "Nos Dernières Actions",
      seeAll: "Voir tout",
      boardTitle: "Le Bureau",
      reportsTitle: "Rapports d’Activité",
      statsAnnualActions: "Actions Annuelles",
      statsYoungSupported: "Jeunes Soutenus",
      statsYearsImpact: "Années d'impact",
      sidebarButton: "Bureau & Rapports",
      sidebarTitle: "Informations",
      noMembers: "Aucun membre",
      noReports: "Aucun rapport",
      noBiography: "Aucune biographie disponible.",
      noSummary: "Aucun résumé disponible.",
      read: "Lire",
      newsTitle: "Actualités",
    },

    events: {
      title: "Nos Actions",

      timeline:
        "À travers ses activités éducatives, sociales, culturelles et citoyennes, l’AMESCAO agit pour le développement du canton d’Aouda et l’épanouissement de sa jeunesse.",

      readMore: "Découvrir",
      close: "Fermer",
      searchPlaceholder: "Rechercher une action...",
      resultsCountOne: "événement",
      resultsCountOther: "événements",
      viewGrid: "Grille",
      viewTimeline: "Chronologie",
      emptyState: "Aucun événement trouvé.",
    },

    albums: {
      title: "Souvenirs en Images",
      year: "Année",
      noTitle: "Sans titre",
      unknownDate: "Date inconnue",
    },

    contact: {
      title: "Contactez-Nous",
      introText:
        "Nous sommes à votre écoute pour toute question ou suggestion.",
      emailTitle: "Email",
      phoneTitle: "Téléphone",
      addressTitle: "Siège Social",
      openingHoursTitle: "Horaires d'ouverture",
      openingHoursWeekdays: "Lundi - Vendredi : 08h00 - 17h00",
      openingHoursSaturday: "Samedi : 09h00 - 12h00",
      formName: "Votre Nom",
      formEmail: "Votre Email",
      formMessage: "Votre Message",
      formSubmit: "Envoyer",
      sending: "Envoi en cours...",
      successMessage: "Votre message a été envoyé avec succès!",
      errorMessage: "Une erreur est survenue.",
      errorSendMessage: "Une erreur est survenue lors de l'envoi du message.",
      historyTitle: "Notre Histoire",
      missionTitle: "Notre Mission",
      partnersTitle: "Nos Partenaires",
      achievementsTitle: "Nos Réalisations",
    },

    support: {
      title: "Soutenir l’AMESCAO",

      motivation:
        "Chaque soutien contribue à accompagner la jeunesse du canton d’Aouda à travers l’éducation, la solidarité et les initiatives de développement.",

      donateTitle: "Faire un Don",
      donateButton: "Je soutiens l’AMESCAO",
      mobileMoneyTitle: "Paiement mobile",
      paymentTitle: "Paiement premium",
      holderLabel: "Titulaire",
      expiresLabel: "Expire",
    },

    about: {
      title: "À Propos de Nous",

      text: "L’AMESCAO est l’Amicale des Élèves, Étudiants et Stagiaires du Canton d’Aouda. Créée dans un esprit de solidarité et d’engagement communautaire, elle rassemble les jeunes du canton autour des valeurs d’éducation, de discipline, d’entraide et de développement local. À travers ses activités et ses initiatives, l’amicale contribue à l’encadrement de la jeunesse et à la promotion du progrès collectif.",
    },

    history: {
      title: "Héritage & Racines",

      text: "L’AMESCAO trouve son origine dans la volonté des élèves, étudiants et stagiaires du canton d’Aouda de se rassembler afin de promouvoir la solidarité, l’éducation et le développement communautaire. Structurée et officiellement reconnue depuis 2013, l’amicale mène diverses actions sociales, éducatives et culturelles en faveur de la jeunesse et du canton d’Aouda.",
    },
    profile: {
      title: "Profil",
      editTitle: "Modifier le profil",
      loading: "Chargement du profil…",
      loadError: "Impossible de charger le profil",
      close: "Fermer",
      edit: "Modifier",
      save: "Enregistrer",
      cancel: "Annuler",
      nameLabel: "Nom",
      namePlaceholder: "Votre nom",
      surnameLabel: "Prénom",
      surnamePlaceholder: "Votre prénom",
      emailLabel: "Email",
      emailReadonly: "Non modifiable",
      photoAdd: "Ajouter votre image",
      photoEdit: "Modifier votre image",
      photoRemove: "Supprimer la photo",
      accountCardTitle: "Mon compte",
      accountCardDescription: "Modifier les informations de votre compte",
      themeTitle: "Thème",
      themeLightActive: "Mode clair activé",
      themeDarkActive: "Mode sombre activé",
      languageTitle: "Langue",
      languageDescription: "Choisissez la langue de l’interface.",
      languageModalTitle: "Langue",
      languageModalDescription:
        "Activez l’interface dans votre langue préférée.",
      languageFrench: "Français",
      languageFrenchDescription: "Interface en français.",
      languageEnglish: "English",
      languageEnglishDescription: "Interface in English.",
      privacyTitle: "Confidentialité",
      privacyDescription: "Voir notre politique de confidentialité.",
      termsTitle: "CGU",
      termsDescription: "Lire nos conditions générales d’utilisation.",
      logout: "Se déconnecter",
      logoutConfirmTitle: "Confirmation",
      logoutConfirmDescription: "Êtes-vous sûr de vouloir vous déconnecter ?",
      logoutConfirmCancel: "Annuler",
      logoutConfirmAction: "Déconnecter",
      roleAdmin: "Administrateur",
      roleModerator: "Modérateur",
      successProfileUpdated: "Profil mis à jour",
      errorProfileUpdated: "Erreur lors de la mise à jour",
      errorProfileLoad: "Impossible de charger le profil",
      successPhotoUpdated: "Photo mise à jour",
      errorPhotoUpload: "Erreur lors du téléchargement",
      errorLogout: "Erreur lors de la déconnexion",
      languageChangedFr: "Langue définie sur le français",
      languageChangedEn: "Language set to English",
      activeLabel: "Actif",
    },
  },
  en: {
    nav: {
      home: "Home",
      events: "Events",
      albums: "Albums",
      contact: "Contact",
      support: "Support AMESCAO",
    },
    common: {
      close: "Close",
      cancel: "Cancel",
      save: "Save",
      edit: "Edit",
      active: "Active",
      theme: "Theme",
      themeToggleLight: "Switch to dark mode",
      themeToggleDark: "Switch to light mode",
      light: "Light",
      dark: "Dark",
      language: "Language",
      logout: "Log out",
      openMenu: "Open menu",
      closeMenu: "Close menu",
      account: "My account",
      accountDescription: "Update my information",
      privacy: "Privacy",
      privacyDescription: "View our privacy policy",
      terms: "Terms",
      termsDescription: "Read our terms of use",
      login: "Log in",
      signup: "Sign up",
      navigation: "Navigation",
      profileOf: "Profile of",
      logoutError: "Logout failed. Please try again.",
      logoutConfirmTitle: "Confirm logout",
      logoutConfirmDescription: "Are you sure you want to log out?",
      logoutConfirmCancel: "Cancel",
      logoutConfirmAction: "Log out",
      quickLinks: "Quick links",
      allRightsReserved: "All rights reserved.",
      developerLabel: "Developer:",
      developerName: "Félix kpanoga",
    },
    legal: {
      backToHome: "Back to home",
      backToProfile: "Back to profile",
      themeToggleLabel: "Toggle theme",
      privacyEyebrow: "Privacy Policy",
      privacyTitle: "Protection of your data and respect for your privacy",
      privacyIntro:
        "This policy describes the information collected by AM.E.S.C.A.O, how it is used, and the measures taken to protect it.",
      privacySections: [
        {
          title: "1. Data collected",
          body: "When you sign in via Google OAuth, AM.E.S.C.A.O may collect the following information: your name, your email address and your profile photo, when these details are provided by Google.",
        },
        {
          title: "2. Use of data",
          body: "This information is used exclusively to allow and secure your authentication on AM.E.S.C.A.O, manage your account and improve your experience.",
        },
        {
          title: "3. Sharing of data",
          body: "AM.E.S.C.A.O does not sell or share your personal data with third parties for commercial purposes. Data may only be processed within the technical and operational scope of the service.",
        },
        {
          title: "4. Security",
          body: "We use reasonable measures to protect your data from unauthorized access, loss or misuse.",
        },
      ],
      termsEyebrow: "Terms of Use",
      termsTitle: "Access and use conditions of the service",
      termsIntro: "By using AM.E.S.C.A.O, you accept these terms of use.",
      termsSections: [
        {
          title: "1. Access to the service",
          body: "AM.E.S.C.A.O provides a web and mobile service designed to facilitate access to information, events and the organization's resources.",
        },
        {
          title: "2. Authorized use",
          body: "The user agrees to use the service lawfully, responsibly and without harming the integrity, security or reputation of the application.",
        },
        {
          title: "3. Intellectual property",
          body: "The name “AM.E.S.C.A.O” as well as the associated content, visuals and brand elements remain the property of the organization, unless otherwise indicated.",
        },
        {
          title: "4. Limited liability",
          body: "AM.E.S.C.A.O strives to provide a reliable service, but cannot be held responsible for interruptions, technical errors or indirect consequences related to the use of the service.",
        },
        {
          title: "5. Changes",
          body: "These conditions may be updated at any time to reflect the evolution of the service or applicable legal requirements.",
        },
      ],
      contactLabel:
        "For any question related to this policy or your data, you can contact us at:",
      contactEmail: "badaguemkpanoga@gmail.com",
    },
    home: {
      heroTitle: "AMESCAO",
      heroSubtitle:
        "Building together the future of the youth of the Canton of Aouda",
      presentationTitle: "Our Vision, Your Future",
      presentationText:
        "AMESCAO is not just an association, it is a family. We join forces to transform the potential of every young person in Aouda into a brilliant success. Education, culture, and solidarity are the pillars of our commitment.",
      recentEvents: "Our Latest Actions",
      seeAll: "See all",
      boardTitle: "The Board: Committed Leaders",
      reportsTitle: "Transparency & Impact",
      statsAnnualActions: "Annual actions",
      statsYoungSupported: "Young people supported",
      statsYearsImpact: "Years of impact",
      sidebarButton: "Board & Reports",
      sidebarTitle: "Information",
      noMembers: "No members",
      noReports: "No reports",
      noBiography: "No biography available.",
      noSummary: "No summary available.",
      read: "Read",
      newsTitle: "News",
    },
    events: {
      title: "Our Journey",
      timeline: "Timeline",
      readMore: "Discover the impact",
      close: "Close",
      searchPlaceholder: "Search an action...",
      resultsCountOne: "event",
      resultsCountOther: "events",
      viewGrid: "Grid",
      viewTimeline: "Timeline",
      emptyState: "No events found.",
    },
    albums: {
      title: "Memories in Pictures",
      year: "Year",
      noTitle: "Untitled",
      unknownDate: "Unknown date",
    },
    contact: {
      title: "Join the Movement",
      introText: "We are here to listen to your questions and suggestions.",
      emailTitle: "Email",
      phoneTitle: "Phone",
      addressTitle: "Head Office",
      openingHoursTitle: "Opening hours",
      openingHoursWeekdays: "Monday - Friday: 08:00 - 17:00",
      openingHoursSaturday: "Saturday: 09:00 - 12:00",
      formName: "Your Name",
      formEmail: "Your Email",
      formMessage: "Your Message",
      formSubmit: "Send",
      sending: "Sending...",
      successMessage: "Your message was sent successfully!",
      errorMessage: "An error occurred.",
      errorSendMessage: "An error occurred while sending the message.",
      historyTitle: "Heritage & Roots",
      missionTitle: "Our Compass",
      partnersTitle: "Hand in Hand",
      achievementsTitle: "Common Victories",
    },
    support: {
      title: "Invest in Tomorrow",
      motivation:
        "Every contribution is a seed sown for the education and fulfillment of a young person. Together, let's fund scholarships, libraries, and dreams.",
      donateTitle: "Support the Impact",
      donateButton: "I support AMESCAO",
      mobileMoneyTitle: "Mobile payment",
      paymentTitle: "Premium payment",
      holderLabel: "Card holder",
      expiresLabel: "Expires",
    },
    about: {
      title: "About Us",
      text: "AMESCAO is above all a story of passion, commitment, and solidarity. Founded in 2010 by a group of visionary young people from the canton of Aouda, our association has grown to become a key player in local development. Our mission is clear: to provide every young person with the means to realize their potential and actively contribute to building a better future for our community. Through educational, cultural, health, and entrepreneurial projects, we turn challenges into opportunities and dreams into realities. Join us in this collective adventure where every action counts and every success is a shared victory.",
    },
    history: {
      title: "Our History",
      text: "The story of AMESCAO begins at the founding congress of December 29, 30 and 31, 1997 in Aouda. Inspired by the desire to unite and act for their canton, the young people decided to create a structured association, equipped with statutes and officially recognized by the Ministry of Territorial Administration. Since then, AMESCAO has multiplied its initiatives: holiday courses gathering hundreds of students, sensitization on health and prevention of STIs/HIV, youth forums, donations of school kits and birth certificates, as well as sports activities promoting cohesion. Each action testifies to the determination of members to place education, solidarity and culture at the heart of local development. Today, AMESCAO is a reference in the canton of Aouda, a mobilization engine and a symbol of hope for the youth.",
    },
    profile: {
      title: "Profile",
      editTitle: "Edit profile",
      loading: "Loading profile…",
      loadError: "Unable to load profile",
      close: "Close",
      edit: "Edit",
      save: "Save",
      cancel: "Cancel",
      nameLabel: "Last name",
      namePlaceholder: "Your last name",
      surnameLabel: "First name",
      surnamePlaceholder: "Your first name",
      emailLabel: "Email",
      emailReadonly: "Not editable",
      photoAdd: "Add your photo",
      photoEdit: "Edit your photo",
      photoRemove: "Delete photo",
      accountCardTitle: "My account",
      accountCardDescription: "Update your account information",
      themeTitle: "Theme",
      themeLightActive: "Light mode enabled",
      themeDarkActive: "Dark mode enabled",
      languageTitle: "Language",
      languageDescription: "Choose the interface language.",
      languageModalTitle: "Language",
      languageModalDescription: "Set the interface to your preferred language.",
      languageFrench: "Français",
      languageFrenchDescription: "French interface.",
      languageEnglish: "English",
      languageEnglishDescription: "English interface.",
      privacyTitle: "Privacy",
      privacyDescription: "View our privacy policy.",
      termsTitle: "Terms",
      termsDescription: "Read our terms of use.",
      logout: "Log out",
      logoutConfirmTitle: "Confirmation",
      logoutConfirmDescription: "Are you sure you want to log out?",
      logoutConfirmCancel: "Cancel",
      logoutConfirmAction: "Log out",
      roleAdmin: "Administrator",
      roleModerator: "Moderator",
      successProfileUpdated: "Profile updated",
      errorProfileUpdated: "Failed to update profile",
      errorProfileLoad: "Unable to load profile",
      successPhotoUpdated: "Photo updated",
      errorPhotoUpload: "Upload failed",
      errorLogout: "Logout failed",
      languageChangedFr: "Language set to French",
      languageChangedEn: "Language set to English",
      activeLabel: "Active",
    },
  },
};

/*
ceci est un texte très populaire


*/
