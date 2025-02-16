import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "../ui/button";
import Link from "next/link";

interface LinkTooltipBtnIconProps {
  icon: React.ReactNode;
  title: string | number;
  url: string;
  variant?: "ghost" | "link" | "default" | "destructive" | "outline" | "secondary" | null | undefined;
}
export function LinkTooltipBtnIcon({ icon, title,url,variant="ghost" }: LinkTooltipBtnIconProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link href={url}>
            <Button variant={variant} size="icon">
              {icon}
            </Button>
          </Link>
        </TooltipTrigger>
        <TooltipContent>
          <p>{title}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
