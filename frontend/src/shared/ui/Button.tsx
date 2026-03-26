import {
  ButtonHTMLAttributes,
  ReactElement,
  ReactNode,
  cloneElement,
  isValidElement
} from 'react'
import { cn } from '@/shared/lib/cn'

type ButtonVariant = 'primary' | 'secondary' | 'danger'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean
  children: ReactNode
  variant?: ButtonVariant
}

const variantClassNames: Record<ButtonVariant, string> = {
  primary: 'button button--primary',
  secondary: 'button button--secondary',
  danger: 'button button--danger'
}

export const Button = ({
  asChild = false,
  children,
  className,
  type = 'button',
  variant = 'primary',
  ...buttonProps
}: ButtonProps) => {
  const combinedClassName = cn(variantClassNames[variant], className)

  if (asChild && isValidElement(children)) {
    const childElement = children as ReactElement<{ className?: string }>

    return cloneElement(childElement, {
      className: cn(childElement.props.className, combinedClassName)
    })
  }

  return (
    <button className={combinedClassName} type={type} {...buttonProps}>
      {children}
    </button>
  )
}
