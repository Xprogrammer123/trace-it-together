
import { cn } from "@/lib/utils";
import React from "react";

interface IconBadgeProps {
  icon: React.ReactNode;
  className?: string;
}

export function IconBadge({ icon, className }: IconBadgeProps) {
  return (
    <div className={cn("w-12 h-12 rounded-full flex items-center justify-center bg-primary/10 text-primary", className)}>
      {icon}
    </div>
  );
}
