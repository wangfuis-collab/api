import * as React from "react";
import { cn } from "@/lib/utils";
export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(({ className, ...props }, ref) => <textarea ref={ref} className={cn("min-h-32 w-full rounded-3xl border border-white/10 bg-white/[.06] p-4 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/15", className)} {...props} />);
Textarea.displayName = "Textarea";
