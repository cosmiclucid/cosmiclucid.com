import { Link } from 'react-router-dom';
import AuroraButton from './ui/AuroraButton';
import LouisPortrait, { type PortraitKind } from './LouisPortrait';

export default function CollaborateSection({ id, portrait, title = 'Why Work With Me', intro, detail, caption }: {
  id: string;
  portrait: PortraitKind;
  title?: string;
  intro: string;
  detail: string;
  caption: string;
}) {
  return (
    <section id={id} className="collaborate-section" aria-labelledby={`${id}-title`}>
      <div className="collaborate-section__copy">
        <p className="portrait-eyebrow">Your creative partner · Louis Kuschnir</p>
        <h2 id={`${id}-title`} className="headline-gradient">{title}</h2>
        <p className="collaborate-section__intro">{intro}</p>
        <p className="collaborate-section__detail">{detail}</p>
        <ul className="collaborate-section__points">
          <li>Direct collaboration with me, from the brief to delivery.</li>
          <li>A clear plan for your content, channels and goals.</li>
          <li>Creative decisions shaped around your business.</li>
        </ul>
        <div className="collaborate-section__actions">
          <AuroraButton label="LET'S WORK TOGETHER" href="/contact" className="px-8 py-4 text-sm tracking-[0.15em]" />
          <Link to="/about">More about me <span aria-hidden="true">↗</span></Link>
        </div>
      </div>
      <LouisPortrait kind={portrait} caption={caption} />
    </section>
  );
}
