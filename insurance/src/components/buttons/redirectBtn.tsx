"use client";

import React from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

interface RedirectBtnProps {
    title: string;
    url: string;
}

const RedirectBtn: React.FC<RedirectBtnProps> = ({ title, url }) => {
    const router = useRouter();

    return (
        <div
            className="my-4">
            <Button onClick={() => router.push(url)}>
                {title}
            </Button>
        </div>
    );
};

export default RedirectBtn;
