
'use client';

import { Send } from "lucide-react";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export default function FloatingDiscordButton() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href="https://discord.gg"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-20 right-5 z-50 w-14 h-14 flex items-center justify-center rounded-full bg-[#5865F2] text-white shadow-lg hover:scale-110 transition-transform duration-300"
            aria-label="Join our Discord"
          >
            <Send className="w-7 h-7" />
          </Link>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>Join our Discord!</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
