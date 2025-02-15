import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

interface TooltipBtnIconProps {
    icon: React.ReactNode;
    title: string;
}
export function TooltipBtnIcon({ icon, title }: TooltipBtnIconProps) {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger className="border rounded-full border-gray-300 w-8 h-8" asChild>
                <div className="flex justify-center items-end">
                {icon}
                </div>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{title}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}
