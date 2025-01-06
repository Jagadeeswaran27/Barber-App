import { Loader2 } from 'lucide-react';
import { Button } from './Button';
import { type ButtonHTMLAttributes } from 'react';

interface LoadingButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?: 'primary' | 'secondary';
}

export function LoadingButton({ 
  children, 
  loading = false, 
  disabled,
  ...props 
}: LoadingButtonProps) {
  return (
    <Button 
      {...props} 
      disabled={loading || disabled}
      className={`relative ${props.className || ''}`}
    >
      {loading && (
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <Loader2 className="h-5 w-5 animate-spin" />
        </span>
      )}
      <span className={loading ? 'invisible' : ''}>
        {children}
      </span>
    </Button>
  );
}