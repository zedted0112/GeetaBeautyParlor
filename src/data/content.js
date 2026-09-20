export const brand = {
  name: 'Geeta Makeovers',
  owner: 'Geeta Semwal',
  assistant: 'Anshul',
  tagline: 'Artistry that reflects your true beauty',
  description:
    'From Himalayan bridal elegance to everyday glam, Geeta Makeovers brings out the best in you with a personal touch and 15 years of craft.',
  location: 'Uttarkashi, Uttarakhand',
  locationShort: 'Uttarkashi',
}

export const contact = {
  phone: '9634179904',
  phoneDisplay: '+91 96341 79904',
  phoneTel: '+919634179904',
  email: 'GeetaMakeovers@gmail.com',
  address: 'Uttarkashi, Uttarakhand, India',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Uttarkashi+Uttarakhand',
  instagramUrl: 'https://www.instagram.com/geeta__beauty__parlour/',
  instagramReels: [
    {
      id: 'behind-the-scenes-2',
      type: 'video',
      layout: 'landscape',
      src: new URL('../assets/videos/behind-the-scenes-2.mp4', import.meta.url).href,
      poster: new URL('../assets/videos/behind-the-scenes-2.jpg', import.meta.url).href,
    },
    {
      id: 'behind-the-scenes-3',
      type: 'video',
      src: new URL('../assets/videos/behind-the-scenes-3.mp4', import.meta.url).href,
      poster: new URL('../assets/videos/behind-the-scenes-3.jpg', import.meta.url).href,
    },
    {
      id: 'behind-the-scenes-4',
      type: 'video',
      src: new URL('../assets/videos/behind-the-scenes-4.mp4', import.meta.url).href,
      poster: new URL('../assets/videos/behind-the-scenes-4.jpg', import.meta.url).href,
    },
    {
      id: 'behind-the-scenes-5',
      type: 'video',
      layout: 'landscape',
      src: new URL('../assets/videos/behind-the-scenes-5.mp4', import.meta.url).href,
      poster: new URL('../assets/videos/behind-the-scenes-5.jpg', import.meta.url).href,
    },
    {
      id: 'behind-the-scenes-6',
      type: 'video',
      layout: 'landscape',
      src: new URL('../assets/videos/behind-the-scenes-6.mp4', import.meta.url).href,
      poster: new URL('../assets/videos/behind-the-scenes-6.jpg', import.meta.url).href,
    },
    {
      id: 'behind-the-scenes',
      type: 'video',
      src: new URL('../assets/videos/behind-the-scenes.mp4', import.meta.url).href,
      poster: new URL('../assets/videos/behind-the-scenes.jpg', import.meta.url).href,
    },
  ],
}

export const whatsapp = {
  number: '919634179904',
  defaultText: 'Hi Geeta, I want to book an appointment at Geeta Makeovers.',
}

export const siteUrl = 'https://zedted0112.github.io/GeetaBeautyParlor/'

export const whatsappUrl = (text = whatsapp.defaultText) =>
  `https://wa.me/${whatsapp.number}?text=${encodeURIComponent(text)}`

export const shareLookUrl = (kind = 'look') => {
  const line =
    kind === 'reel'
      ? `Loved this studio reel at ${brand.name}. Can we book a look like this?`
      : `Loved this look at ${brand.name}. Can we book something like this?`
  return whatsappUrl(`${line}\n${siteUrl}`)
}

export const telUrl = `tel:${contact.phoneTel}`
export const mailUrl = `mailto:${contact.email}`

export const navItems = [
  { label: 'Home', id: 'home' },
  { label: 'About', id: 'about' },
  { label: 'Services', id: 'services' },
  { label: 'Contact', id: 'contact' },
]

export const stats = [
  { value: '15+', label: 'Years of craft', detail: 'Beauty artistry in Uttarkashi' },
  { value: '1000+', label: 'Happy clients', detail: 'Brides, families, and everyday glam' },
  { value: '50+', label: 'Looks & rituals', detail: 'Makeup, hair, skin, and bridal' },
]

export const services = [
  {
    id: 'bridal',
    name: 'Bridal Makeup',
    blurb: 'Full bridal looks for pheras, reception, and every ritual in between.',
    image: 'bridal',
  },
  {
    id: 'glam',
    name: 'GLAM',
    blurb: 'Party and event makeup — sharp, lit, and ready for the camera.',
    image: 'glam',
  },
  {
    id: 'bts',
    name: 'Behind the Scenes',
    blurb: 'A look inside the studio — how a bridal look comes together.',
    image: 'bts',
  },
  {
    id: 'hair',
    name: 'Hair Styling',
    blurb: 'Cuts, curls, updos, and finishing that hold through the day.',
    image: 'hair',
  },
  {
    id: 'facial',
    name: 'Facials',
    blurb: 'Skin rituals that prep, glow, and calm before a big moment.',
    image: 'facial',
  },
  {
    id: 'waxing',
    name: 'Waxing',
    blurb: 'Clean, careful finishing for events and everyday comfort.',
    image: 'waxing',
  },
]

export const about = {
  badge: 'Meet Geeta Semwal',
  heading: 'Beauty, made personal in Uttarkashi',
  quotes: [
    'Your skin, your jewellery, your mountain wedding, your everyday confidence — the look is built around you.',
    'The kind of care that only a hometown studio can give.',
    'Fifteen years learning faces the way a good artist learns light — patiently, and in person.',
    'Nothing is off a chart. The look is built around you.',
  ],
}

export const seo = {
  title: 'Geeta Makeovers | Bridal & Beauty in Uttarkashi',
  description:
    'Geeta Makeovers by Geeta Semwal — bridal makeup, hair, facials and beauty in Uttarkashi. Book with Geeta.',
}
