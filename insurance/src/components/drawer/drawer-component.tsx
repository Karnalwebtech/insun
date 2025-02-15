"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"

interface DrawerComponentProps {
  title?: string
  description?: string
  children: React.ReactNode
  isOpen: boolean
  setIsOpen: (value: boolean) => void
}

export function DrawerComponent({
  title = "Move Goal",
  description = "Set your daily activity goal.",
  children,
  isOpen,
  setIsOpen,
}: DrawerComponentProps) {
  const contentRef = React.useRef<HTMLDivElement>(null)


  const handleClose = () => {
    setIsOpen(false)
  }

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
     
      <DrawerContent>
        <div ref={contentRef} className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>{title}</DrawerTitle>
            <DrawerDescription>{description}</DrawerDescription>
          </DrawerHeader>
          <div>{children}</div>
          <DrawerFooter>
            <Button>Submit</Button>
            <DrawerClose asChild>
              <Button variant="outline" onClick={handleClose}>
                Close
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

