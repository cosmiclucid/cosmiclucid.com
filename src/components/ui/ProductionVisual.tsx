import { useId } from 'react';
import { motion } from 'framer-motion';
import { useVisualPointer } from '../../hooks/useVisualPointer';
import './ProductionVisual.css';

export default function ProductionVisual() {
  const id = useId().replace(/:/g, '');
  const { rotateX, rotateY, nearX, nearY, farX, farY, lightX, lightY, trackPointer, reset } = useVisualPointer();
  const bars = Array.from({ length: 41 }, (_, index) => ({
    height: 12 + Math.abs(Math.sin(index * 1.7) * Math.cos(index * 0.32)) * 60,
    delay: `${index * -0.13}s`,
  }));

  return (
    <div className="production-visual" aria-hidden="true" onPointerMove={trackPointer} onPointerLeave={reset} onPointerCancel={reset}>
      <motion.svg viewBox="0 0 560 500" fill="none" style={{ rotateX, rotateY }}>
        <defs>
          <linearGradient id={`${id}-edge`} x1="65" y1="90" x2="490" y2="410" gradientUnits="userSpaceOnUse">
            <stop stopColor="#2AB8FF" /><stop offset=".52" stopColor="#9955FF" /><stop offset="1" stopColor="#DD77FF" />
          </linearGradient>
          <linearGradient id={`${id}-sky`} x1="280" y1="120" x2="280" y2="340" gradientUnits="userSpaceOnUse">
            <stop stopColor="#080B20" /><stop offset=".6" stopColor="#27104E" /><stop offset="1" stopColor="#6F269B" />
          </linearGradient>
          <linearGradient id={`${id}-light`} x1="100" y1="230" x2="470" y2="230" gradientUnits="userSpaceOnUse">
            <stop stopColor="#61D8FF" stopOpacity="0" /><stop offset=".5" stopColor="#AE82FF" /><stop offset="1" stopColor="#FF91E1" stopOpacity="0" />
          </linearGradient>
          <radialGradient id={`${id}-sun`}><stop stopColor="#F0B8FF" /><stop offset=".55" stopColor="#AC65FF" /><stop offset="1" stopColor="#7940F4" stopOpacity="0" /></radialGradient>
          <filter id={`${id}-glow`} x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="14" /></filter>
          <clipPath id={`${id}-screen`}><rect x="96" y="116" width="368" height="224" rx="5" /></clipPath>
        </defs>

        <motion.ellipse cx={lightX} cy={lightY} rx="170" ry="21" fill="#6125CF" opacity=".22" filter={`url(#${id}-glow)`} />
        <motion.g style={{ x: farX, y: farY }}><g className="production-visual__back">
          <rect x="65" y="91" width="410" height="260" rx="10" stroke={`url(#${id}-edge)`} strokeOpacity=".26" fill="#120D2A" fillOpacity=".4" />
          <path d="M79 112H111M79 112V143M460 329H429M460 329V298" stroke="#A078EA" strokeOpacity=".4" />
        </g>
        </motion.g>
        <g className="production-visual__frame">
          <rect x="82" y="102" width="396" height="252" rx="10" fill="#080C1D" stroke={`url(#${id}-edge)`} strokeOpacity=".85" />
          <g clipPath={`url(#${id}-screen)`}>
            <rect x="96" y="116" width="368" height="224" fill={`url(#${id}-sky)`} />
            <circle className="production-visual__sun" cx="319" cy="204" r="63" fill={`url(#${id}-sun)`} />
            <circle cx="319" cy="204" r="28" stroke="#D5A8FF" strokeOpacity=".65" />
            <path d="M78 307L171 213L233 278L279 244L362 310L412 254L484 319V350H78Z" fill="#28204B" />
            <path d="M78 307L171 213L233 278L279 244L362 310L412 254L484 319" stroke={`url(#${id}-edge)`} strokeOpacity=".5" />
            <path d="M80 339L182 279L244 306L319 273L402 307L481 288V352H80Z" fill="#100F27" />
            <path d="M80 339L182 279L244 306L319 273L402 307L481 288" stroke="#6256A3" strokeOpacity=".45" />
            <path className="production-visual__horizon" d="M96 242H464" stroke={`url(#${id}-light)`} />
            <rect className="production-visual__scan" x="96" y="116" width="2" height="224" fill="#BDB5FF" opacity=".25" />
          </g>
          <path d="M108 140V128H120M440 128H452V140M108 316V328H120M440 328H452V316" stroke="#D4C9FF" strokeOpacity=".6" />
          <path d="M270 228H290M280 218V238" stroke="#EEE8FF" strokeOpacity=".55" />
          <circle className="production-visual__record" cx="443" cy="148" r="3" fill="#D99BFF" />
        </g>

        <motion.g style={{ x: nearX, y: nearY }}><g className="production-visual__sound">
          <rect x="112" y="319" width="336" height="111" rx="12" fill="#0C0C20" fillOpacity=".94" stroke={`url(#${id}-edge)`} strokeOpacity=".5" />
          <path d="M131 376H428" stroke="#8464B6" strokeOpacity=".2" />
          {bars.map(({ height, delay }, index) => (
            <rect key={index} className="production-visual__bar" x={139 + index * 7} y={376 - height / 2} width="3" height={height} rx="1.5" fill={`url(#${id}-edge)`} style={{ animationDelay: delay }} />
          ))}
          <path d="M135 411H425" stroke="#8169AD" strokeOpacity=".4" />
          <path className="production-visual__playhead" d="M155 402V419" stroke="#E3CEFF" strokeWidth="2" />
        </g>
        </motion.g>
        <g stroke={`url(#${id}-edge)`} strokeOpacity=".4">
          <path d="M35 212H55M45 202V222M500 278H520M510 268V288" />
          <path d="M192 62H369M218 72H343" strokeOpacity=".25" />
        </g>
        <text x="280" y="471" fill="#B9A7D3" textAnchor="middle" fontSize="9" letterSpacing="6" fontFamily="Arial, sans-serif">FRAME · SOUND · STORY</text>
      </motion.svg>
    </div>
  );
}
