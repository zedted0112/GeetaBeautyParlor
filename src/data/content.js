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
}

export const whatsapp = {
  number: '919634179904',
  defaultText: 'Hi Geeta, I want to book an appointment at Geeta Makeovers.',
}

export const whatsappUrl = (text = whatsapp.defaultText) =>
  `https://wa.me/${whatsapp.number}?text=${encodeURIComponent(text)}`

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
    id: 'makeup',
    name: 'Party & Glam',
    blurb: 'Evening, festive, and camera-ready makeup tailored to you.',
    image: 'makeup',
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
    id: 'spa',
    name: 'Spa & Care',
    blurb: 'Hands-on care when you want to slow down and reset.',
    image: 'spa',
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
    'Geeta Makeovers by Geeta Semwal — bridal makeup, hair, facials and beauty in Uttarkashi. Book on WhatsApp.',
}
