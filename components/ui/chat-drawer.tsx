'use client'

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface ChatMessage {
  id: number | string
  sender: string
  message: string
  timestamp: string
}

interface ChatDrawerProps {
  chatLog: ChatMessage[]
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function ChatDrawer({ chatLog, open, onOpenChange }: ChatDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button variant="outline">Open Chat Log</Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Chat Log</SheetTitle>
          <SheetDescription>View your recent conversations</SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-120px)] mt-4 pr-4">
          {chatLog.map((message) => (
            <div key={message.id} className="flex items-start space-x-4 mb-4">
              <Avatar>
                <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${message.sender}`} />
                <AvatarFallback>{message.sender[0]}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold">{message.sender}</span>
                  <span className="text-sm text-muted-foreground">{message.timestamp}</span>
                </div>
                <p className="text-sm">{message.message}</p>
              </div>
            </div>
          ))}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}