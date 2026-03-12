import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold tracking-widest uppercase transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-orange-200 bg-orange-50 text-orange-700',
        secondary:
          'border-gray-200 bg-gray-100 text-gray-700',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground',
        outline:
          'border-gray-200 text-gray-600 bg-transparent',
        // Dark background variants
        dark:
          'border-white/20 bg-white/10 text-orange-400',
        'dark-outline':
          'border-white/20 bg-transparent text-white/70',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export interface BadgeProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
