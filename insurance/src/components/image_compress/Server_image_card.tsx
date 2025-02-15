"use client";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

interface ImageCardProps {
    src: string;
    alt: string;
    width: number;
    height: number;
}

export default function Server_image_card({
    src,
    alt,
    width,
    height,
}: ImageCardProps) {

    return (
        <>
            <Card>
                <CardContent>
                    <Image src={src} alt={alt} width={width} height={height} priority />
                </CardContent>
            </Card>
        </>
    );
}