import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-[var(--text)] text-[var(--bg)]",
        outline: "border-[var(--border-strong)] text-[var(--text-muted)]",
        accent: "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]",
        mono: "border-[var(--border)] bg-transparent font-mono text-[var(--text-dim)] tracking-widest uppercase text-[10px]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
