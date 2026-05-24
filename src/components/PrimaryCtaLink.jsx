import { Link } from 'react-router-dom';
import { IconChevronRight } from '@/components/icons';
import { DrawerCornerCta } from '@/components/DrawerCornerCta';

/**
 * Primary CTA — drawer-corner style by default; simple pill for compact nav slots.
 */
export function PrimaryCtaLink({
  to = '/intake',
  children = 'Start clinical analysis',
  className = '',
  variant = 'drawer',
  drawerTop = 'Five analyses',
  drawerBottom = '...one intake',
  iconSize = 18,
  showIcon = true,
  ...rest
}) {
  if (variant === 'simple') {
    return (
      <Link
        to={to}
        className={['btn-primary', className].filter(Boolean).join(' ')}
        {...rest}
      >
        {children}
        {showIcon && (
          <IconChevronRight size={iconSize} className="btn-icon" aria-hidden />
        )}
      </Link>
    );
  }

  return (
    <DrawerCornerCta
      to={to}
      drawerTop={drawerTop}
      drawerBottom={drawerBottom}
      className={className}
      {...rest}
    >
      {children}
    </DrawerCornerCta>
  );
}
