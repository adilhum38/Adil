
import React, { createContext, useState, useContext, ReactNode } from 'react';

export type Language = 'en' | 'kk' | 'ru';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    nav: {
      home: 'Community',
      jobs: 'Find Work',
      freelancers: 'Find Talent',
      dashboard: 'Market Stats',
      profile: 'Profile',
      messages: 'Messages',
      login: 'Log In',
      logout: 'Log Out'
    },
    auth: {
        signInTitle: "Sign In",
        createAccount: "Create Account",
        welcomeBack: "Welcome back to Freelance Hub KZ",
        joinCommunity: "Join the creative community",
        fullName: "Full Name",
        email: "Email Address",
        password: "Password",
        iAmFreelancer: "I am a Freelancer",
        iAmClient: "I am a Client",
        signIn: "Sign In",
        signUp: "Sign Up",
        needAccount: "Need an account? Sign up",
        haveAccount: "Already have an account? Sign in"
    },
    hero: {
      titlePrefix: "Kazakhstan's Premier",
      titleHighlight: "Creative Hub",
      subtitle: "Connect with top-tier videographers, designers, and SMM specialists in Almaty, Astana, and beyond. The unified platform for the creative economy.",
      findTalent: "Find Talent",
      findWork: "Find Work"
    },
    community: {
      feedTitle: "Community Feed",
      whatsHappening: "What's happening in the creative world?",
      post: "Post",
      trendingTitle: "Top Specialists of the Week",
      trendingSubtitle: "Trending based on activity",
      loginToPost: "Log in to post updates",
      projects: "projects",
      follow: "Follow",
      edit: "Edit",
      delete: "Delete",
      confirmDelete: "Are you sure you want to delete this post?",
      comment: "Comment",
      send: "Send"
    },
    jobs: {
      headerTitle: "Creative Jobs in Kazakhstan",
      headerSubtitle: "Browse the latest opportunities in video, design, and marketing.",
      postJob: "Post a Job",
      filters: "Filters",
      city: "City",
      category: "Category",
      allCities: "All Cities",
      allCategories: "All Categories",
      noJobs: "No jobs found matching your filters.",
      fixedPrice: "Fixed Price",
      posted: "Posted:",
      apply: "Apply Now",
      createTitle: "Post a New Job",
      jobTitleLabel: "Job Title",
      descLabel: "Description",
      autoWrite: "Auto-write with AI",
      generating: "Generating...",
      publish: "Publish Job",
      enterTitleReq: "Please enter a title first"
    },
    directory: {
      title: "Discover Creators",
      subtitle: "The best creative portfolios in Kazakhstan",
      searchPlaceholder: "Search @username, skill, or role...",
      viewProfile: "View Profile",
      rating: "Rating",
      works: "Works",
      hireFor: "Hire for",
      message: "Message",
      clients: "Clients & Cases",
      portfolioTab: "Portfolio",
      reviewsTab: "Reviews",
      noReviews: "No reviews yet."
    },
    dashboard: {
      title: "Market Analytics",
      subtitle: "Real-time data on the creative industry in Kazakhstan.",
      aiTitle: "Gemini Market Insight",
      loading: "Loading market insights...",
      demandChart: "Demand vs Supply by Category",
      geoChart: "Freelancers by City",
      seasonalChart: "Activity by Season (Projects)",
      avgRate: "Avg. Hourly Rate (Video)",
      activeProjects: "Active Projects",
      newFreelancers: "New Freelancers (This Week)",
      demandLabel: "Job Demand",
      supplyLabel: "Freelancers"
    },
    profile: {
      edit: "Edit Profile",
      available: "Available for work",
      about: "About Me",
      improveAi: "Improve with Gemini AI",
      optimizing: "Optimizing...",
      skills: "Skills",
      email: "Email",
      phone: "Phone",
      save: "Save Changes",
      portfolio: "Portfolio Management",
      addItem: "Add Project",
      projectTitle: "Project Title",
      projectType: "Content Type",
      projectUrl: "Image/Video URL",
      remove: "Remove",
      image: "Image",
      video: "Video",
      noItems: "Your portfolio is empty. Add your first work!"
    }
  },
  kk: {
    nav: {
      home: 'Қауымдастық',
      jobs: 'Жұмыс',
      freelancers: 'Мамандар',
      dashboard: 'Статистика',
      profile: 'Профиль',
      messages: 'Хабарламалар',
      login: 'Кіру',
      logout: 'Шығу'
    },
    auth: {
        signInTitle: "Кіру",
        createAccount: "Тіркелу",
        welcomeBack: "Қайта қош келдіңіз",
        joinCommunity: "Қауымдастыққа қосылыңыз",
        fullName: "Аты-жөні",
        email: "Email пошта",
        password: "Құпия сөз",
        iAmFreelancer: "Мен Фрилансермін",
        iAmClient: "Мен Тапсырыс берушімін",
        signIn: "Кіру",
        signUp: "Тіркелу",
        needAccount: "Аккаунт керек пе? Тіркелу",
        haveAccount: "Аккаунт бар ма? Кіру"
    },
    hero: {
      titlePrefix: "Қазақстандағы Басты",
      titleHighlight: "Креативті Хаб",
      subtitle: "Алматы, Астана және басқа қалалардағы үздік видеографтармен, дизайнерлермен және SMM мамандарымен байланысыңыз.",
      findTalent: "Маман іздеу",
      findWork: "Жұмыс іздеу"
    },
    community: {
      feedTitle: "Қауымдастық Лентасы",
      whatsHappening: "Креативті әлемде не жаңалық?",
      post: "Жариялау",
      trendingTitle: "Аптаның үздік мамандары",
      trendingSubtitle: "Белсенділік бойынша трендте",
      loginToPost: "Жазу үшін жүйеге кіріңіз",
      projects: "жоба",
      follow: "Жазылу",
      edit: "Өңдеу",
      delete: "Өшіру",
      confirmDelete: "Бұл жазбаны өшіргіңіз келетініне сенімдісіз бе?",
      comment: "Пікір",
      send: "Жіберу"
    },
    jobs: {
      headerTitle: "Қазақстандағы Креативті Жұмыстар",
      headerSubtitle: "Видео, дизайн және маркетинг саласындағы соңғы мүмкіндіктер.",
      postJob: "Жұмыс жариялау",
      filters: "Фильтрлер",
      city: "Қала",
      category: "Санат",
      allCities: "Барлық қалалар",
      allCategories: "Барлық санаттар",
      noJobs: "Сіздің сұранысыңыз бойынша жұмыс табылмады.",
      fixedPrice: "Бекітілген баға",
      posted: "Жарияланды:",
      apply: "Өтінім беру",
      createTitle: "Жаңа жұмыс жариялау",
      jobTitleLabel: "Жұмыс атауы",
      descLabel: "Сипаттама",
      autoWrite: "AI көмегімен жазу",
      generating: "Жазылуда...",
      publish: "Жариялау",
      enterTitleReq: "Алдымен тақырыпты енгізіңіз"
    },
    directory: {
      title: "Мамандарды Іздеу",
      subtitle: "Қазақстандағы ең үздік креативті портфолиолар",
      searchPlaceholder: "@username, дағды немесе рөл бойынша іздеу...",
      viewProfile: "Профильді көру",
      rating: "Рейтинг",
      works: "Жобалар",
      hireFor: "Сағатына",
      message: "Хабарлама",
      clients: "Клиенттер мен Кейстер",
      portfolioTab: "Портфолио",
      reviewsTab: "Пікірлер",
      noReviews: "Әзірге пікірлер жоқ."
    },
    dashboard: {
      title: "Нарық Аналитикасы",
      subtitle: "Қазақстандағы креативті индустрия бойынша нақты деректер.",
      aiTitle: "Gemini Нарық Шолуы",
      loading: "Нарық деректері жүктелуде...",
      demandChart: "Сұраныс пен Ұсыныс",
      geoChart: "Қалалар бойынша мамандар",
      seasonalChart: "Маусымдық белсенділік (Жобалар)",
      avgRate: "Орт. сағаттық баға (Видео)",
      activeProjects: "Белсенді жобалар",
      newFreelancers: "Жаңа мамандар (Осы аптада)",
      demandLabel: "Сұраныс",
      supplyLabel: "Мамандар"
    },
    profile: {
      edit: "Өңдеу",
      available: "Жұмысқа дайын",
      about: "Мен туралы",
      improveAi: "Gemini AI-мен жақсарту",
      optimizing: "Оңтайландыру...",
      skills: "Дағдылар",
      email: "Email",
      phone: "Телефон",
      save: "Сақтау",
      portfolio: "Портфолионы басқару",
      addItem: "Жоба қосу",
      projectTitle: "Жоба атауы",
      projectType: "Мазмұн түрі",
      projectUrl: "Сурет/Видео сілтемесі",
      remove: "Өшіру",
      image: "Сурет",
      video: "Видео",
      noItems: "Портфолиоңыз бос. Бірінші жұмысыңызды қосыңыз!"
    }
  },
  ru: {
    nav: {
      home: 'Комьюнити',
      jobs: 'Работа',
      freelancers: 'Специалисты',
      dashboard: 'Статистика',
      profile: 'Профиль',
      messages: 'Сообщения',
      login: 'Войти',
      logout: 'Выйти'
    },
    auth: {
        signInTitle: "Вход",
        createAccount: "Регистрация",
        welcomeBack: "С возвращением",
        joinCommunity: "Присоединяйтесь к сообществу",
        fullName: "Имя Фамилия",
        email: "Электронная почта",
        password: "Пароль",
        iAmFreelancer: "Я Фрилансер",
        iAmClient: "Я Клиент",
        signIn: "Войти",
        signUp: "Зарегистрироваться",
        needAccount: "Нет аккаунта? Регистрация",
        haveAccount: "Есть аккаунт? Войти"
    },
    hero: {
      titlePrefix: "Главный Креативный",
      titleHighlight: "Хаб Казахстана",
      subtitle: "Объединяем лучших видеографов, дизайнеров и SMM-специалистов в Алматы, Астане и по всей стране.",
      findTalent: "Найти специалиста",
      findWork: "Найти работу"
    },
    community: {
      feedTitle: "Лента сообщества",
      whatsHappening: "Что происходит в сфере креатива?",
      post: "Опубликовать",
      trendingTitle: "Топ специалисты недели",
      trendingSubtitle: "В тренде по активности",
      loginToPost: "Войдите, чтобы писать",
      projects: "проектов",
      follow: "Подписаться",
      edit: "Изменить",
      delete: "Удалить",
      confirmDelete: "Вы уверены, что хотите удалить эту ветку?",
      comment: "Комментарий",
      send: "Отправить"
    },
    jobs: {
      headerTitle: "Креативные вакансии в Казахстане",
      headerSubtitle: "Свежие вакансии в сфере видео, дизайна и маркетинга.",
      postJob: "Разместить заказ",
      filters: "Фильтры",
      city: "Город",
      category: "Категория",
      allCities: "Все города",
      allCategories: "Все категории",
      noJobs: "Вакансии не найдены.",
      fixedPrice: "Фиксированная цена",
      posted: "Опубликовано:",
      apply: "Откликнуться",
      createTitle: "Создать новый заказ",
      jobTitleLabel: "Название",
      descLabel: "Описание",
      autoWrite: "Написать с AI",
      generating: "Генерация...",
      publish: "Опубликовать",
      enterTitleReq: "Пожалуйста, введите название"
    },
    directory: {
      title: "Каталог Креаторов",
      subtitle: "Лучшие портфолио Казахстана",
      searchPlaceholder: "Поиск по @username, навыкам...",
      viewProfile: "Профиль",
      rating: "Рейтинг",
      works: "Работы",
      hireFor: "Нанять за",
      message: "Написать",
      clients: "Клиенты и Кейсы",
      portfolioTab: "Portfolio",
      reviewsTab: "Отзывы",
      noReviews: "Отзывов пока нет."
    },
    dashboard: {
      title: "Аналитика Рынка",
      subtitle: "Данные о креативной индустрии Казахстана в реальном времени.",
      aiTitle: "Инсайт от Gemini",
      loading: "Загрузка данных...",
      demandChart: "Спрос и Предложение",
      geoChart: "Фрилансеры по городам",
      seasonalChart: "Активность по месяцам (Проекты)",
      avgRate: "Средняя ставка (Видео)",
      activeProjects: "Активные проекты",
      newFreelancers: "Новые фрилансеры (на этой неделе)",
      demandLabel: "Спрос",
      supplyLabel: "Фрилансеры"
    },
    profile: {
      edit: "Редактировать",
      available: "Готов к работе",
      about: "Обо мне",
      improveAi: "Улучшить с Gemini AI",
      optimizing: "Улучшение...",
      skills: "Навыки",
      email: "Email",
      phone: "Телефон",
      save: "Сохранить",
      portfolio: "Управление портфолио",
      addItem: "Добавить проект",
      projectTitle: "Название проекта",
      projectType: "Тип контента",
      projectUrl: "URL картинки/видео",
      remove: "Удалить",
      image: "Картинка",
      video: "Видео",
      noItems: "Ваше портфолио пусто. Добавьте свою первую работу!"
    }
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (path: string) => {
    const keys = path.split('.');
    // @ts-ignore - simple dynamic access
    let current = translations[language];
    for (const key of keys) {
      // @ts-ignore
      if (current[key] === undefined) return path;
      // @ts-ignore
      current = current[key];
    }
    return current as unknown as string;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
