"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

const COOKING_TIMES = {
  soft: 180, // 3 minutes
  medium: 300, // 5 minutes
  hard: 420, // 7 minutes
  extraHard: 600, // 10 minutes
}

export default function EggTimer() {
  const [screen, setScreen] = useState<"welcome" | "selection" | "timer">("welcome")
  const [selectedTime, setSelectedTime] = useState<number>(0)
  const [timeLeft, setTimeLeft] = useState<number>(0)
  const [isTimerDone, setIsTimerDone] = useState(false)
  const [isCooking, setIsCooking] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const timerRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    if (timeLeft === 0 && isCooking) {
      setIsTimerDone(true)
      setIsCooking(false)
      if (audioRef.current) {
        audioRef.current.play()
      }
    }
  }, [timeLeft, isCooking])

  useEffect(() => {
    if (isCooking && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)

      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current)
        }
      }
    }
  }, [isCooking, timeLeft])

  const handleStartCooking = (time: number) => {
    setSelectedTime(time)
    setTimeLeft(time)
    setScreen("timer")
    setIsCooking(true)
    setIsTimerDone(false)
  }

  const handleSnooze = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    setTimeLeft(60) // Snooze for 1 minute
    setIsCooking(true)
    setIsTimerDone(false)
  }

  const handleClose = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    setScreen("welcome")
    setIsTimerDone(false)
    setIsCooking(false)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-orange-50 to-orange-100 p-4">
      <Card className="w-full max-w-md p-6 space-y-6">
        {screen === "welcome" && (
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <img src="/screen1.webp?height=200&width=200" alt="Cartoon Egg" className="w-48 h-48 object-contain" />
            </div>
            <h1 className="text-2xl font-bold text-orange-600">Let&apos;s start cooking your egg!</h1>
            <Button
              size="lg"
              className="w-full bg-orange-500 hover:bg-orange-600"
              onClick={() => setScreen("selection")}
            >
              Start
            </Button>
          </div>
        )}

        {screen === "selection" && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-center mb-6">Select your egg preference</h2>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(COOKING_TIMES).map(([type, time]) => (
                <Button
                  key={type}
                  className="h-32 flex flex-col gap-2 bg-white hover:bg-orange-50 border-2 border-orange-200"
                  variant="outline"
                  onClick={() => handleStartCooking(time)}
                >
                  <img
                    src = {`/${type}.jpg?height=50&width=50`}
                    alt={`${type} egg`}
                    className="w-12 h-12 object-contain"
                  />
                  <span className="capitalize">{type.replace(/([A-Z])/g, " $1").trim()}</span>
                  <span className="text-sm text-muted-foreground">{formatTime(time)}</span>
                </Button>
              ))}
            </div>
          </div>
        )}

        {screen === "timer" && (
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <img
                src={isTimerDone ? "/eggcooked.gif?height=200&width=200" : "/eggcooking.gif?height=200&width=200"}
                alt={isTimerDone ? "Cooked Egg" : "Cooking Egg"}
                className={`w-48 h-48 object-contain ${!isTimerDone && "animate-bounce"}`}
              />
            </div>
            <h2 className="text-xl font-semibold">
              {isTimerDone ? "Your egg is ready!" : "Your egg will be ready in:"}
            </h2>
            <div className="text-4xl font-bold text-orange-600">{formatTime(timeLeft)}</div>
            {isTimerDone && (
              <div className="flex gap-4">
                <Button className="flex-1" variant="outline" onClick={handleSnooze}>
                  Snooze
                </Button>
                <Button className="flex-1" onClick={handleClose}>
                  Close
                </Button>
              </div>
            )}
          </div>
        )}
      </Card>
      <audio ref={audioRef} src="/alarm.mp3" />
    </div>
  )
}

