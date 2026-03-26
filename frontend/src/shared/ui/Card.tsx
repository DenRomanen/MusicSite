import { HTMLAttributes } from 'react'
import { cn } from '@/shared/lib/cn'

type CardProps = HTMLAttributes<HTMLDivElement>

export const Card = ({ children, className, ...restProps }: CardProps) => (
  <div className={cn('card', className)} {...restProps}>
    {children}
  </div>
)
