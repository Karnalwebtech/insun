import Image from "next/image"

interface LazyImageProps {
  src: string
  alt: string
  width: number
  height: number
}

export default function LazyImage({ src, alt, width, height }: LazyImageProps) {
  return (
    <div className="relative w-full h-full">
      <Image
        src={src}
        alt={alt}
        width={width} 
        height={height} 
        style={{ objectFit: "cover" }} 
        priority
      />
    </div>
  )
}

