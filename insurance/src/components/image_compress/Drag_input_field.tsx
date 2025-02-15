import React from "react";
import { useDropzone, DropzoneOptions, Accept } from "react-dropzone";

// Define the type for the onDrop function prop
interface DragInputFieldProps {
    onDrop: (acceptedFiles: File[]) => void;
    type?: string;
    color_class?: string
}
const validMimeTypes: Accept = {
    "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"],
    "application/pdf": [".pdf"],
};

const Drag_input_field: React.FC<DragInputFieldProps> = ({ onDrop, type = 'image/*', color_class = "black" }) => {
    // Configure dropzone options
    const accept: Accept = type in validMimeTypes ? { [type]: validMimeTypes[type] } : { "image/*": validMimeTypes["image/*"] };

    const dropzoneOptions: DropzoneOptions = {
        onDrop,
        accept,
        multiple: true, // Allow multiple files
    };

    // Use the dropzone hook
    const { getRootProps, getInputProps } = useDropzone(dropzoneOptions);

    return (
        <div>
            <div
                {...getRootProps({
                    className:
                        `dropzone px-10 py-10 border-dashed border-1 rounded-xl cursor-pointer border-${color_class} bg-red`,
                })}
            // style={{ border: `1px solid ${color_class}`, margin: '0px 0 10px' }}
            >
                <input {...getInputProps()} />
                <p className={`text-${color_class}`}>Drag &apos n drop some files here, or click to select files</p>
            {/* Display accepted file types dynamically */}
                <p className="mt-4 text-sm text-gray-500">
                    Accepted file types:{" "}
                    {validMimeTypes[type as keyof Accept]?.join(", ") || validMimeTypes["image/*"].join(", ")}
                </p>
            </div>
        </div>
    );
};

export default React.memo(Drag_input_field);