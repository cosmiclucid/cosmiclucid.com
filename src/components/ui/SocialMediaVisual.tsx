import { useId } from 'react';
import { motion } from 'framer-motion';
import { useVisualPointer } from '../../hooks/useVisualPointer';
import { Heart, MessageCircle, Send, Bookmark, Play, ArrowUpRight } from 'lucide-react';
import './SocialMediaVisual.css';

export default function SocialMediaVisual() {
  const id = useId().replace(/:/g, '');
  const { rotateX, rotateY, nearX, nearY, farX, farY, lightX, lightY, trackPointer, reset } = useVisualPointer();

  return (
    <div className="social-visual" aria-hidden="true" onPointerMove={trackPointer} onPointerLeave={reset} onPointerCancel={reset}>
      <motion.svg viewBox="0 0 560 500" fill="none" style={{ rotateX, rotateY }}>
        <defs>
          <linearGradient id={`${id}-edge`} x1="100" y1="70" x2="470" y2="420" gradientUnits="userSpaceOnUse">
            <stop stopColor="#42BCFF" /><stop offset=".5" stopColor="#8650FF" /><stop offset="1" stopColor="#D583FF" />
          </linearGradient>
          <linearGradient id={`${id}-post`} x1="218" y1="143" x2="347" y2="340" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0A214C" /><stop offset=".5" stopColor="#4D1E85" /><stop offset="1" stopColor="#121A46" />
          </linearGradient>
          <linearGradient id={`${id}-ribbon`} x1="211" y1="160" x2="355" y2="330" gradientUnits="userSpaceOnUse">
            <stop stopColor="#6EDBFF" /><stop offset=".5" stopColor="#985BFF" /><stop offset="1" stopColor="#E59AFF" />
          </linearGradient>
          <radialGradient id={`${id}-glow`}><stop stopColor="#8B4EFF" stopOpacity=".28" /><stop offset="1" stopColor="#5934D2" stopOpacity="0" /></radialGradient>
          <clipPath id={`${id}-crop`}><rect x="209" y="142" width="150" height="183" rx="5" /></clipPath>
        </defs>

        <motion.ellipse cx={lightX} cy={lightY} rx="190" ry="175" fill={`url(#${id}-glow)`} />
        <g stroke="#8A62C2" strokeOpacity=".18" strokeDasharray="3 7">
          <path d="M115 157C109 83 386 40 438 166S495 383 359 408" />
          <path d="M156 362C62 365 57 237 171 219S401 254 450 311" />
        </g>

        <motion.g style={{ x: farX, y: farY }}>
          <g className="social-visual__calendar">
            <rect x="77" y="132" width="143" height="148" rx="13" fill="#0D1026" stroke={`url(#${id}-edge)`} strokeOpacity=".5" />
            <text x="94" y="156" className="social-visual__label">CONTENT PLAN</text>
            <path d="M94 170H202" stroke="#746390" strokeOpacity=".3" />
            {Array.from({ length: 12 }, (_, index) => <rect key={index} x={95 + index % 4 * 27} y={185 + Math.floor(index / 4) * 24} width="17" height="15" rx="3" fill={index === 6 ? '#9F6AFF' : '#635086'} fillOpacity={index === 6 ? '.9' : '.23'} />)}
            <rect className="social-visual__schedule" x="149" y="209" width="17" height="15" rx="3" stroke="#DDC5FF" />
          </g>
        </motion.g>

        <g className="social-visual__phone">
          <rect x="191" y="80" width="186" height="341" rx="25" fill="#080B1D" stroke={`url(#${id}-edge)`} strokeOpacity=".8" />
          <rect x="258" y="91" width="51" height="5" rx="2.5" fill="#48405F" />
          <circle cx="220" cy="119" r="9" fill="#8B50DE" /><circle cx="220" cy="119" r="4" fill="#D0B1FF" />
          <text x="237" y="122" fill="#E4DCF2" fontSize="8" letterSpacing="1.3" fontFamily="Arial, sans-serif">YOUR BRAND</text>
          <circle cx="346" cy="118" r="1" fill="#ADA1C2" /><circle cx="351" cy="118" r="1" fill="#ADA1C2" /><circle cx="356" cy="118" r="1" fill="#ADA1C2" />
          <g clipPath={`url(#${id}-crop)`}>
            <rect x="209" y="142" width="150" height="183" fill={`url(#${id}-post)`} />
            <g className="social-visual__ribbon">
              <path d="M188 182C327 120 409 180 289 221S180 324 382 291" stroke={`url(#${id}-ribbon)`} strokeWidth="24" strokeLinecap="round" />
              <path d="M188 182C327 120 409 180 289 221S180 324 382 291" stroke="#EDC7FF" strokeOpacity=".35" strokeWidth="1" />
            </g>
            <circle cx="284" cy="234" r="23" fill="#090B2480" stroke="#DFCDFF" strokeOpacity=".5" />
            <Play x="276" y="225" size={18} fill="#E9DCFF" stroke="#E9DCFF" />
            <rect className="social-visual__progress" x="220" y="314" width="128" height="2" rx="1" fill="#DCC9FF" />
          </g>
          <Heart x="210" y="338" size={15} stroke="#D2B6FC" />
          <MessageCircle x="236" y="338" size={15} stroke="#D2B6FC" />
          <Send x="262" y="338" size={15} stroke="#D2B6FC" />
          <Bookmark x="341" y="338" size={15} stroke="#D2B6FC" />
          <path d="M212 369H328M212 379H348M212 389H289" stroke="#A192BA" strokeOpacity=".45" strokeWidth="3" strokeLinecap="round" />
          <path d="M266 408H302" stroke="#837797" strokeWidth="3" strokeLinecap="round" />
        </g>

        <motion.g style={{ x: nearX, y: nearY }}>
          <g className="social-visual__analytics">
            <rect x="334" y="261" width="162" height="132" rx="13" fill="#101028" stroke={`url(#${id}-edge)`} strokeOpacity=".65" />
            <text x="350" y="285" className="social-visual__label">AUDIENCE &amp; REACH</text>
            <ArrowUpRight x="463" y="274" size={15} stroke="#C398FF" />
            <path d="M350 310H480M350 333H480M350 356H480" stroke="#8163A3" strokeOpacity=".18" />
            <path className="social-visual__chart" d="M350 356L368 348L385 353L403 328L423 335L443 309L463 317L479 299" stroke={`url(#${id}-edge)`} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" pathLength="1" />
            <circle className="social-visual__chart-dot" cx="479" cy="299" r="4" fill="#CD9FFF" />
            <path d="M350 376H380M390 376H420M430 376H460" stroke="#9275B7" strokeWidth="3" strokeOpacity=".45" strokeLinecap="round" />
          </g>
          <g className="social-visual__reaction">
            <rect x="361" y="143" width="83" height="44" rx="22" fill="#1B1035" stroke="#B479EF" strokeOpacity=".6" />
            <Heart x="378" y="155" size={20} fill="#B27AF2" stroke="#D6B5FF" />
            <path d="M408 161H429M408 168H421" stroke="#D3BBED" strokeWidth="2" strokeLinecap="round" />
          </g>
          <g className="social-visual__message">
            <rect x="112" y="335" width="109" height="48" rx="12" fill="#0E172E" stroke="#6689E9" strokeOpacity=".6" />
            <MessageCircle x="125" y="350" size={18} stroke="#94B7FF" />
            <circle cx="156" cy="359" r="2" fill="#C8BBED" /><circle cx="168" cy="359" r="2" fill="#C8BBED" /><circle cx="180" cy="359" r="2" fill="#C8BBED" />
          </g>
        </motion.g>
        <text x="280" y="470" className="social-visual__caption" textAnchor="middle">CREATE · CONNECT · GROW</text>
      </motion.svg>
    </div>
  );
}
