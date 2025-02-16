import type React from "react"
/**
 * @see https://tailwindcss.com/docs/screen-readers
 */
export const VisuallyHidden = ({ children }: { children: React.ReactNode }) => (
  <span className="sr-only">{children}</span>
)

