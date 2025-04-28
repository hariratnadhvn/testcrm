import { cn } from '../../utils/helpers';

type BadgeVariant = 'default' | 'outline' | 'solid';
type BadgeColor = 'gray' | 'blue' | 'green' | 'yellow' | 'red' | 'purple';

interface BadgeProps {
  variant?: BadgeVariant;
  color?: BadgeColor;
  children: React.ReactNode;
  className?: string;
}

export default function Badge({ 
  variant = 'default',
  color = 'gray',
  children, 
  className 
}: BadgeProps) {
  
  const variantStyles: Record<BadgeVariant, Record<BadgeColor, string>> = {
    default: {
      gray: 'bg-gray-100 text-gray-800',
      blue: 'bg-blue-100 text-blue-800',
      green: 'bg-green-100 text-green-800', 
      yellow: 'bg-yellow-100 text-yellow-800',
      red: 'bg-red-100 text-red-800',
      purple: 'bg-purple-100 text-purple-800'
    },
    outline: {
      gray: 'border border-gray-300 text-gray-800',
      blue: 'border border-blue-300 text-blue-800',
      green: 'border border-green-300 text-green-800',
      yellow: 'border border-yellow-300 text-yellow-800',
      red: 'border border-red-300 text-red-800',
      purple: 'border border-purple-300 text-purple-800'
    },
    solid: {
      gray: 'bg-gray-500 text-white',
      blue: 'bg-blue-500 text-white',
      green: 'bg-green-500 text-white',
      yellow: 'bg-yellow-500 text-white',
      red: 'bg-red-500 text-white',
      purple: 'bg-purple-500 text-white'
    }
  };

  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
      variantStyles[variant][color],
      className
    )}>
      {children}
    </span>
  );
}