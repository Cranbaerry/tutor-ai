import { useState } from 'react';
import { Drawer, DrawerContent, DrawerOverlay, DrawerTrigger, DrawerHeader, DrawerPortal, DrawerTitle, DrawerDescription } from "@/components/ui/custom-drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Message } from 'ai/react';
import { Button } from './button';
import { CounterClockwiseClockIcon } from '@radix-ui/react-icons'

interface ChatDrawerProps {
  messages: Message[];
}


const ChatDrawer: React.FC<ChatDrawerProps> = ({ messages }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        {/* Trigger Button */}
        <Drawer open={isOpen} onOpenChange={setIsOpen} direction="right" noBodyStyles={true}>
            <DrawerTrigger asChild>
                <Button variant={"secondary"} className='border border-2'>
                    <CounterClockwiseClockIcon />
                </Button>
            </DrawerTrigger>

            <DrawerPortal>
                {/* Drawer Overlay */}
                <DrawerOverlay className="fixed inset-0 bg-black bg-opacity-30 z-40" />

                {/* Drawer Content */}
                <DrawerContent className="bg-transparent left-2/3 h-full outline-none border-none ">
                <div className="bg-white rounded-[16px] grow mt-2 mr-2 mb-2 flex flex-col">

                    <DrawerHeader className="p-4 bg-gray-100 border-b flex justify-between items-center">
                        <h2 className="text-lg font-bold">Chat History</h2>
                    </DrawerHeader>

                    <DrawerDescription>
                        <ScrollArea className="h-full p-4 ">
                        <div className="space-y-4">
                            {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`p-3 rounded-lg ${
                                msg.role === 'user' ? 'bg-blue-100 self-end' : 'bg-gray-100 self-start'
                                }`}
                            >
                                {msg.content}
                            </div>
                            ))}
                        </div>
                        </ScrollArea>
                    </DrawerDescription> 
                </div>
                </DrawerContent>
            </DrawerPortal>
        </Drawer>
      </>
    );
  };
  
  export default ChatDrawer;