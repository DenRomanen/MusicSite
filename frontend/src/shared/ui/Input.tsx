import { InputHTMLAttributes } from 'react'
import { cn } from '@/shared/lib/cn'

type InputProps = InputHTMLAttributes<HTMLInputElement>

export const Input = ({ className, ...restProps }: InputProps) => (
  <input className={cn('input', className)} {...restProps} />
)
