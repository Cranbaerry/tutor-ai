'use client'
import React, { useEffect, useState } from 'react';

import { Separator } from "@/components/ui/separator"
import { Header } from "@/components/ui/header";
import { LanguageCode } from '@/lib/definitions';
import { CallBackProps, STATUS, Step } from 'react-joyride';
import { isNewUser } from './actions';
import dynamic from 'next/dynamic';
import Playground from '@/components/ui/playground';

const Joyride = dynamic(() => import('react-joyride').then((mod) => mod.default), {
    ssr: false,
})

interface State {
    run: boolean;
    steps: Step[];
}

export default function Main() {
    const [language, setLanguage] = useState<LanguageCode>('id-ID');
    const onChangeLanguage = (language: LanguageCode) => setLanguage(language)
    const [{ run, steps }, setState] = useState<State>({
        run: false,
        steps: [
          {
            content: <span className='text-sm'>Jangan lupa nyalakan microphone dan pakai earphone/headset supaya interaksimu dengan BEEXPERT lebih lancar.</span>,
            locale: { skip: <strong aria-label="skip">Skip</strong> },
            placement: 'center',
            target: 'body',
            title: <h2 className='font-bold'>Yuk, kenalan dengan fitur-fitur di BEEXPERT!</h2>
          },
          {
            content: <span className='text-sm'>Kamu bisa mengubah bahasa komunikasi dengan BEEXPERT ke Bahasa Inggris dengan menekan tombol berikut.</span>,
            placement: 'bottom',
            target: '.switch__lang',
            title: <h2 className='font-bold'>Ganti Bahasa</h2>
          },
          {
            content: <span className='text-sm'>Saksikan video demo singkat untuk memahami cara penggunaan BEEXPERT.</span>,
            placement: 'bottom',
            styles: {
              options: {
                width: 300,
              },
            },
            target: '.demo__project',
            title: <h2 className='font-bold'>Video Demo</h2>,
          },
          {
            content: <span className='text-sm'>Atur posisi canvas sesukamu!</span>,
            placement: 'right',
            styles: {
              options: {
                width: 300,
              },
            },
            target: '.tool__drag',
            title: <h2 className='font-bold'>Tool: Drag</h2>,
          },
          {
            content: <span className='text-sm'>Tulis cara penyelesaian soal dengan pensil.</span>,
            placement: 'right',
            styles: {
              options: {
                width: 300,
              },
            },
            target: '.tool__pencil',
            title: <h2 className='font-bold'>Tool: Pencil</h2>,
          },
          {
            content: <span className='text-sm'>Gunakan penghapus untuk mengoreksi coretanmu.</span>,
            placement: 'right',
            styles: {
              options: {
                width: 300,
              },
            },
            target: '.tool__eraser',
            title: <h2 className='font-bold'>Tool: Eraser</h2>,
          },
          {
            content: <span className='text-sm'>Kamu bebas memilih warna pensil favoritmu.</span>,
            placement: 'right',
            styles: {
              options: {
                width: 300,
              },
            },
            target: '.tool__color',
            title: <h2 className='font-bold'>Tool: Color</h2>,
          },
          {
            content: <span className='text-sm'>Kamu bisa bebas atur ketebalan pensilmu.</span>,
            placement: 'right',
            styles: {
              options: {
                width: 300,
              },
            },
            target: '.tool__stroke_width',
            title: <h2 className='font-bold'>Tool: Stroke Width</h2>,
          },
          {
            content: <span className='text-sm'>Kembalikan coretanmu satu langkah sebelum.</span>,
            placement: 'right',
            styles: {
              options: {
                width: 300,
              },
            },
            target: '.tool__undo',
            title: <h2 className='font-bold'>Tool: Undo</h2>,
          },
          {
            content: <span className='text-sm'>Kembalikan coretanmu satu langkah setelah.</span>,
            placement: 'right',
            styles: {
              options: {
                width: 300,
              },
            },
            target: '.tool__redo',
            title: <h2 className='font-bold'>Tool: Redo</h2>,
          },
          {
            content: <span className='text-sm'>Klik opsi berikut untuk memperbesar canvas.</span>,
            placement: 'right',
            styles: {
              options: {
                width: 300,
              },
            },
            target: '.tool__zoom_in',
            title: <h2 className='font-bold'>Tool: Zoom In</h2>,
          },
          {
            content: <span className='text-sm'>Klik opsi berikut untuk memperkecil canvas.</span>,
            placement: 'right',
            styles: {
              options: {
                width: 300
              },
            },
            target: '.tool__zoom_out',
            title: <h2 className='font-bold'>Tool: Zoom Out</h2>,
          },
          {
            content: <span className='text-sm'>Kamu bisa mulai berinteraksi dengan menyapa BEEXPERT terlebih dahulu.</span>,
            locale: { skip: <strong aria-label="skip">Skip</strong>, last: <strong aria-label="skip">Done</strong> },
            placement: 'center',
            target: 'body',
            title: <h2 className='font-bold'>Siap Belajar</h2>
          }
        ],
    });
    
    const handleJoyrideCallback = (data: CallBackProps) => {
        const { status, type } = data;
        const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

        if (finishedStatuses.includes(status)) {
            setState({ run: false, steps });
        }
    };

    useEffect(()=>{
        const fetchNewUser = async () => {
            const newUser = await isNewUser()
            if(newUser){
                setState({run: true, steps})
            }
        }
        
        fetchNewUser().catch(console.error)
    },[])

    return (
        <div className="hidden h-full flex-col md:flex">
            <Joyride
                callback={handleJoyrideCallback}
                continuous
                run={run}
                showProgress
                showSkipButton
                steps={steps}
                styles={{
                    options: {
                        zIndex: 10000,
                        arrowColor: "#fff",
                        backgroundColor: "#fff",
                        primaryColor: "#000",
                        textColor: '#000',
                    },
                }}
            />
            <Header isFixed={false} enableChangeLanguage language={language} onChangeLanguage={onChangeLanguage} />
            <Separator />
            <div className="h-full py-6 px-4">
                <div className="flex h-full flex-col">
                    <Playground language={language} />
                </div>
            </div>
        </div>
    )
}