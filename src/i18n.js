import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// كائن يحوي جميع ملفات الترجمة (اللغات والمحتوى)
const resources = {
  // اللغة الإنجليزية (en) هي اللغة الافتراضية
  en: {
    translation: {
      // --- Navbar & General ---
      Home: 'Home',
      About: 'About',
      Services: 'Services',
      Contact: 'Contact',
      Login: 'Login',
      Matches: 'Matches',
      'Upload Resume': 'Upload Resume',
      Settings: 'Settings',
      Logout: 'Logout',
      'Toggle menu': 'Toggle menu',

      // --- Hero Texts ---
      'Find Your Future with Irshad': 'Find Your Future with Irshad',
      'An AI-driven pathway to professional excellence, connecting talented employees with great companies.':
        'An AI-driven pathway to professional excellence, connecting talented employees with great companies.',
      'I am a job seeker': 'I am a job seeker',
      'I am a company': 'I am a company',

      // --- Footer Texts ---
      'Guiding careers and empowering companies with the right matches':
        'Guiding careers and empowering companies with the right matches',
      'Help Links': 'Help Links',
      'About Us': 'About Us',
      'Privacy Policy': 'Privacy Policy',
      'Follow us': 'Follow us',
      Copyright: '© {{year}} Irshad. All rights reserved.', // تم تغيير النص ليقبل المتغير (year)

      // --- How It Works Texts ---
      'How It Works With Irshad': 'How It Works With Irshad',
      'Upload Your Resume Title': 'Upload Your Resume', // تم إضافة "Title" لتجنب التعارض مع زر الـ Navbar
      'Easily upload your CV in seconds.': 'Easily upload your CV in seconds.',
      'AI-Powered Watch': 'AI-Powered Watch', // تم الإبقاء على النص الأصلي كـ Key
      'Our AI scans your skills and matches you with the best opportunities.':
        'Our AI scans your skills and matches you with the best opportunities.',
      'Get Hired Faster': 'Get Hired Faster',
      'Connect directly with top companies and land your dream job.':
        'Connect directly with top companies and land your dream job.',

      // --- Featured Jobs Texts ---
      'Featured Jobs Title': 'Featured Jobs', // تم إضافة "Title" لتجنب التعارض
      'Email Marketing Specialist': 'Email Marketing Specialist',
      'Join our team as an Email Marketing specialist and help us reach millions of customers.':
        'Join our team as an Email Marketing specialist and help us reach millions of customers.',
      'Visual Designer': 'Visual Designer',
      'Work on creative projects for top brands using the latest design tools.':
        'Work on creative projects for top brands using the latest design tools.',
      'Social Media Manager': 'Social Media Manager',
      'Manage social media accounts and create engaging content for our community.':
        'Manage social media accounts and create engaging content for our community.',
      'Product Manager': 'Product Manager',
      'Lead product development and collaborate with cross-functional teams.':
        'Lead product development and collaborate with cross-functional teams.',
      'Content Writer': 'Content Writer',
      'Create compelling content for our blog and marketing materials.':
        'Create compelling content for our blog and marketing materials.',
      'Data Analyst': 'Data Analyst',
      'Analyze user data and provide insights to drive business decisions.':
        'Analyze user data and provide insights to drive business decisions.',
      'FULL TIME': 'FULL TIME',
      'PART TIME': 'PART TIME',
      FREELANCE: 'FREELANCE',
      
      // --- About Page Texts ---
      'About Irshad': 'About Irshad',
      'Your AI-driven career companion and recruitment platform':
        'Your AI-driven career companion and recruitment platform',
      'Our Mission': 'Our Mission',
      "At Irshad, we're revolutionizing the way people find jobs and companies find talent. Our AI-powered platform bridges the gap between skilled professionals and forward-thinking organizations.":
        "At Irshad, we're revolutionizing the way people find jobs and companies find talent. Our AI-powered platform bridges the gap between skilled professionals and forward-thinking organizations.",
      'We believe that everyone deserves a fulfilling career and every company deserves the right talent to grow. That\'s why we\'ve built an intelligent matching system that goes beyond keywords to understand true potential.':
        'We believe that everyone deserves a fulfilling career and every company deserves the right talent to grow. That\'s why we\'ve built an intelligent matching system that goes beyond keywords to understand true potential.',
      'What We Do': 'What We Do',
      'AI-powered job matching for precise career placement':
        'AI-powered job matching for precise career placement',
      'Resume analysis and optimization tools': 'Resume analysis and optimization tools',
      'Personalized career guidance and roadmaps': 'Personalized career guidance and roadmaps',
      'Recruitment solutions for companies': 'Recruitment solutions for companies',
      'Interview preparation and skill development': 'Interview preparation and skill development',
      'Our Values': 'Our Values',
      Precision: 'Precision',
      'Accurate AI matching for better career outcomes':
        'Accurate AI matching for better career outcomes',
      Efficiency: 'Efficiency',
      'Streamlined processes that save time and effort':
        'Streamlined processes that save time and effort',
      Trust: 'Trust',
      'Transparent and secure platform for all users':
        'Transparent and secure platform for all users',
      Innovation: 'Innovation',
      'Continuous improvement through technology': 'Continuous improvement through technology',
      'Our Team': 'Our Team',
      'Our team consists of experienced HR professionals, AI experts, and software developers dedicated to creating the best recruitment experience. We combine industry knowledge with cutting-edge technology to deliver exceptional results.':
        'Our team consists of experienced HR professionals, AI experts, and software developers dedicated to creating the best recruitment experience. We combine industry knowledge with cutting-edge technology to deliver exceptional results.',
      'Our Impact': 'Our Impact',
      'Successful Matches': 'Successful Matches',
      'Partner Companies': 'Partner Companies',
      'Satisfaction Rate': 'Satisfaction Rate',
      
      // --- Services Page Texts ---
      'Our Services': 'Our Services',
      'Discover how Irshad can help you advance your career or find the perfect talent':
        'Discover how Irshad can help you advance your career or find the perfect talent',
      'We offer a comprehensive suite of services designed to connect talent with opportunity. Whether you\'re looking for your next career move or searching for the perfect candidate, our AI-driven solutions make the process efficient and effective.':
        'We offer a comprehensive suite of services designed to connect talent with opportunity. Whether you\'re looking for your next career move or searching for the perfect candidate, our AI-driven solutions make the process efficient and effective.',
      'AI Job Matching': 'AI Job Matching',
      'Our advanced AI algorithms analyze your skills and match you with the perfect job opportunities based on compatibility, culture fit, and career growth.':
        'Our advanced AI algorithms analyze your skills and match you with the perfect job opportunities based on compatibility, culture fit, and career growth.',
      'Resume Analysis & Optimization': 'Resume Analysis & Optimization',
      'Get detailed feedback on your resume with AI-powered suggestions to improve formatting, keywords, and content for better visibility.':
        'Get detailed feedback on your resume with AI-powered suggestions to improve formatting, keywords, and content for better visibility.',
      'Career Guidance': 'Career Guidance',
      'Personalized career advice and roadmaps based on your skills, interests, and market demand.':
        'Personalized career advice and roadmaps based on your skills, interests, and market demand.',
      'Company Recruitment Solutions': 'Company Recruitment Solutions',
      'For employers: AI-powered candidate screening, automated scheduling, and analytics dashboard.':
        'For employers: AI-powered candidate screening, automated scheduling, and analytics dashboard.',
      'Interview Preparation': 'Interview Preparation',
      'Mock interviews with AI feedback, common questions, and industry-specific preparation.':
        'Mock interviews with AI feedback, common questions, and industry-specific preparation.',
      'Skill Development': 'Skill Development',
      'Recommended courses and learning paths to bridge skill gaps and enhance employability.':
        'Recommended courses and learning paths to bridge skill gaps and enhance employability.',
      'Ready to Get Started?': 'Ready to Get Started?',
      'Choose the service that fits your needs and begin your journey today':
        'Choose the service that fits your needs and begin your journey today',
      'Join as Job Seeker': 'Join as Job Seeker',
      'Join as Company': 'Join as Company',
    },
  },

  // اللغة العربية (ar) هي لغة الهدف
  ar: {
    translation: {
      // --- ترجمة Navbar & General ---
      Home: 'الرئيسية',
      About: 'عن الشركة',
      Services: 'الخدمات',
      Contact: 'اتصل بنا',
      Login: 'تسجيل الدخول',
      Matches: 'المطابقات',
      'Upload Resume': 'تحميل السيرة الذاتية',
      Settings: 'الإعدادات',
      Logout: 'تسجيل الخروج',
      'Toggle menu': 'تبديل القائمة',

      // --- ترجمة Hero ---
      'Find Your Future with Irshad': 'ابحث عن مستقبلك مع إرشاد',
      'An AI-driven pathway to professional excellence, connecting talented employees with great companies.':
        'مسار مدفوع بالذكاء الاصطناعي نحو التميز المهني، يربط الموظفين الموهوبين بالشركات الكبرى.',
      'I am a job seeker': 'أنا باحث عن عمل',
      'I am a company': 'أنا شركة',

      // --- ترجمة Footer ---
      'Guiding careers and empowering companies with the right matches':
        'توجيه المسارات المهنية وتمكين الشركات بالمطابقات الصحيحة',
      'Help Links': 'روابط المساعدة',
      'About Us': 'عن الشركة',
      'Privacy Policy': 'سياسة الخصوصية',
      'Follow us': 'تابعنا',
      Copyright: '© {{year}} إرشاد. جميع الحقوق محفوظة.',

      // --- ترجمة How It Works ---
      'How It Works With Irshad': 'كيف يعمل مع إرشاد',
      'Upload Your Resume Title': 'حمّل سيرتك الذاتية',
      'Easily upload your CV in seconds.': 'قم بتحميل سيرتك الذاتية بسهولة في ثوانٍ.',
      'AI-Powered Watch': 'مطابقة مدعومة بالذكاء الاصطناعي',
      'Our AI scans your skills and matches you with the best opportunities.':
        'يقوم الذكاء الاصطناعي الخاص بنا بمسح مهاراتك ومطابقتك بأفضل الفرص.',
      'Get Hired Faster': 'احصل على وظيفة أسرع',
      'Connect directly with top companies and land your dream job.':
        'تواصل مباشرة مع كبرى الشركات واحصل على وظيفة أحلامك.',

      // --- ترجمة Featured Jobs ---
      'Featured Jobs Title': 'وظائف مميزة',
      'Email Marketing Specialist': 'أخصائي تسويق عبر البريد الإلكتروني',
      'Join our team as an Email Marketing specialist and help us reach millions of customers.':
        'انضم إلى فريقنا كأخصائي تسويق عبر البريد الإلكتروني وساعدنا في الوصول إلى ملايين العملاء.',
      'Visual Designer': 'مصمم مرئي',
      'Work on creative projects for top brands using the latest design tools.':
        'اعمل على مشاريع إبداعية لكبرى العلامات التجارية باستخدام أحدث أدوات التصميم.',
      'Social Media Manager': 'مدير وسائل التواصل الاجتماعي',
      'Manage social media accounts and create engaging content for our community.':
        'أدر حسابات وسائل التواصل الاجتماعي وأنشئ محتوى جذاباً لمجتمعنا.',
      'Product Manager': 'مدير منتج',
      'Lead product development and collaborate with cross-functional teams.':
        'قد تطوير المنتجات وتعاون مع فرق متعددة الوظائف.',
      'Content Writer': 'كاتب محتوى',
      'Create compelling content for our blog and marketing materials.':
        'أنشئ محتوى مقنعاً لمدونتنا وموادنا التسويقية.',
      'Data Analyst': 'محلل بيانات',
      'Analyze user data and provide insights to drive business decisions.':
        'حلل بيانات المستخدم وقدم رؤى لدعم قرارات العمل.',
      'FULL TIME': 'دوام كامل',
      'PART TIME': 'دوام جزئي',
      FREELANCE: 'عمل حر',
      
      // --- ترجمة About Page ---
      'About Irshad': 'عن إرشاد',
      'Your AI-driven career companion and recruitment platform':
        'شريكك المهني ومنصة التوظيف المدعومة بالذكاء الاصطناعي',
      'Our Mission': 'مهمتنا',
      "At Irshad, we're revolutionizing the way people find jobs and companies find talent. Our AI-powered platform bridges the gap between skilled professionals and forward-thinking organizations.":
        'في إرشاد، نُحدث ثورة في طريقة عثور الأشخاص على الوظائف والشركات على المواهب. منصتنا المدعومة بالذكاء الاصطناعي تسد الفجوة بين المحترفين المهرة والمؤسسات التقدمية.',
      'We believe that everyone deserves a fulfilling career and every company deserves the right talent to grow. That\'s why we\'ve built an intelligent matching system that goes beyond keywords to understand true potential.':
        'نؤمن بأن الجميع يستحقون مسيرة مهنية مُرضية، وأن كل شركة تستحق الموهبة المناسبة للنمو. لهذا، قمنا ببناء نظام مطابقة ذكي يتجاوز الكلمات المفتاحية لفهم الإمكانات الحقيقية.',
      'What We Do': 'ماذا نقدم',
      'AI-powered job matching for precise career placement':
        'مطابقة وظيفية مدعومة بالذكاء الاصطناعي لتوجيه مهني دقيق',
      'Resume analysis and optimization tools': 'أدوات تحليل وتحسين السيرة الذاتية',
      'Personalized career guidance and roadmaps': 'إرشاد وظيفي وخرائط طريق مخصصة',
      'Recruitment solutions for companies': 'حلول توظيف للشركات',
      'Interview preparation and skill development': 'الإعداد للمقابلات وتطوير المهارات',
      'Our Values': 'قيمنا',
      Precision: 'الدقة',
      'Accurate AI matching for better career outcomes':
        'مطابقة دقيقة بالذكاء الاصطناعي لنتائج وظيفية أفضل',
      Efficiency: 'الكفاءة',
      'Streamlined processes that save time and effort':
        'عمليات مُبسطة توفر الوقت والجهد',
      Trust: 'الثقة',
      'Transparent and secure platform for all users':
        'منصة شفافة وآمنة لجميع المستخدمين',
      Innovation: 'الابتكار',
      'Continuous improvement through technology': 'تحسين مستمر عبر التكنولوجيا',
      'Our Team': 'فريقنا',
      'Our team consists of experienced HR professionals, AI experts, and software developers dedicated to creating the best recruitment experience. We combine industry knowledge with cutting-edge technology to deliver exceptional results.':
        'يتكون فريقنا من محترفي موارد بشرية وخبراء ذكاء اصطناعي ومطوري برامج مكرسين لتقديم أفضل تجربة توظيف. نجمع بين المعرفة الصناعية والتكنولوجيا المتطورة لتقديم نتائج استثنائية.',
      'Our Impact': 'تأثيرنا',
      'Successful Matches': 'عمليات مطابقة ناجحة',
      'Partner Companies': 'شركات شريكة',
      'Satisfaction Rate': 'نسبة الرضا',
      
      // --- ترجمة Services Page ---
      'Our Services': 'خدماتنا',
      'Discover how Irshad can help you advance your career or find the perfect talent':
        'اكتشف كيف يمكن لإرشاد مساعدتك في تطوير مسيرتك المهنية أو العثور على الموهبة المثالية',
      'We offer a comprehensive suite of services designed to connect talent with opportunity. Whether you\'re looking for your next career move or searching for the perfect candidate, our AI-driven solutions make the process efficient and effective.':
        'نقدم مجموعة شاملة من الخدمات المصممة لربط الموهبة بالفرصة. سواء كنت تبحث عن خطوتك المهنية التالية أو عن المرشح المثالي، فإن حلولنا المدعومة بالذكاء الاصطناعي تجعل العملية فعالة ومؤثرة.',
      'AI Job Matching': 'مطابقة الوظائف بالذكاء الاصطناعي',
      'Our advanced AI algorithms analyze your skills and match you with the perfect job opportunities based on compatibility, culture fit, and career growth.':
        'تقوم خوارزميات الذكاء الاصطناعي المتقدمة لدينا بتحليل مهاراتك ومطابقتك بفرص العمل المثالية بناءً على التوافق، التوافق الثقافي، والنمو المهني.',
      'Resume Analysis & Optimization': 'تحليل وتحسين السيرة الذاتية',
      'Get detailed feedback on your resume with AI-powered suggestions to improve formatting, keywords, and content for better visibility.':
        'احصل على ملاحظات مفصلة حول سيرتك الذاتية مع اقتراحات مدعومة بالذكاء الاصطناعي لتحسين التنسيق، الكلمات المفتاحية، والمحتوى لزيادة الظهور.',
      'Career Guidance': 'الإرشاد المهني',
      'Personalized career advice and roadmaps based on your skills, interests, and market demand.':
        'نصيحة مهنية وخرائط طريق مخصصة بناءً على مهاراتك، اهتماماتك، وطلب السوق.',
      'Company Recruitment Solutions': 'حلول التوظيف للشركات',
      'For employers: AI-powered candidate screening, automated scheduling, and analytics dashboard.':
        'لأصحاب العمل: فحص المرشحين بالذكاء الاصطناعي، جدولة تلقائية، ولوحة تحكم للتحليلات.',
      'Interview Preparation': 'الإعداد للمقابلة',
      'Mock interviews with AI feedback, common questions, and industry-specific preparation.':
        'مقابلات وهمية مع ملاحظات من الذكاء الاصطناعي، أسئلة شائعة، وإعداد خاص بالصناعة.',
      'Skill Development': 'تطوير المهارات',
      'Recommended courses and learning paths to bridge skill gaps and enhance employability.':
        'دورات موصى بها ومسارات تعليمية لسد فجوات المهارات وتعزيز قابلية التوظيف.',
      'Ready to Get Started?': 'هل أنت مستعد للبدء؟',
      'Choose the service that fits your needs and begin your journey today':
        'اختر الخدمة التي تناسب احتياجاتك وابدأ رحلتك اليوم',
      'Join as Job Seeker': 'انضم كباحث عن عمل',
      'Join as Company': 'انضم كشركة',
    },
  },
};

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources,
    fallbackLng: 'en',
    defaultNS: 'translation',
    detection: {
      order: ['queryString', 'cookie', 'localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage', 'cookie'],
    },
    interpolation: {
      escapeValue: false,
    },
    // تحديد اتجاه النص (Right-to-Left) للغة العربية
    // يمكن استخدام i18n.dir(i18n.language) في المكونات لتطبيق RTL/LTR
  });

export default i18n;