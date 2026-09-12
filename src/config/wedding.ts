/**
 * ─────────────────────────────────────────────────────────────
 *  TO‘Y SOZLAMALARI — barcha matn, sana, rasm va havolalar shu yerda.
 * ─────────────────────────────────────────────────────────────
 */

export interface GalleryImage {
  src: string;
  alt: string;
  ratio?: number;
}

export interface TimelineItem {
  time: string;
  title: string;
  note?: string;
  icon: 'rings' | 'glass' | 'dinner' | 'dance' | 'cake' | 'stars';
}

export interface StoryItem {
  date: string;
  title: string;
  text: string;
  image: string;
  alt: string;
}

export const wedding = {
  bride: { first: 'Falina', last: '' },
  groom: { first: 'Doston', last: '' },

  dateISO: '2026-09-28T18:00:00+05:00',
  dateLabel: 'Dushanba,',
  dateLabel2: '28-sentabr, 2026',
  timeLabel: 'Kechki soat 18:00',

  venue: {
    name: 'Oqshom restorani',
    city: 'Qamashi tumani',
    region: 'Qashqadaryo viloyati',
    address: 'Qashqadaryo viloyati, Qamashi tumani',
  },

  text: {
    eyebrow: ['Sizni', 'samimiy taklif qilamiz', 'to‘yiga'],
    reception: 'ziyofat davom etadi',
    coupleEyebrow: 'Kuyov va kelin',
    coupleIntro:
      'Oilalarimiz bilan birga sizni to‘yimizga taklif qilamiz.',
    invitationEyebrow: 'Yuragimiz quvonchga to‘la',
    invitation:
      'Doston va Falina oilalari bilan birga sizni to‘ylariga taklif qiladilar. Keling, shu kuni birga xursand bo‘laylik.',
    whenEyebrow: 'Qachon',
    countdownTitle: 'Sanani belgilang',
    countdownDone: 'Bugun shu kun',
    addToCalendar: 'Taqvimga qo‘shish',
    days: 'Kun',
    hours: 'Soat',
    minutes: 'Daqiqa',
    seconds: 'Soniya',
    whereEyebrow: 'Qayerda',
    venueTitle: 'Joylashuv',
    getDirections: 'Yo‘nalish olish',
    scheduleEyebrow: 'Dastur',
    timelineTitle: 'Kun tartibi',
    galleryEyebrow: 'Galereya',
    galleryTitle: 'Bizning lahzalar',
    galleryHint: 'suring · kattalashtirish uchun bosing',
    storyEyebrow: 'Qanday boshlandi',
    storyTitle: 'Bizning hikoya',
    dressEyebrow: 'Kiyim',
    dressTitle: 'Kiyim tartibi',
    dressCode: 'Qora galstuk ixtiyoriy',
    dressNote:
      'Iltimos, yumshoq va nafis ranglarda kiyining. Pushti, sage va krem ranglari juda mos keladi.',
    rsvpEyebrow: 'Javob',
    rsvpTitle: 'Iltimos, javob bering',
    rsvpNote: '',
    finalEyebrow: 'Sevgi bilan',
    finalTitle: 'Siz bilan nishonlashni intiqlik bilan kutamiz',
    hashtag: '#DostonVaFalina2026',
    scroll: 'pastga',
    and: 'va',
  },

  rsvpCopy: {
    name: 'Ismingiz',
    namePlaceholder: 'To‘liq ism',
    nameError: 'Iltimos, ismingizni yozing',
    attend: 'Kelasizmi?',
    yesTitle: 'Quvonch bilan kelaman',
    yesSub: 'Men boraman',
    noTitle: 'Afsuski, kela olmayman',
    noSub: 'Sevgi bilan',
    attendError: 'Iltimos, birini tanlang',
    guests: 'Mehmonlar soni',
    fewer: 'Kamroq mehmon',
    more: 'Ko‘proq mehmon',
    note: 'Er-xotinga izoh',
    optional: '(ixtiyoriy)',
    notePlaceholder: 'Ovqatlanish, qo‘shiq yoki tilaklaringiz…',
    send: 'Javobni yuborish',
    sending: 'Yuborilmoqda…',
    error: 'Hozircha yuborilmadi. Birozdan keyin qayta urinib ko‘ring.',
    thanks: 'Rahmat',
    yesOne: 'Siz bilan birga bo‘lishimizdan juda xursandmiz. Sizga joy saqlanadi.',
    yesMany: (n: number) =>
      `Siz bilan birga bo‘lishimizdan juda xursandmiz. ${n} kishiga joy saqlanadi.`,
    decline: 'Sizni sog‘inamiz va boshqa kuni birga nishonlashni umid qilamiz.',
  },

  couple: {
    brideImage: '/illustrations/bride.webp?v=2',
    groomImage: '/illustrations/groom.webp',
    brideNote: 'Kelin',
    groomNote: 'Kuyov',
  },

  /** To‘yona — haqiqiy karta raqamini shu yerga yozing. */
  gift: {
    eyebrow: 'Ixtiyoriy mehr',
    title: 'To‘yona',
    lead: 'Gul o‘rniga bir tabassum ham yetadi. To‘yona bermoqchi bo‘lsangiz — mana shu kartaga tashlang. Hech qanday majburiyat yo‘q.',
    wink: 'Cho‘ntakdagi tilaklar ham qabul qilinadi.',
    bank: 'Humo',
    number: '5614 6827 0162 6147',
    copy: 'Nusxa olish',
    copied: 'Nusxa olindi',
  },

  timeline: [
    { time: '18:30', title: 'Mehmonlar kutib olinadi', note: 'Foyedagi kutib olish ichimliklari', icon: 'glass' },
    { time: '19:00', title: 'Nikoh marosimi', note: 'Katta zal', icon: 'rings' },
    { time: '19:45', title: 'Kokteyl soati', note: 'Bog‘ terassasi', icon: 'stars' },
    { time: '20:30', title: 'Kechki ovqat', note: 'Zaldagi dasturxon', icon: 'dinner' },
    { time: '21:30', title: 'Tort va birinchi raqs', icon: 'cake' },
    { time: '22:00', title: 'Tonggacha raqs', icon: 'dance' },
  ] as TimelineItem[],

  gallery: [
    { src: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80', alt: 'Henry va Faith birga yurishmoqda', ratio: 0.8 },
    { src: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80', alt: 'Qo‘llar', ratio: 1.33 },
    { src: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1200&q=80', alt: 'Uzuklar', ratio: 0.75 },
    { src: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1200&q=80', alt: 'Quyosh botishi', ratio: 1.5 },
    { src: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80', alt: 'Kulgi', ratio: 0.8 },
    { src: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?auto=format&fit=crop&w=1200&q=80', alt: 'Sokin lahza', ratio: 1.25 },
  ] as GalleryImage[],

  story: [
    {
      date: 'Bahor 2019',
      title: 'Qanday tanishdik',
      text: 'Yomg‘irli bir tush, bitta soyabon va bitta avtobusni kutayotgan ikki notanish. Avval Faith kuldi; Henry o‘shandan beri uni kuldirishga urinadi.',
      image: '/illustrations/story-met.webp',
      alt: 'Yomg‘ir ostida soyabon ostidagi uchrashuv',
    },
    {
      date: 'Yoz 2022',
      title: 'Birinchi uyimiz',
      text: 'Katta derazali kichkina kvartira, o‘jar fern va har kechki ovqat sekin raqsga aylanadigan oshxona.',
      image: '/illustrations/story-home.webp',
      alt: 'Birinchi uy — deraza va fern',
    },
    {
      date: 'Qish 2025',
      title: 'U rozi bo‘ldi',
      text: 'Kechqurun iskala ustida, tanishgan kundagi o‘sha soyabon bilan Henry taklif qildi. Faith javobni oldindan bilardi.',
      image: '/illustrations/story-yes.webp',
      alt: 'Iskaladagi taklif',
    },
  ] as StoryItem[],

  dress: {
    palette: [
      { name: 'Pushti', hex: '#EDBFC6' },
      { name: 'Krem', hex: '#F3EEE4' },
      { name: 'Sage', hex: '#8A9A7B' },
      { name: 'Yashil', hex: '#3D5A34' },
      { name: 'Ko‘mir', hex: '#2B2F2C' },
    ],
  },

  rsvp: {
    endpoint: '/api/rsvp',
    maxGuests: 5,
  },

  music: {
    enabled: true,
    src: '/audio/music.mp3',
    title: 'Bizning qo‘shig‘imiz',
  },

  cover: {
    enabled: true,
    greeting: 'Hurmatli mehmon',
    cta: 'Ochish uchun bosing',
    openAria: 'Taklifnomani ochish',
  },

  a11y: {
    scroll: 'Tafsilotlarga o‘tish',
    playMusic: 'Musiqani qo‘yish',
    pauseMusic: 'Musiqani to‘xtatish',
    photo: (alt: string) => `Rasmni ochish: ${alt}`,
    close: 'Yopish',
    prev: 'Oldingi rasm',
    next: 'Keyingi rasm',
    viewer: 'Rasm ko‘rish',
    envelope: 'Taklifnoma konverti',
    map: (name: string) => `Xarita — ${name}`,
  },
};

export type Wedding = typeof wedding;
