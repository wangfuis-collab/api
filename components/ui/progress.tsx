import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "@/lib/utils";
export function Progress({ value = 0, className }: { value?: number; className?: string }) {
  return <ProgressPrimitive.Root className={cn("relative h-3 overflow-hidden rounded-full bg-white/10", className)}><ProgressPrimitive.Indicator className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-fuchsia-500 transition-all" style={{ transform: `translateX(-${100 - value}%)` }} /></ProgressPrimitive.Root>;
}
