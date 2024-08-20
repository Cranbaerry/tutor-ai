import { Metadata } from "next"
import Image from "next/image"
import React, { useCallback, useRef } from 'react';

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
      <div className="md:hidden">
        <Image
          src="/examples/playground-light.png"
          width={1280}
          height={916}
          alt="TutorAI"
          className="block dark:hidden"
        />
        <Image
          src="/examples/playground-dark.png"
          width={1280}
          height={916}
          alt="TutorAI"
          className="hidden dark:block"
        />
      </div>
      <div className="hidden h-full flex-col md:flex">
        <div className="container flex flex-col items-start justify-between space-y-2 py-4 sm:flex-row sm:items-center sm:space-y-0 md:h-16">
          <h2 className="text-lg font-semibold">TutorAI</h2>
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
