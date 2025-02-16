"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { VisuallyHidden } from "../ui/visually-hidden";

interface DrawerComponentProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  showHeader?: boolean;
  showFooter?: boolean;
  onSubmit?: () => void;
}

export function DrawerComponent({
  title = "Move Goal",
  description = "Set your daily activity goal.",
  children,
  isOpen,
  setIsOpen,
  showHeader = false,
  showFooter = false,
  onSubmit,
}: DrawerComponentProps) {
  const contentRef = React.useRef<HTMLDivElement>(null);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit();
    }
    handleClose();
  };

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerContent>
        <div ref={contentRef} className="flex flex-col h-full">
          {showHeader ? (
            <DrawerHeader>
              <DrawerTitle>{title}</DrawerTitle>
              {description && (
                <DrawerDescription>{description}</DrawerDescription>
              )}
            </DrawerHeader>
          ) : (
            <VisuallyHidden>
              <DrawerTitle>{title}</DrawerTitle>
            </VisuallyHidden>
          )}
          <div className="flex-1 overflow-y-auto p-4">{children}</div>
          {showFooter && (
            <DrawerFooter>
              <Button onClick={handleSubmit}>Submit</Button>
              <DrawerClose asChild>
                <Button variant="outline" onClick={handleClose}>
                  Close
                </Button>
              </DrawerClose>
            </DrawerFooter>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
