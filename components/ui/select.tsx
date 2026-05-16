"use client";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
export const Select = SelectPrimitive.Root;
export const SelectValue = SelectPrimitive.Value;
export const SelectTrigger = ({ className, children }: React.ComponentProps<typeof SelectPrimitive.Trigger>) => <SelectPrimitive.Trigger className={cn("flex h-11 w-full items-center justify-between rounded-2xl border border-white/10 bg-white/[.06] px-4 text-sm", className)}>{children}<ChevronDown className="h-4 w-4 opacity-60" /></SelectPrimitive.Trigger>;
export const SelectContent = ({ className, children }: React.ComponentProps<typeof SelectPrimitive.Content>) => <SelectPrimitive.Portal><SelectPrimitive.Content className={cn("z-50 overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b18]/95 p-1 shadow-2xl backdrop-blur-xl", className)}><SelectPrimitive.Viewport>{children}</SelectPrimitive.Viewport></SelectPrimitive.Content></SelectPrimitive.Portal>;
export const SelectItem = ({ className, children, value }: React.ComponentProps<typeof SelectPrimitive.Item>) => <SelectPrimitive.Item value={value} className={cn("relative flex cursor-pointer select-none items-center rounded-xl px-9 py-2 text-sm outline-none hover:bg-white/10", className)}><span className="absolute left-3"><SelectPrimitive.ItemIndicator><Check className="h-4 w-4" /></SelectPrimitive.ItemIndicator></span><SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText></SelectPrimitive.Item>;
