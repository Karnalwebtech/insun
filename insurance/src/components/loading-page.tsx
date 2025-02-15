import { Loader2 } from 'lucide-react'
interface LoadingPageProps {
    class_style?:string;
}
export default function LoadingPage({class_style="text-primary"}:LoadingPageProps) {
    return (
        <div className="absolute w-full">
            <div className="flex flex-col items-center justify-center w-[100%] bg-tansparent">
                <Loader2 className={`h-12 w-12 animate-spin ${class_style}`} />
                <p className={`mt-4 text-lg font-semibold text-center ${class_style}`}>Loading...</p>
                <p className="mt-2 text-sm text-center text-gray-200">Please wait while we fetch your content.</p>
            </div>
        </div>
    )
}
