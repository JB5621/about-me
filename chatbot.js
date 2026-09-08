// ============================================================
// Ask-About-Me bot
// ------------------------------------------------------------
// A self-contained assistant that answers questions about
// Jemshit. No API, no key, no backend — the knowledge base
// below is the single source of truth, and every answer comes
// straight out of it, so the bot can never invent a fact.
//
// It speaks the three languages the site speaks and follows the
// EN / TM / RU switch by watching <html lang>, so nothing in
// script.js has to know it exists.
//
// Adding an answer = adding one entry to INTENTS.
// ============================================================
(function () {
    'use strict';

    // ------------------------------------------------------------
    // 1. Facts — everything the bot is allowed to say
    // ------------------------------------------------------------
    const FACTS = {
        email: 'genoszaz61@gmail.com',
        phone: '+993 61527304',
        github: 'https://github.com/JB5621',
        telegram: 'https://t.me/jb5622'
    };

    // ------------------------------------------------------------
    // 2. Interface copy
    // ------------------------------------------------------------
    const UI = {
        en: {
            open: 'Ask about Jemshit',
            close: 'Close chat',
            title: 'Ask about Jemshit',
            status: 'Usually replies instantly',
            placeholder: 'Ask about skills, projects, contact…',
            send: 'Send',
            reset: 'Clear the conversation',
            typing: 'Typing…',
            chips: ['What are his skills?', 'Show me his projects', 'Is he available for hire?', 'How do I contact him?']
        },
        tk: {
            open: 'Jemşit hakynda soraň',
            close: 'Söhbetdeşligi ýap',
            title: 'Jemşit hakynda soraň',
            status: 'Adatça bada-bat jogap berýär',
            placeholder: 'Başarnyklar, taslamalar, habarlaşmak…',
            send: 'Ibermek',
            reset: 'Söhbetdeşligi arassala',
            typing: 'Ýazýar…',
            chips: ['Başarnyklary nähili?', 'Taslamalaryny görkez', 'Işe açykmy?', 'Nädip habarlaşmaly?']
        },
        ru: {
            open: 'Спросить о Джемшите',
            close: 'Закрыть чат',
            title: 'Спросить о Джемшите',
            status: 'Обычно отвечает сразу',
            placeholder: 'Навыки, проекты, контакты…',
            send: 'Отправить',
            reset: 'Очистить переписку',
            typing: 'Печатает…',
            chips: ['Какие у него навыки?', 'Покажи проекты', 'Он открыт для работы?', 'Как с ним связаться?']
        }
    };

    // ------------------------------------------------------------
    // 3. Knowledge base
    // `keys` are matched against the question in every language at
    // once — someone can ask in English while the page is in Russian.
    // `answer` is picked in the language the page is currently in.
    // Short keys are matched on word boundaries, longer ones as
    // stems, which is what makes Turkmen and Russian endings work.
    // ------------------------------------------------------------
    const INTENTS = [
        {
            id: 'greeting',
            keys: ['hello', 'hi', 'hey', 'good morning', 'good evening', 'how are you', 'salam', 'salawmaleykum', 'privet', 'привет', 'здравству', 'добрый день', 'добрый вечер', 'салам'],
            answer: {
                en: "Hi! 👋 I'm the assistant for this portfolio. Ask me about Jemshit's skills, experience, projects, or how to get in touch.",
                tk: 'Salam! 👋 Men şu portfolionyň kömekçisi. Jemşidiň başarnyklary, tejribesi, taslamalary ýa-da habarlaşmak barada soraň.',
                ru: 'Привет! 👋 Я ассистент этого портфолио. Спросите меня о навыках, опыте, проектах Джемшита или о том, как с ним связаться.'
            }
        },
        {
            id: 'who',
            keys: ['who is', 'who are', 'about him', 'about jemshit', 'his name', 'introduce', 'kim', 'hakynda', 'tanyşdyr', 'кто такой', 'кто он', 'о нём', 'о нем', 'расскажи о', 'представь'],
            answer: {
                en: 'Jemshit Berdinyyazow is a Mid-Level Front-End Developer based in Mary, Turkmenistan. He builds fast, responsive and accessible web interfaces with React, JavaScript and modern CSS.',
                tk: 'Jemşit Berdinýyazow — Mary, Türkmenistanda ýaşaýan orta derejeli Front-End işläp düzüji. Ol React, JavaScript we häzirki zaman CSS bilen çalt, uýgunlaşýan we elýeterli web interfeýslerini döredýär.',
                ru: 'Джемшит Бердиньязов — Front-End разработчик среднего уровня из Мары, Туркменистан. Он создаёт быстрые, адаптивные и доступные веб-интерфейсы на React, JavaScript и современном CSS.'
            }
        },
        {
            id: 'role',
            keys: ['what does he do', 'what do you do', 'his job', 'his role', 'profession', 'occupation', 'position', 'developer', 'näme iş', 'käri', 'wezipe', 'işläp düzüji', 'чем занимается', 'кем работает', 'профессия', 'должность', 'разработчик'],
            answer: {
                en: 'He works as a Mid-Level Front-End Developer — turning designs into fast, responsive interfaces, mostly with React, JavaScript and modern CSS.',
                tk: 'Ol orta derejeli Front-End işläp düzüji bolup işleýär — dizaýnlary köplenç React, JavaScript we häzirki zaman CSS bilen çalt, uýgunlaşýan interfeýslere öwürýär.',
                ru: 'Он работает Front-End разработчиком среднего уровня — превращает дизайн в быстрые адаптивные интерфейсы, в основном на React, JavaScript и современном CSS.'
            }
        },
        {
            id: 'skills',
            keys: ['skill', 'stack', 'technolog', 'what can he', 'what does he know', 'knows', 'expertise', 'başarnyk', 'tehnolog', 'bilýär', 'навык', 'умеет', 'знает', 'технолог', 'стек'],
            answer: {
                en: 'Front-end: HTML5 (95%), CSS3 (90%), JavaScript (88%) and React (85%). Tools: Git (90%), Bootstrap (90%), npm/Yarn (85%), REST APIs (85%) and Tailwind (82%). He is also learning Node.js, MySQL, Docker and Nginx.',
                tk: 'Frontend: HTML5 (95%), CSS3 (90%), JavaScript (88%) we React (85%). Gurallar: Git (90%), Bootstrap (90%), npm/Yarn (85%), REST API (85%) we Tailwind (82%). Şeýle hem Node.js, MySQL, Docker we Nginx öwrenýär.',
                ru: 'Front-end: HTML5 (95%), CSS3 (90%), JavaScript (88%) и React (85%). Инструменты: Git (90%), Bootstrap (90%), npm/Yarn (85%), REST API (85%) и Tailwind (82%). Также осваивает Node.js, MySQL, Docker и Nginx.'
            }
        },
        {
            id: 'react',
            keys: ['react', 'redux', 'hooks', 'jsx', 'реакт', 'редакс'],
            answer: {
                en: 'React is his main framework — he rates himself at 85% and has used it on most of his work: the e-commerce platform (with Redux), the task manager, the finance dashboard and a design system.',
                tk: 'React onuň esasy freýmworky — özüni 85% diýip belleýär we işleriniň köpüsinde ulandy: elektron söwda platformasy (Redux bilen), iş dolandyryş programmasy, maliýe paneli we dizaýn ulgamy.',
                ru: 'React — его основной фреймворк, он оценивает себя на 85% и использовал его в большинстве работ: платформа электронной коммерции (с Redux), таск-менеджер, финансовая панель и дизайн-система.'
            }
        },
        {
            id: 'backend',
            keys: ['backend', 'back-end', 'node', 'mysql', 'database', 'docker', 'nginx', 'server', 'sql', 'maglumat bazasy', 'serwer', 'бэкенд', 'бекенд', 'база данных', 'сервер', 'нода'],
            answer: {
                en: 'Back-end is his growing edge rather than his strength: Node.js (40%), MySQL (35%), Docker (35%) and Nginx (30%). He is comfortable consuming REST APIs (85%) from the front end.',
                tk: 'Backend onuň güýçli tarapy däl-de, öwrenýän ugry: Node.js (40%), MySQL (35%), Docker (35%) we Nginx (30%). Frontend tarapdan REST API bilen işlemek (85%) oňa amatly.',
                ru: 'Бэкенд — скорее зона роста, чем сильная сторона: Node.js (40%), MySQL (35%), Docker (35%) и Nginx (30%). При этом он уверенно работает с REST API (85%) со стороны фронтенда.'
            }
        },
        {
            id: 'design',
            keys: ['design', 'ui/ux', 'figma', 'css', 'tailwind', 'bootstrap', 'animation', 'responsive', 'dizaýn', 'animasiýa', 'дизайн', 'вёрстк', 'верстк', 'анимац', 'адаптив'],
            answer: {
                en: 'CSS is one of his strongest areas (90%), plus Bootstrap (90%) and Tailwind (82%). This very site is his showcase: a custom design system, dual light/dark themes, 3D card tilts and a projected particle field — all hand-written, no UI library.',
                tk: 'CSS onuň iň güýçli taraplarynyň biri (90%), şeýle hem Bootstrap (90%) we Tailwind (82%). Şu sahypanyň özi mysal: öz dizaýn ulgamy, açyk/goýy tema, 3D kart egrelmeleri we bölejik meýdany — hemmesi elde ýazyldy, UI kitaphanasyz.',
                ru: 'CSS — одна из его сильнейших сторон (90%), плюс Bootstrap (90%) и Tailwind (82%). Сам этот сайт — его витрина: собственная дизайн-система, светлая и тёмная темы, 3D-наклон карточек и поле частиц — всё написано вручную, без UI-библиотек.'
            }
        },
        {
            id: 'experience',
            keys: ['experience', 'how long', 'years', 'senior', 'junior', 'level', 'career', 'tejribe', 'näçe ýyl', 'ýyl işle', 'derej', 'опыт', 'сколько лет', 'стаж', 'уровень', 'карьер'],
            answer: {
                en: '1+ years of professional experience, 10+ completed projects and 5+ clients worldwide. He describes himself as mid-level.',
                tk: '1+ ýyl hünär tejribesi, 10+ tamamlanan taslama we dünýäde 5+ müşderi. Özüni orta derejeli hasaplaýar.',
                ru: 'Более 1 года профессионального опыта, 10+ завершённых проектов и 5+ клиентов по всему миру. Себя он определяет как специалиста среднего уровня.'
            }
        },
        {
            id: 'project_ecommerce',
            keys: ['e-commerce', 'ecommerce', 'commerce', 'online store', 'shop', 'cart', 'checkout', 'payment', 'söwda', 'dükan', 'sebet', 'töleg', 'магазин', 'коммерц', 'корзин', 'оплат'],
            answer: {
                en: 'E-Commerce Platform — a full-featured online store with cart, checkout and payment integration. Built with React, Redux and Node.js.',
                tk: 'Elektron söwda platformasy — sebedi, sargyt resmileşdirmegi we töleg ulgamy bolan doly hukukly onlaýn dükan. React, Redux we Node.js bilen ýasaldy.',
                ru: 'Платформа электронной коммерции — полноценный интернет-магазин с корзиной, оформлением заказа и интеграцией оплаты. Сделан на React, Redux и Node.js.'
            }
        },
        {
            id: 'project_tasks',
            keys: ['task manage', 'task app', 'todo', 'to-do', 'kanban', 'drag', 'firebase', 'iş dolandyryş', 'meýilnama', 'таск', 'задач', 'канбан'],
            answer: {
                en: 'Task Management App — a collaborative task manager with real-time updates and drag-and-drop. Built with React, Firebase and Node.js.',
                tk: 'Iş dolandyryş programmasy — real wagtda täzelenýän we süýşürip goýup bolýan bilelikdäki iş meýilnamalaýjy. React, Firebase we Node.js bilen ýasaldy.',
                ru: 'Приложение для управления задачами — совместный таск-менеджер с обновлениями в реальном времени и drag-and-drop. Сделан на React, Firebase и Node.js.'
            }
        },
        {
            id: 'project_dashboard',
            keys: ['dashboard', 'finance', 'chart', 'analytic', 'data visual', 'maliýe', 'panel', 'grafik', 'дашборд', 'финанс', 'график', 'аналитик', 'панель'],
            answer: {
                en: 'Finance Dashboard — an interactive dashboard with charts and data visualisation. Built with React, Chart.js and Tailwind.',
                tk: 'Maliýe paneli — grafikler we maglumat şekillendirmesi bolan interaktiw panel. React, Chart.js we Tailwind bilen ýasaldy.',
                ru: 'Финансовая панель — интерактивный дашборд с графиками и визуализацией данных. Сделан на React, Chart.js и Tailwind.'
            }
        },
        {
            id: 'project_restaurant',
            keys: ['restaurant', 'landing page', 'menu', 'reservation', 'restoran', 'menýu', 'ресторан', 'лендинг', 'меню', 'бронир'],
            answer: {
                en: 'Restaurant Website — an elegant restaurant site with menu, reservations and a gallery. Built with plain HTML5, CSS3 and JavaScript.',
                tk: 'Restoran web sahypasy — menýusy, ýer belletmegi we galereýasy bolan nepis restoran sahypasy. Arassa HTML5, CSS3 we JavaScript bilen ýasaldy.',
                ru: 'Сайт ресторана — элегантный сайт с меню, бронированием и галереей. Сделан на чистом HTML5, CSS3 и JavaScript.'
            }
        },
        {
            id: 'project_designsystem',
            keys: ['design system', 'component library', 'storybook', 'dizaýn ulgamy', 'komponent', 'дизайн-систем', 'дизайн систем', 'библиотек компонент', 'сторибук'],
            answer: {
                en: 'Design System — a comprehensive UI component library with documentation. Built with React, Storybook and CSS-in-JS.',
                tk: 'Dizaýn ulgamy — resminamasy bolan giňişleýin UI komponent kitaphanasy. React, Storybook we CSS-in-JS bilen ýasaldy.',
                ru: 'Дизайн-система — обширная библиотека UI-компонентов с документацией. Сделана на React, Storybook и CSS-in-JS.'
            }
        },
        {
            id: 'projects',
            keys: ['project', 'portfolio', 'work', 'built', 'made', 'case stud', 'taslama', 'işle', 'ýasa', 'проект', 'работ', 'портфолио', 'сдела'],
            answer: {
                en: 'Five featured projects:\n• E-Commerce Platform — React, Redux, Node.js\n• Task Management App — React, Firebase, Node.js\n• Finance Dashboard — React, Chart.js, Tailwind\n• Restaurant Website — HTML5, CSS3, JavaScript\n• Design System — React, Storybook, CSS-in-JS\nAsk about any one of them for the details.',
                tk: 'Saýlanan bäş taslama:\n• Elektron söwda platformasy — React, Redux, Node.js\n• Iş dolandyryş programmasy — React, Firebase, Node.js\n• Maliýe paneli — React, Chart.js, Tailwind\n• Restoran web sahypasy — HTML5, CSS3, JavaScript\n• Dizaýn ulgamy — React, Storybook, CSS-in-JS\nHer biri hakda giňişleýin soraberiň.',
                ru: 'Пять избранных проектов:\n• Платформа электронной коммерции — React, Redux, Node.js\n• Приложение для задач — React, Firebase, Node.js\n• Финансовая панель — React, Chart.js, Tailwind\n• Сайт ресторана — HTML5, CSS3, JavaScript\n• Дизайн-система — React, Storybook, CSS-in-JS\nСпросите о любом из них подробнее.'
            },
            links: [{ label: { en: 'See the projects', tk: 'Taslamalary gör', ru: 'Смотреть проекты' }, href: '#projects' },
                    { label: { en: 'GitHub', tk: 'GitHub', ru: 'GitHub' }, href: FACTS.github }]
        },
        {
            id: 'hire',
            keys: ['available', 'availab', 'hire', 'hiring', 'freelance', 'full-time', 'full time', 'job', 'vacancy', 'open to work', 'collaborat', 'work together', 'açyk', 'işe al', 'frilans', 'bilelikde işle', 'свободен', 'открыт', 'нанять', 'нанима', 'фриланс', 'работу', 'ваканс', 'сотруднич'],
            answer: {
                en: 'Yes — he is currently available for freelance work and full-time positions. The fastest way to start a conversation is Telegram or email.',
                tk: 'Hawa — häzirki wagtda frilans işlere we doly iş güni wezipelerine açyk. Iň çalt ýol — Telegram ýa-da e-poçta.',
                ru: 'Да — сейчас он открыт для фриланс-заказов и работы на полную занятость. Быстрее всего написать в Telegram или на почту.'
            },
            links: [{ label: { en: 'Telegram', tk: 'Telegram', ru: 'Telegram' }, href: FACTS.telegram },
                    { label: { en: 'Email him', tk: 'E-poçta ýaz', ru: 'Написать на почту' }, href: 'mailto:' + FACTS.email }]
        },
        {
            id: 'email',
            keys: ['email', 'e-mail', 'mail', 'poçta', 'poçtasy', 'почт', 'мейл', 'майл'],
            answer: {
                en: 'His email is ' + FACTS.email + '. There is also a contact form at the bottom of this page.',
                tk: 'E-poçtasy: ' + FACTS.email + '. Şeýle hem sahypanyň aşagynda habarlaşmak formasy bar.',
                ru: 'Его почта: ' + FACTS.email + '. Внизу страницы также есть форма обратной связи.'
            },
            links: [{ label: { en: 'Email him', tk: 'E-poçta ýaz', ru: 'Написать на почту' }, href: 'mailto:' + FACTS.email }]
        },
        {
            id: 'phone',
            keys: ['phone', 'call', 'number', 'whatsapp', 'telefon', 'jaň', 'belgi', 'телефон', 'позвонить', 'номер', 'ватсап'],
            answer: {
                en: 'His phone number is ' + FACTS.phone + '.',
                tk: 'Telefon belgisi: ' + FACTS.phone + '.',
                ru: 'Его номер телефона: ' + FACTS.phone + '.'
            },
            links: [{ label: { en: 'Call', tk: 'Jaň et', ru: 'Позвонить' }, href: 'tel:+99361527304' }]
        },
        {
            id: 'telegram',
            keys: ['telegram', 'message him', 'dm', 'chat with him', 'ýaz', 'телеграм', 'телега', 'написать ему'],
            answer: {
                en: 'Telegram is the quickest way to reach him: @jb5622.',
                tk: 'Oňa ýetmegiň iň çalt ýoly — Telegram: @jb5622.',
                ru: 'Быстрее всего с ним связаться в Telegram: @jb5622.'
            },
            links: [{ label: { en: 'Open Telegram', tk: 'Telegramy aç', ru: 'Открыть Telegram' }, href: FACTS.telegram }]
        },
        {
            id: 'github',
            keys: ['github', 'git hub', 'source code', 'repositor', 'repo', 'kod', 'гитхаб', 'гитхуб', 'исходн', 'репозитор', 'код'],
            answer: {
                en: 'His code lives on GitHub: github.com/JB5621.',
                tk: 'Kody GitHub-da: github.com/JB5621.',
                ru: 'Его код на GitHub: github.com/JB5621.'
            },
            links: [{ label: { en: 'Open GitHub', tk: 'GitHub-y aç', ru: 'Открыть GitHub' }, href: FACTS.github }]
        },
        {
            id: 'contact',
            keys: ['contact', 'reach', 'get in touch', 'social', 'link', 'habarlaş', 'aragatnaşyk', 'связ', 'контакт', 'написать', 'соцсет'],
            answer: {
                en: 'You can reach him at ' + FACTS.email + ' or ' + FACTS.phone + ', on Telegram (@jb5622), or through the contact form at the bottom of this page. His code is on GitHub.',
                tk: 'Onuň bilen ' + FACTS.email + ' ýa-da ' + FACTS.phone + ' arkaly, Telegramda (@jb5622) ýa-da sahypanyň aşagyndaky forma arkaly habarlaşyp bilersiňiz. Kody GitHub-da.',
                ru: 'С ним можно связаться по адресу ' + FACTS.email + ' или по телефону ' + FACTS.phone + ', в Telegram (@jb5622) либо через форму внизу страницы. Код — на GitHub.'
            },
            links: [{ label: { en: 'Contact form', tk: 'Habarlaşmak formasy', ru: 'Форма связи' }, href: '#contact' },
                    { label: { en: 'Telegram', tk: 'Telegram', ru: 'Telegram' }, href: FACTS.telegram }]
        },
        {
            id: 'location',
            keys: ['where', 'located', 'location', 'city', 'country', 'he live', 'lives', 'based', 'remote', 'timezone', 'nirede', 'ýaşa', 'şäher', 'ýurt', 'salgy', 'где', 'город', 'стран', 'живёт', 'живет', 'находит', 'удалён', 'удален'],
            answer: {
                en: 'He is based in Mary, Turkmenistan, and has worked with 5+ clients worldwide.',
                tk: 'Ol Mary, Türkmenistanda ýaşaýar we dünýäde 5+ müşderi bilen işledi.',
                ru: 'Он живёт в Мары, Туркменистан, и работал с 5+ клиентами по всему миру.'
            }
        },
        {
            id: 'languages',
            keys: ['language', 'english', 'russian', 'turkmen', 'speak', 'dil', 'iňlis', 'rus', 'türkmen', 'gepl', 'язык', 'английск', 'русск', 'туркменск', 'говорит'],
            answer: {
                en: 'This site is written in English, Türkmen and Russian — use the EN / TM / RU switch in the top bar. I answer in whichever one is selected, but you can type your question in any of them.',
                tk: 'Bu sahypa iňlis, türkmen we rus dillerinde ýazylan — ýokarky EN / TM / RU çalşyryjysyny ulanyň. Men saýlanan dilde jogap berýärin, ýöne soragyňyzy islendik dilde ýazyp bilersiňiz.',
                ru: 'Сайт доступен на английском, туркменском и русском — переключатель EN / TM / RU в верхней панели. Я отвечаю на выбранном языке, но спрашивать можно на любом из них.'
            }
        },
        {
            id: 'cv',
            keys: ['cv', 'resume', 'resumé', 'curriculum', 'pdf', 'download', 'rezýume', 'ýükle', 'резюме', 'сиви', 'скачать'],
            answer: {
                en: "There is no CV file on the site yet. Email him at " + FACTS.email + " and he will send one over.",
                tk: 'Sahypada entek rezýume faýly ýok. ' + FACTS.email + ' salgysyna ýazyň, ol iberer.',
                ru: 'Файла резюме на сайте пока нет. Напишите на ' + FACTS.email + ' — и он его пришлёт.'
            },
            links: [{ label: { en: 'Email him', tk: 'E-poçta ýaz', ru: 'Написать на почту' }, href: 'mailto:' + FACTS.email }]
        },
        {
            id: 'rates',
            keys: ['rate', 'price', 'cost', 'salary', 'budget', 'how much', 'charge', 'baha', 'näçe', 'aýlyk', 'býudžet', 'цена', 'стоимость', 'сколько стоит', 'зарплат', 'бюджет', 'ставк'],
            answer: {
                en: "Rates aren't listed on the site — they depend on the project. Send him the details and he will quote you.",
                tk: 'Bahalar sahypada görkezilmedik — olar taslama bagly. Jikme-jiklikleri iberiň, ol baha aýdar.',
                ru: 'Ставки на сайте не указаны — они зависят от проекта. Отправьте детали, и он назовёт цену.'
            },
            links: [{ label: { en: 'Telegram', tk: 'Telegram', ru: 'Telegram' }, href: FACTS.telegram }]
        },
        {
            id: 'site',
            keys: ['this site', 'this website', 'this page', 'how was this', 'built this', 'made this', 'bu sahypa', 'şu sahypa', 'этот сайт', 'эта страница', 'этот сайт сделан'],
            answer: {
                en: 'This site is hand-written vanilla HTML, CSS and JavaScript — no frameworks. It has a dual light/dark design system, three languages, 3D card tilts, a rotating cube and a projected particle field in the hero.',
                tk: 'Bu sahypa elde ýazylan arassa HTML, CSS we JavaScript — freýmworksyz. Onda açyk/goýy dizaýn ulgamy, üç dil, 3D kart egrelmeleri, aýlanýan kub we baş bölekdäki bölejik meýdany bar.',
                ru: 'Сайт написан вручную на чистых HTML, CSS и JavaScript — без фреймворков. В нём светлая и тёмная темы, три языка, 3D-наклон карточек, вращающийся куб и поле частиц в шапке.'
            }
        },
        {
            id: 'thanks',
            keys: ['thank', 'thanks', 'thx', 'appreciate', 'sag bol', 'sagbol', 'minnetdar', 'спасибо', 'благодар', 'спс'],
            answer: {
                en: "You're welcome! Anything else you'd like to know?",
                tk: 'Hoş geldiňiz! Başga bilesiňiz gelýän zat barmy?',
                ru: 'Пожалуйста! Хотите узнать что-нибудь ещё?'
            }
        },
        {
            id: 'bye',
            keys: ['bye', 'goodbye', 'see you', 'later', 'sag boluň', 'hoş', 'görüşeris', 'пока', 'до свидания', 'увидимся'],
            answer: {
                en: 'Take care! If you want to reach Jemshit directly, Telegram is the fastest: @jb5622.',
                tk: 'Sag boluň! Jemşit bilen göni habarlaşasyňyz gelse, iň çalt ýol — Telegram: @jb5622.',
                ru: 'Всего доброго! Если хотите написать Джемшиту напрямую — быстрее всего в Telegram: @jb5622.'
            }
        },
        {
            id: 'help',
            keys: ['help', 'what can you', 'what can i ask', 'options', 'commands', 'kömek', 'näme soramaly', 'помощь', 'что спросить', 'что ты умеешь', 'помоги'],
            answer: {
                en: 'Try asking: What are his skills? · How much experience does he have? · What projects has he built? · Is he available for hire? · How do I contact him?',
                tk: 'Şeýle soraň: Başarnyklary nähili? · Näçe tejribesi bar? · Nähili taslamalar ýasady? · Işe açykmy? · Nädip habarlaşmaly?',
                ru: 'Спросите, например: Какие у него навыки? · Сколько у него опыта? · Какие проекты он делал? · Он открыт для работы? · Как с ним связаться?'
            }
        },
        {
            // Anything personal that this page simply does not state.
            id: 'personal',
            keys: ['age', 'how old', 'birthday', 'married', 'family', 'university', 'school', 'degree', 'education', 'studied', 'hobby', 'hobbies', 'ýaş', 'maşgala', 'uniwersitet', 'mekdep', 'bilim', 'okady', 'höwes', 'возраст', 'сколько лет ему', 'семья', 'женат', 'университет', 'школ', 'образован', 'учил', 'хобби'],
            answer: {
                en: 'That is not something this page covers — I only know what is published here: his skills, experience, projects and contact details. For anything more personal, ask him directly at ' + FACTS.email + '.',
                tk: 'Bu sahypada beýle maglumat ýok — men diňe şu ýerde ýaýradylanlary bilýärin: başarnyklary, tejribesi, taslamalary we habarlaşmak maglumatlary. Şahsy zatlar üçin göni ' + FACTS.email + ' salgysyna ýazyň.',
                ru: 'Этого на странице нет — я знаю только опубликованное здесь: навыки, опыт, проекты и контакты. По личным вопросам напишите ему напрямую: ' + FACTS.email + '.'
            }
        }
    ];

    const FALLBACK = {
        en: "I'm not sure about that one. I can help with his skills, experience, projects, availability and contact details — or you can ask him directly at " + FACTS.email + '.',
        tk: 'Muňa anyk jogap berip bilemok. Başarnyklary, tejribesi, taslamalary, işe açyklygy we habarlaşmak barada kömek edip bilerin — ýa-da göni ' + FACTS.email + ' salgysyna ýazyň.',
        ru: 'В этом я не уверен. Могу помочь с навыками, опытом, проектами, занятостью и контактами — или напишите ему напрямую: ' + FACTS.email + '.'
    };

    // ------------------------------------------------------------
    // 4. Matching
    // ------------------------------------------------------------
    const FOLD = { 'ä': 'a', 'ç': 'c', 'ö': 'o', 'ş': 's', 'ü': 'u', 'ý': 'y', 'ň': 'n', 'ž': 'z', 'ё': 'е', 'é': 'e' };

    function normalize(text) {
        return String(text)
            .toLowerCase()
            .replace(/[äçöşüýňžёé]/g, (c) => FOLD[c] || c)
            .replace(/[`'’"]/g, '')
            .replace(/\s+/g, ' ')
            .trim();
    }

    // Short keys need word boundaries ("hi" must not match "this"); longer
    // ones match as stems so inflected endings still land.
    let boundarySupported = true;
    try { new RegExp('(?:^|[^\\p{L}\\p{N}])x', 'u'); } catch (e) { boundarySupported = false; }

    function escapeRe(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

    INTENTS.forEach((intent) => {
        intent.matchers = intent.keys.map((key) => {
            const k = normalize(key);
            if (k.length <= 3 && boundarySupported) {
                return {
                    weight: Math.max(6, k.length + 2),
                    re: new RegExp('(?:^|[^\\p{L}\\p{N}])' + escapeRe(k) + '(?:[^\\p{L}\\p{N}]|$)', 'u')
                };
            }
            return { weight: k.length, re: new RegExp(escapeRe(k)) };
        });
    });

    const THRESHOLD = 4;

    function findIntent(question) {
        const q = normalize(question);
        if (!q) return null;

        let best = null;
        let bestScore = 0;

        for (const intent of INTENTS) {
            let score = 0;
            for (const m of intent.matchers) {
                if (m.re.test(q)) score += m.weight;
            }
            // Earlier intents are the more specific ones, so ties keep them.
            if (score > bestScore) {
                bestScore = score;
                best = intent;
            }
        }

        return bestScore >= THRESHOLD ? best : null;
    }

    // ------------------------------------------------------------
    // 5. Interface
    // ------------------------------------------------------------
    const root = document.documentElement;
    const panel = document.getElementById('chat-panel');
    const launcher = document.getElementById('chat-launcher');
    if (!panel || !launcher) return;

    const closeBtn = document.getElementById('chat-close');
    const resetBtn = document.getElementById('chat-reset');
    const log = document.getElementById('chat-log');
    const chips = document.getElementById('chat-chips');
    const form = document.getElementById('chat-form');
    const input = document.getElementById('chat-input');
    const sendBtn = document.getElementById('chat-send');
    const titleEl = document.getElementById('chat-title');
    const statusEl = document.getElementById('chat-status');

    const reduceMotionChat = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let greeted = false;
    let pending = null;

    function lang() {
        const l = root.lang;
        return UI[l] ? l : 'en';
    }

    function ui() { return UI[lang()]; }

    function scrollToEnd() {
        log.scrollTop = log.scrollHeight;
    }

    function addBubble(who, text, links) {
        const row = document.createElement('div');
        row.className = 'chat-msg chat-msg--' + who;

        const bubble = document.createElement('div');
        bubble.className = 'chat-bubble';

        // split on newlines so multi-line answers keep their line breaks
        String(text).split('\n').forEach((line, i) => {
            if (i) bubble.appendChild(document.createElement('br'));
            bubble.appendChild(document.createTextNode(line));
        });

        row.appendChild(bubble);

        if (links && links.length) {
            const wrap = document.createElement('div');
            wrap.className = 'chat-actions';
            links.forEach((link) => {
                const a = document.createElement('a');
                a.className = 'chat-action';
                a.textContent = link.label[lang()] || link.label.en;
                a.href = link.href;
                if (/^https?:/.test(link.href)) {
                    a.target = '_blank';
                    a.rel = 'noopener noreferrer';
                } else if (link.href.charAt(0) === '#') {
                    a.addEventListener('click', close);
                }
                wrap.appendChild(a);
            });
            row.appendChild(wrap);
        }

        log.appendChild(row);
        scrollToEnd();
        return row;
    }

    function showTyping() {
        const row = document.createElement('div');
        row.className = 'chat-msg chat-msg--bot chat-typing';
        row.setAttribute('aria-label', ui().typing);

        const bubble = document.createElement('div');
        bubble.className = 'chat-bubble';
        for (let i = 0; i < 3; i++) bubble.appendChild(document.createElement('span'));

        row.appendChild(bubble);
        log.appendChild(row);
        scrollToEnd();
        return row;
    }

    function renderChips() {
        chips.textContent = '';
        ui().chips.forEach((label) => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'chat-chip';
            btn.textContent = label;
            btn.addEventListener('click', () => ask(label));
            chips.appendChild(btn);
        });
    }

    function answer(question) {
        const intent = findIntent(question);
        const l = lang();
        if (!intent) return { text: FALLBACK[l] || FALLBACK.en, links: null };
        return {
            text: intent.answer[l] || intent.answer.en,
            links: intent.links || null
        };
    }

    function ask(question) {
        const text = String(question).trim();
        if (!text) return;

        addBubble('user', text);
        input.value = '';

        if (pending) clearTimeout(pending);
        const typing = showTyping();

        // a short beat so the reply doesn't snap in faster than it can be read
        const delay = reduceMotionChat ? 120 : Math.min(900, 320 + text.length * 12);
        pending = setTimeout(() => {
            pending = null;
            typing.remove();
            const reply = answer(text);
            addBubble('bot', reply.text, reply.links);
        }, delay);
    }

    function greet() {
        if (greeted) return;
        greeted = true;
        const intent = INTENTS[0];
        addBubble('bot', intent.answer[lang()] || intent.answer.en);
    }

    function open() {
        panel.hidden = false;
        // Flush layout so the transition has a start value to run from.
        // A rAF would do it too, but rAF gets throttled (background tabs,
        // headless) and the panel can then stay stuck at opacity 0.
        void panel.offsetWidth;
        panel.classList.add('is-open');
        launcher.classList.add('is-active');
        launcher.setAttribute('aria-expanded', 'true');
        greet();
        if (window.innerWidth > 620) input.focus();
    }

    function close() {
        panel.classList.remove('is-open');
        launcher.classList.remove('is-active');
        launcher.setAttribute('aria-expanded', 'false');
        const done = () => { panel.hidden = true; };
        if (reduceMotionChat) done();
        else setTimeout(done, 260);
    }

    function toggle() {
        if (panel.hidden) open();
        else { close(); launcher.focus(); }
    }

    function reset() {
        if (pending) { clearTimeout(pending); pending = null; }
        log.textContent = '';
        greeted = false;
        greet();
        input.focus();
    }

    function applyChatLang() {
        const copy = ui();
        launcher.setAttribute('aria-label', copy.open);
        closeBtn.setAttribute('aria-label', copy.close);
        resetBtn.setAttribute('aria-label', copy.reset);
        titleEl.textContent = copy.title;
        statusEl.textContent = copy.status;
        input.setAttribute('placeholder', copy.placeholder);
        input.setAttribute('aria-label', copy.placeholder);
        sendBtn.setAttribute('aria-label', copy.send);
        renderChips();
    }

    launcher.addEventListener('click', toggle);
    closeBtn.addEventListener('click', () => { close(); launcher.focus(); });
    resetBtn.addEventListener('click', reset);

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        ask(input.value);
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !panel.hidden) {
            close();
            launcher.focus();
        }
    });

    // the language switch only writes <html lang>, so watching it keeps
    // this file independent of script.js
    new MutationObserver(applyChatLang).observe(root, {
        attributes: true,
        attributeFilter: ['lang']
    });

    applyChatLang();
})();
