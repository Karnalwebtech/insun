import { useState, useCallback, useEffect } from 'react';
import { useToast } from './use-toast';

export interface ImageItem {
    file: string;
    name: string;
}

export const useImageDrop = (limit: number = 1) => {
    const [imageitemData, setImageItemData] = useState<ImageItem[]>([]);
    const [files, setFiles] = useState<File[]>([]);
    const [fileData, setFileData] = useState<File[]>([]);
    const { toast } = useToast();

    // Cleanup object URLs on component unmount or when image data changes
    useEffect(() => {
        // Cleanup function
        return () => {
            imageitemData.forEach((item) => {
                URL.revokeObjectURL(item.file);
            });
        };
    }, [imageitemData]);

    const handleDrop = useCallback((acceptedFiles: File[]) => {
        // Ensure the number of files does not exceed the limit
        if (acceptedFiles.length > limit) {
            toast({
                title: "Success",
                description: `Only ${limit} image(s) are allowed!`,
            });
            return;
        }

        // Create object URLs for each image
        const imageData: ImageItem[] = acceptedFiles.map((file) => ({
            file: URL.createObjectURL(file),
            name: file.name,
        }));
        setFiles(acceptedFiles);
        // Update the state with the new image data
        setImageItemData(imageData);
    }, [limit, toast]);

    return {
        imageitemData,
        handleDrop, files, fileData, setFileData,setImageItemData
    };
};