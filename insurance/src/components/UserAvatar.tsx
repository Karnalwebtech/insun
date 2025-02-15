import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface User {
    fullname: string
    imageUrl?: string // Optional: Image URL
    alt?: string
    size?: string
}

const UserAvatar: React.FC<User> = ({ fullname, imageUrl, alt, size = "w-[80px] h-[80px]" }) => {
    return (
        <Avatar className={`border-4 border-indigo-500/50 flex items-center justify-center ${size}`}>
            <AvatarImage src={imageUrl || "/assets/img.webp"} alt={alt || "User"} />
            <AvatarFallback>
                {fullname ? fullname
                    .split(" ")
                    .map((word) => word.charAt(0))
                    .join("")
                    .toUpperCase()
                    : "DD"}
            </AvatarFallback>
        </Avatar>
    )
}

export default UserAvatar
