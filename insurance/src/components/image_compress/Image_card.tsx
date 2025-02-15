import * as React from "react";
import { Trash2 } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import Image from "next/image";
import { Button } from "../ui/button";

interface ImageCardProps {
    item: {
        file:string,
        name:string,
    };
    index: number;
    onDelete: (index: number) => void; // Pass a delete handler function
}

export default function ImageCard({ item, index, onDelete }: ImageCardProps) {
    return (
        <Card key={item.file} className="relative">
            <CardContent className="relative group">
                {/* Image */}
                <Image
                    src={item.file}
                    alt={item.name}
                    width={200}
                    height={200}
                    className="block"
                />
                {/* Delete Button */}
                <div className="absolute z-10 inset-0 w-full h-full flex items-center justify-center bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button onClick={() => onDelete(index)}>
                        <Trash2 color="red" size={20} />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}