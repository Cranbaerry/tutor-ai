import { Metadata } from "next"
import Image from "next/image"
import React, { useCallback, useRef, useState } from 'react';

import { Separator } from "@/components/ui/separator"
import { UserNav } from "@/components/ui/user-nav"
import Playground from "@/components/ui/playground"

export const metadata: Metadata = {
    title: "TutorAI",
    description: "Chatbot System with Retrieval Augmentent Generation for Enhanced Self-Learning Experience",
}

export default function Main() {
    return (
        <>
            <div className="hidden h-full flex-col md:flex">
                <div className="container flex flex-col items-start justify-between space-y-2 py-4 sm:flex-row sm:items-center sm:space-y-0 md:h-16">
                    <Image
                        className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert items-center justify-center mr-1"
                        src="/beexpert-logo.svg"
                        alt="BEEXPERT Logo"
                        width={40}
                        height={42.5}
                        priority
                    />
                    <Image
                        className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert items-center justify-center"
                        src="/beexpert-name.svg"
                        alt="BEEXPERT"
                        width={170}
                        height={19}
                        priority
                    />
                    <div className="ml-auto flex w-full space-x-2 sm:justify-end">
                        <UserNav />
                    </div>
                </div>
                <Separator />
                <div className="container h-full py-6">
                    <div className="flex h-full flex-col space-y-4">
                        <Playground />
                    </div>
                </div>
            </div>
        </>
    )
}