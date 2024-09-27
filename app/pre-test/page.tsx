"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useRouter } from "next/navigation";
import { Header } from "@/components/ui/header";

export default function PreTest() {
  const [selectedAnswer, setSelectedAnswer] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter();
  const correctAnswer = "-cos(P + Q)"

  const options = [
    { letter: "A", city: "-sin(P + Q)" },
    { letter: "B", city: "cos(P + Q)" },
    { letter: "C", city: "-cos(P - Q)" },
    { letter: "D", city: "-cos(P + Q)" },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  const handleNext = () => {
    setLoading(true)
    router.push("/playground")
    setLoading(false)
  }

  const getOptionStyle = (city: string) => {
    if (!submitted) {
      return selectedAnswer === city
        ? "bg-green-500 text-white border-green-500"
        : "bg-white text-black border-black"
    }
    if (city === correctAnswer) {
      return "bg-green-500 text-white border-green-500"
    }
    if (selectedAnswer === city && city !== correctAnswer) {
      return "bg-red-500 text-white border-red-500"
    }
    return "bg-white text-black border-black"
  }

  return (
    <>
      <Header isFixed enableChangeLanguage={false} />
      <main className="flex min-h-screen flex-row items-start justify-center p-20 bg-[rgb(245,245,245)]">
          <div className="h-full w-3/4">
              <div id="pre-test" className="rounded-md border-0 p-4 bg-[rgb(255,255,255)]">
                  <h1 className="font-bold text-3xl mb-4">Pre-Test</h1>
                  <form onSubmit={handleSubmit}>
                      <fieldset className="mb-4">
                      <legend className="text-lg mb-2">
                          Jawablah pertanyaan berikut dengan jujur tanpa bantuan apapun. Tenang, jawaban kalian tidak akan masuk ke nilai rapot kok :D
                      </legend>
                      <div className="flex items-center justify-center mt-2 mb-2">
                        <Image
                            src="/soal/pre-test.png"
                            alt="Pre-test Question"
                            width={504}
                            height={78}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4 mt-8 mb-10" role="radiogroup">
                      {options.map(({ letter, city }) => (
                          <button
                              key={letter}
                              type="button"
                              onClick={() => !submitted && setSelectedAnswer(city)}
                              className={`w-full text-left px-4 py-2 rounded-md border ${getOptionStyle(
                              city
                              )} transition-colors duration-200`}
                              role="radio"
                              aria-checked={selectedAnswer === city}
                              disabled={submitted}
                          >
                              <span className="inline-block w-6 h-6 mr-2 rounded-full border-2 border-current text-center leading-5">
                              {letter}
                              </span>
                              {city}
                          </button>
                      ))}
                      </div>
                      </fieldset>

                      {
                        !submitted ? (
                          <Button
                            type="submit"
                            className="w-full"
                            disabled={!selectedAnswer || submitted}
                          >
                            Submit
                          </Button>
                        ) : (
                          <Button
                            type="button"
                            className="w-full"
                            onClick={handleNext}
                            disabled={loading}
                          >
                            Next
                          </Button>
                        )
                      }
                  </form>
                  {submitted && (
                      <div className="mt-4">
                      {selectedAnswer === correctAnswer ? (
                          <p className="text-green-600" role="alert">
                          Selamat, jawabanmu benar! Yuk, belajar lebih dalam lagi dengan BEEXPERT di halaman selanjutnya!
                          </p>
                      ) : (
                          <p className="text-red-600" role="alert">
                          Jawabanmu kurang tepat. Jawaban yang benar adalah {correctAnswer}. Yuk, mulai belajar dengan BEEXPERT di halaman selanjutnya!
                          </p>
                      )}
                      </div>
                  )}
              </div>
          </div>
      </main>
    </>
  )
}