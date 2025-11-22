import { motion, useInView } from "motion/react";
import { useRef } from "react";

interface TimelineEvent {
  id: number;
  year: string;
  title: string;
  subtitle: string;
  description: string;
  side: "left" | "right";
}

interface TimelineItemProps {
  event: TimelineEvent;
  index: number;
}

export function TimelineItem({ event, index }: TimelineItemProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.5 });

  const isLeft = event.side === "left";

  return (
    <div ref={ref} className="relative">
      {/* Center node */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
        initial={{ scale: 0, rotate: -180 }}
        animate={
          isInView
            ? { scale: 1, rotate: 0 }
            : { scale: 0, rotate: -180 }
        }
        transition={{
          duration: 0.6,
          delay: 0.2,
          type: "spring",
          stiffness: 200,
        }}
      >
        <div className="relative">
          <div className="w-6 h-6 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-full" />
          <div className="absolute inset-0 w-6 h-6 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-full blur-md animate-pulse" />
        </div>
      </motion.div>

      {/* Content card */}
      <motion.div
        className={`relative ${
          isLeft ? "mr-auto pr-[calc(50%+3rem)]" : "ml-auto pl-[calc(50%+3rem)]"
        } w-full`}
        initial={{
          opacity: 0,
          x: isLeft ? -100 : 100,
          rotateY: isLeft ? -15 : 15,
        }}
        animate={
          isInView
            ? { opacity: 1, x: 0, rotateY: 0 }
            : { opacity: 0, x: isLeft ? -100 : 100, rotateY: isLeft ? -15 : 15 }
        }
        transition={{
          duration: 0.8,
          delay: 0.3,
          type: "spring",
          stiffness: 100,
        }}
      >
        <div className="group relative">
          {/* Connecting line */}
          <div
            className={`absolute top-1/2 -translate-y-1/2 w-12 h-[2px] bg-gradient-to-${
              isLeft ? "r" : "l"
            } from-cyan-500/50 to-transparent ${
              isLeft ? "right-full" : "left-full"
            }`}
          />

          {/* Card */}
          <div className="relative backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-6 shadow-2xl transition-all duration-300 hover:scale-105 hover:border-cyan-400/50 hover:shadow-cyan-500/20">
            {/* Glow effect on hover */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500/0 to-purple-500/0 group-hover:from-cyan-500/10 group-hover:to-purple-500/10 transition-all duration-300 pointer-events-none" />

            <div className="relative z-10">
              {/* Year badge */}
              <motion.div
                className="inline-block mb-3 px-4 py-1.5 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-400/30 rounded-full"
                initial={{ scale: 0 }}
                animate={isInView ? { scale: 1 } : { scale: 0 }}
                transition={{ duration: 0.4, delay: 0.5 }}
              >
                <span className="bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent">
                  {event.year}
                </span>
              </motion.div>

              {/* Title */}
              <h3 className="text-2xl text-white mb-2 group-hover:text-cyan-300 transition-colors">
                {event.title}
              </h3>

              {/* Subtitle */}
              <h4 className="text-lg text-cyan-200/80 mb-3">
                {event.subtitle}
              </h4>

              {/* Description */}
              <p className="text-gray-300 leading-relaxed">
                {event.description}
              </p>

              {/* Decorative corner elements */}
              <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-cyan-400/30 rounded-tl-lg" />
              <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-purple-400/30 rounded-br-lg" />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}