import { motion } from 'framer-motion';

/**
 * Animates SVG path strokes (pathLength) — mirrors Framer Sign Component timing.
 */
export function SignatureStroke({ signature, active, className = '' }) {
  if (!signature?.paths?.length) return null;

  return (
    <svg
      className={`signature-stroke ${className}`.trim()}
      viewBox={signature.viewBox}
      role="presentation"
      aria-hidden={!active}
    >
      {signature.paths.map((pathDef) => (
        <motion.path
          key={pathDef.id}
          d={pathDef.d}
          fill="transparent"
          stroke="currentColor"
          strokeWidth={1.75}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={
            active
              ? { pathLength: 1, opacity: 1 }
              : { pathLength: 0, opacity: 0 }
          }
          transition={{
            pathLength: {
              duration: pathDef.duration,
              delay: pathDef.delay,
              ease: [0, 0, 1, 1],
            },
            opacity: {
              duration: 0.25,
              delay: pathDef.delay,
            },
          }}
        />
      ))}
    </svg>
  );
}
