import React from 'react';

import { Separator } from "@/components/ui/separator"
import Playground from "@/components/ui/playground"
import { Header } from "@/components/ui/header";

export default function Main() {
    return (
        <>
            <div className="hidden h-full flex-col md:flex">
                <Header isFixed={false} />
                <Separator />
                <div className="h-full py-6 px-4">
                    <div className="flex h-full flex-col space-y-4">
                        <Playground />
                    </div>
                </div>
            </div>
        </>
    )
}