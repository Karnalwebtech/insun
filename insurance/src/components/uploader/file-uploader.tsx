"use client"

import React, { useEffect, useMemo, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import Drag_input_field from "../image_compress/Drag_input_field"
import { Button } from "../ui/button"
import Image_card from "../image_compress/Image_card"
import { type ImageItem, useImageDrop } from "@/hooks/handleMediaDrop"

interface FileUploaderProps {
    title: string
    field: string
    set_files: (value: File[]) => void
}

const View_file_handler = (item: ImageItem) => {
    if (item.file) {
        window.open(item.file, "_blank")
    } else if (item.name) {
        window.open(item.name, "_blank")
    }
}

const FileUploader: React.FC<FileUploaderProps> = ({ title, field, set_files }) => {
    const { imageitemData,files, setImageItemData, handleDrop } = useImageDrop(1)

    const handleDelete = useCallback(
        (index: number) => {
            setImageItemData((prev) => prev.filter((_, i) => i !== index))
        },
        [setImageItemData],
    )

    useEffect(() => {
        set_files(files)
    }, [files, set_files])

    const renderedImageCards = useMemo(() => {
        return imageitemData.map((item, idx) => (
            <div key={idx} className="w-full">
                <Image_card item={item} index={idx} onDelete={handleDelete} />
                <Button className="bg-black mt-2 text-white" onClick={() => View_file_handler(item)}>
                    View {field}
                </Button>
            </div>
        ))
    }, [imageitemData, field, handleDelete])

    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                {imageitemData.length > 0 ? (
                    <div className="flex w-full flex-wrap gap-2">{renderedImageCards}</div>
                ) : (
                    <Drag_input_field onDrop={handleDrop} type={field} />
                )}
            </CardContent>
        </Card>
    )
}

export default React.memo(FileUploader)

