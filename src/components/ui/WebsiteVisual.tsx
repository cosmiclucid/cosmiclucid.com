import { useId } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Check, Code, Smartphone } from 'lucide-react';
import { useVisualPointer } from '../../hooks/useVisualPointer';
import './WebsiteVisual.css';

export default function WebsiteVisual() {
  const id = useId().replace(/:/g, '');
  const { rotateX, rotateY, nearX, nearY, farX, farY, lightX, lightY, trackPointer, reset } = useVisualPointer();

  return (
    <div className="website-visual" aria-hidden="true" onPointerMove={trackPointer} onPointerLeave={reset} onPointerCancel={reset}>
      <motion.svg viewBox="0 0 560 500" fill="none" style={{ rotateX, rotateY }}>
        <defs>
          <linearGradient id={`${id}-edge`} x1="65" y1="90" x2="480" y2="420" gradientUnits="userSpaceOnUse">
            <stop stopColor="#45BFFF" /><stop offset=".5" stopColor="#8C5AFF" /><stop offset="1" stopColor="#D98CFF" />
          </linearGradient>
          <linearGradient id={`${id}-art`} x1="285" y1="155" x2="416" y2="276" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0A2244" /><stop offset=".5" stopColor="#3D1D74" /><stop offset="1" stopColor="#11182D" />
          </linearGradient>
          <linearGradient id={`${id}-ribbon`} x1="285" y1="170" x2="430" y2="271" gradientUnits="userSpaceOnUse">
            <stop stopColor="#69CFFF" /><stop offset=".5" stopColor="#9460FF" /><stop offset="1" stopColor="#E8A5FF" />
          </linearGradient>
          <radialGradient id={`${id}-glow`}><stop stopColor="#7A44DD" stopOpacity=".3" /><stop offset="1" stopColor="#6428DD" stopOpacity="0" /></radialGradient>
          <clipPath id={`${id}-art-crop`}><rect x="286" y="160" width="132" height="122" rx="7" /></clipPath>
        </defs>
        <motion.ellipse cx={lightX} cy={lightY} rx="210" ry="180" fill={`url(#${id}-glow)`} />
        <path d="M47 341H507M95 91V429M465 76V408" stroke="#7760A6" strokeOpacity=".15" strokeDasharray="3 8" />

        <motion.g style={{ x: farX, y: farY }}>
          <g className="website-visual__code">
            <rect x="117" y="64" width="239" height="114" rx="10" fill="#101026" stroke={`url(#${id}-edge)`} strokeOpacity=".4" />
            <Code x="135" y="79" size={15} stroke="#BC9CE9" />
            <path d="M161 86H224" stroke="#9D87BC" strokeOpacity=".4" strokeWidth="3" strokeLinecap="round" />
            <g className="website-visual__code-lines" strokeWidth="3" strokeLinecap="round">
              <path d="M137 112H158M169 112H212M148 125H193M203 125H258M148 138H176" stroke="#9B6ADE" />
              <path d="M223 112H276M269 125H305M187 138H249M259 138H294" stroke="#65A7DD" />
            </g>
          </g>
        </motion.g>

        <g className="website-visual__browser">
          <rect x="72" y="119" width="370" height="245" rx="12" fill="#0B0D20" stroke={`url(#${id}-edge)`} strokeOpacity=".75" />
          <path d="M72 151H442" stroke="#63527D" strokeOpacity=".45" />
          <circle cx="89" cy="135" r="3" fill="#C47FDC" /><circle cx="100" cy="135" r="3" fill="#9070CD" /><circle cx="111" cy="135" r="3" fill="#5E95CE" />
          <rect x="170" y="129" width="169" height="12" rx="5" fill="#242039" />
          <text x="253" y="137" textAnchor="middle" fill="#B5A4D0" fontSize="6" letterSpacing="2" fontFamily="Arial, sans-serif">YOUR DIGITAL HOME</text>
          <rect x="94" y="172" width="20" height="5" rx="2" fill="#AD7AEF" />
          <path d="M300 174H325M338 174H361M373 174H402" stroke="#A696BE" strokeWidth="3" strokeLinecap="round" />
          <text x="95" y="211" className="website-visual__headline">BUILT TO</text>
          <text x="95" y="233" className="website-visual__headline" fill="#AD88FF">STAND OUT.</text>
          <path d="M97 249H244M97 258H231M97 267H206" stroke="#9D8AB9" strokeOpacity=".5" strokeWidth="3" strokeLinecap="round" />
          <rect className="website-visual__button" x="95" y="282" width="103" height="24" rx="12" fill="#5933A3" stroke="#B681FF" strokeOpacity=".6" />
          <path d="M109 294H164" stroke="#E5DAFF" strokeWidth="2" strokeLinecap="round" />
          <ArrowUpRight x="176" y="289" size={11} stroke="#E5DAFF" />
          <g clipPath={`url(#${id}-art-crop)`}>
            <rect x="286" y="160" width="132" height="122" fill={`url(#${id}-art)`} />
            <g className="website-visual__sculpture">
              <path d="M280 181C396 131 438 205 351 215S285 278 432 254" stroke={`url(#${id}-ribbon)`} strokeWidth="18" strokeLinecap="round" />
              <path d="M280 181C396 131 438 205 351 215S285 278 432 254" stroke="#EAD2FF" strokeWidth="1" strokeOpacity=".5" />
            </g>
          </g>
          {[0, 1, 2].map((index) => (
            <g key={index}>
              <rect x={95 + index * 108} y="323" width="94" height="23" rx="4" fill="#211A35" stroke="#786094" strokeOpacity=".2" />
              <path d={`M${105 + index * 108} 334h66`} stroke="#8F70B4" strokeOpacity=".6" strokeWidth="2" strokeLinecap="round" />
            </g>
          ))}
        </g>

        <motion.g style={{ x: nearX, y: nearY }}>
          <g className="website-visual__mobile">
            <rect x="381" y="222" width="101" height="183" rx="15" fill="#090D20" stroke={`url(#${id}-edge)`} strokeOpacity=".85" />
            <path d="M417 232H446" stroke="#716187" strokeWidth="3" strokeLinecap="round" />
            <rect x="391" y="249" width="80" height="65" rx="5" fill={`url(#${id}-art)`} />
            <path className="website-visual__mobile-wave" d="M398 282Q417 253 433 281T465 280" stroke={`url(#${id}-ribbon)`} strokeWidth="6" strokeLinecap="round" />
            <path d="M392 328H463M392 337H449M392 346H459" stroke="#AD93CC" strokeWidth="3" strokeOpacity=".5" strokeLinecap="round" />
            <rect x="392" y="360" width="63" height="17" rx="8" fill="#653DAD" />
            <path d="M417 395H446" stroke="#716187" strokeWidth="3" strokeLinecap="round" />
          </g>
          <g className="website-visual__badge">
            <rect x="108" y="374" width="164" height="43" rx="12" fill="#111129" stroke="#956FC9" strokeOpacity=".55" />
            <Smartphone x="123" y="386" size={18} stroke="#B998F4" />
            <text x="150" y="400" fill="#D7C7EA" fontSize="8" letterSpacing="1.2" fontFamily="Arial, sans-serif">EVERY SCREEN</text>
            <Check x="246" y="387" size={16} stroke="#82C2ED" />
          </g>
          <g className="website-visual__cursor">
            <path d="M291 302L294 329L302 321L311 328L316 322L307 315L318 311Z" fill="#C8A7FF" stroke="#EADFFF" strokeWidth="1.5" strokeLinejoin="round" />
            <rect x="310" y="332" width="64" height="19" rx="8" fill="#6334AA" />
            <text x="342" y="344" textAnchor="middle" fill="#EEE3FF" fontSize="7" letterSpacing="1" fontFamily="Arial, sans-serif">EXPLORE</text>
          </g>
        </motion.g>
        <text x="280" y="470" textAnchor="middle" className="website-visual__caption">DESIGN · BUILD · LAUNCH</text>
      </motion.svg>
    </div>
  );
}
