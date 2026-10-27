import type { ReactNode } from 'react';
import { Camera, Code, LayoutTemplate, Mic, Search, Video } from 'lucide-react';
import { socialCards, socialTimeline } from './serviceDefaults';

type Card = {
  icon: ReactNode;
  title: string;
  description: string;
  glow: 'purple' | 'blue' | 'violet';
  buttonText: string;
  href?: string;
};
type Content = {
  title: string;
  subline: string;
  tagline: string;
  heroTitle: string;
  intro: string;
  cta: string;
  highlights: [string, string, string];
  servicesTitle: string;
  servicesSubline: string;
  cards: Card[];
  processTitle: string;
  processSubtitle: string;
  timeline: { id: string; year: string; title: string; description: string }[];
  finalCard: { title: string; subtitle: string; paragraphs: string[] };
  whyTitle: string;
  whyText: string;
  reviewTitle: string;
  reviewText: string;
};

function timeline(steps: [string, string][]): Content['timeline'] {
  return steps.map(([title, description], index) => ({
    id: `step-${index + 1}`,
    year: String(index + 1).padStart(2, '0'),
    title: `⭐ ${String(index + 1).padStart(2, '0')} — ${title}`,
    description,
  }));
}

export type ServiceKind = 'social' | 'websites' | 'production';

export const serviceContent: Record<ServiceKind, Content> = {
  social: {
    title: 'SOCIAL MEDIA MANAGEMENT',
    subline: 'Social media strategy, content creation & channel management',
    tagline: '— turning attention into brands people trust and buy from —',
    heroTitle: 'CONTENT THAT CONNECTS',
    intro: 'I plan, create and manage social media content that shows what makes your brand different, builds trust and keeps you connected to your audience.',
    cta: 'DISCUSS YOUR SOCIALS',
    highlights: ['Content strategy', 'Video & photography', 'Channel management'],
    servicesTitle: 'Strategy, Creation & Management',
    servicesSubline: '— A consistent social presence built around your brand —',
    cards: socialCards,
    processTitle: 'OUR SOCIAL MEDIA PROCESS',
    processSubtitle: 'From strategy to consistent publishing',
    timeline: socialTimeline,
    finalCard: {
      title: '⭐ 06 — Keep Growing Together', subtitle: '06',
      paragraphs: ['Your channels have a clear direction, a consistent visual voice and a reliable content rhythm.', 'I tailor ongoing social media management to your channels, production needs and goals, using reporting to guide the next round of content.'],
    },
    whyTitle: 'One creative partner. A consistent brand presence.',
    whyText: 'I bring strategy, audiovisual production and day-to-day channel management together, so your social media looks coherent and has a clear purpose.',
    reviewTitle: "Let's review your social media presence",
    reviewText: 'Channels, content, messaging and opportunities, all in one place.',
  },
  websites: {
    title: 'WEBSITE DESIGN & DEVELOPMENT',
    subline: 'Custom websites, landing pages & responsive development',
    tagline: '— a distinctive digital home for your brand —',
    heroTitle: 'WEBSITES WITH PURPOSE',
    intro: 'I design and build websites that make your brand recognizable, explain your services clearly and help the right people take the next step. From a focused landing page to a complete business website, each page has a purpose.',
    cta: 'DISCUSS YOUR WEBSITE',
    highlights: ['Custom web design', 'Responsive development', 'Search-ready foundations'],
    servicesTitle: 'Design, Development & Launch',
    servicesSubline: '— Your brand, your content and your services in one clear experience —',
    cards: [
      { icon: <LayoutTemplate size={48} />, title: 'Website Design', description: 'Clear page structure, distinctive layouts and a visual direction shaped around your brand and your audience.', glow: 'purple', buttonText: 'DESIGN MY WEBSITE' },
      { icon: <Code size={48} />, title: 'Website Development', description: 'Responsive, accessible pages that work across phones, tablets and desktops, with straightforward routes to contact.', glow: 'blue', buttonText: 'BUILD MY WEBSITE' },
      { icon: <Search size={48} />, title: 'SEO & Launch Foundations', description: 'Descriptive titles, clear URLs, useful content and performance checks to prepare your website for visitors and search engines.', glow: 'violet', buttonText: 'PLAN MY LAUNCH' },
    ],
    processTitle: 'OUR WEBSITE PROCESS',
    processSubtitle: 'From first idea to launch',
    timeline: timeline([
      ['Discover', 'We define your audience, business goals and the actions your website should encourage.'],
      ['Structure', 'We plan the pages, navigation and content so visitors can find what they need quickly.'],
      ['Design', 'I translate your brand into layouts, typography and visual details that work together.'],
      ['Develop', 'I build responsive pages, add your content and connect forms and essential metadata.'],
      ['Review & Launch', 'We check the experience across screen sizes, refine the details and prepare the website to go live.'],
    ]),
    finalCard: { title: '⭐ 06 — Keep Your Website Working', subtitle: '06', paragraphs: ['Your website has a clear structure, a coherent visual identity and a straightforward path to enquiry.', 'We can plan future content updates and improvements as your business develops.'] },
    whyTitle: 'One creative partner. A connected digital presence.',
    whyText: 'I connect website design with your visual identity, photography and video, so your site feels like a coherent expression of your business.',
    reviewTitle: "Let's discuss your website goals",
    reviewText: 'Your audience, pages, content and next steps, planned together.',
  },
  production: {
    title: 'AUDIO VISUAL PRODUCTION',
    subline: 'Brand films, photography, social content & sound',
    tagline: '— tell your story through images and sound —',
    heroTitle: 'STORIES YOU CAN SEE & FEEL',
    intro: 'I create cinematic video, photography and audio that bring your story to life. From the first concept to the final edit, I shape content around your message, your audience and where it will be seen.',
    cta: 'DISCUSS YOUR PRODUCTION',
    highlights: ['Film & video', 'Photography', 'Audio production'],
    servicesTitle: 'Film, Photography & Sound',
    servicesSubline: '— Connected audiovisual production from concept to delivery —',
    cards: [
      { icon: <Video size={48} />, title: 'Film & Video Production', description: 'Brand films, events and social videos with thoughtful direction, cinematic imagery and a clear story.', glow: 'purple', buttonText: 'VIEW FILM WORK', href: '/portfolio/film' },
      { icon: <Camera size={48} />, title: 'Photography', description: 'Brand, portrait and event photography that gives your business a distinctive visual library.', glow: 'blue', buttonText: 'VIEW PHOTOGRAPHY', href: '/portfolio/photography' },
      { icon: <Mic size={48} />, title: 'Audio Production', description: 'Music production, sound design, mixing and mastering that support the emotion and impact of your work.', glow: 'violet', buttonText: 'VIEW AUDIO WORK', href: '/portfolio/audio' },
    ],
    processTitle: 'OUR PRODUCTION PROCESS',
    processSubtitle: 'From creative concept to final delivery',
    timeline: timeline([
      ['Discover', 'We define your story, audience, platforms and the deliverables your project needs.'],
      ['Plan', 'We shape the concept, shot list, locations and production schedule around your goals.'],
      ['Create', 'I capture the footage, photography or sound with a consistent creative direction.'],
      ['Edit', 'Editing, color and sound bring the material together into a focused final piece.'],
      ['Review & Deliver', 'We refine the agreed edits and prepare final files for your chosen channels.'],
    ]),
    finalCard: { title: '⭐ 06 — Put Your Content to Work', subtitle: '06', paragraphs: ['Your production is ready to share, with deliverables shaped for the platforms you use.', 'We can plan further content or connect the work with your website and social media presence.'] },
    whyTitle: 'One creative partner. A connected audiovisual story.',
    whyText: 'I combine film, photography and sound with an understanding of visual storytelling and digital channels, so each production fits the wider story of your business.',
    reviewTitle: "Let's discuss your next production",
    reviewText: 'Concept, deliverables, locations and creative direction.',
  },
};
