/** Static brand lockup — animation lives only in AstraPreloader */

export function BrandName({ size = 'md', className = '', inverse = false }) {
  const sizes = {
    sm: 'text-lg',
    md: 'text-2xl md:text-3xl',
    lg: 'text-4xl md:text-5xl lg:text-[3.25rem]',
    xl: 'text-[2rem] leading-[0.95] sm:text-[2.75rem] md:text-6xl lg:text-[5.5rem]',
  };

  return (
    <span
      className={`font-display inline-flex items-baseline font-light tracking-tight ${
        inverse ? 'text-canvas' : 'text-inkwell'
      } ${sizes[size]} ${className}`}
    >
      <span className="accent-gradient-text">Ayur</span>
      <span className={inverse ? 'text-canvas' : ''}>Sense</span>
    </span>
  );
}
