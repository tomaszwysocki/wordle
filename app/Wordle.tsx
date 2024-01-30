'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'

type Colors = 'GREEN' | 'YELLOW' | 'GRAY'

interface Letter {
    letter: string
    color: Colors
}

interface Counter {
    [letter: string]: number
}

interface Props {
    wordlist: string[]
    answer: string
}

const Wordle = ({ wordlist, answer }: Props) => {
    const [currentGuess, setCurrentGuess] = useState<string[]>([])
    const [words, setWords] = useState<Letter[][]>([])
    const [didWin, setDidWin] = useState(false)
    const [didLose, setDidLose] = useState(false)
    const [notFound, setNotFound] = useState(false)
    let currentRow = words.length

    const isLetterCorrect = (letter: string, idx: number): Colors => {
        if (letter === answer.toUpperCase().charAt(idx)) {
            return 'GREEN'
        }

        if (answer.toUpperCase().includes(letter)) {
            return 'YELLOW'
        }

        return 'GRAY'
    }

    const countOccurrences = (str: string, letter: string): number => {
        return str.split(letter).length - 1
    }

    const countGreenLetters = (guess: Letter[], letter: string): number => {
        let count = 0
        guess.forEach(guessLetter => {
            if (
                guessLetter.letter === letter &&
                guessLetter.color === 'GREEN'
            ) {
                count++
            }
        })
        return count
    }

    const updateColors = (guess: Letter[]) => {
        const newGuess = [...guess]
        const counter: Counter = {}

        guess.forEach(guessLetter => {
            if (guessLetter.color === 'YELLOW') {
                const occurrencesInAnswer = countOccurrences(
                    answer,
                    guessLetter.letter
                )
                const greensInGuess = countGreenLetters(
                    guess,
                    guessLetter.letter
                )

                counter[guessLetter.letter] =
                    occurrencesInAnswer - greensInGuess
            }
        })

        guess.forEach((guessLetter, idx) => {
            if (guessLetter.color === 'YELLOW') {
                if (counter[guessLetter.letter] > 0) {
                    counter[guessLetter.letter]--
                    return
                }

                newGuess[idx].color = 'GRAY'
            }
        })
    }

    const handleKeyPress = useCallback(
        (e: KeyboardEvent) => {
            setNotFound(false)

            if (didWin) {
                return
            }

            const char = e.key.toUpperCase()

            if (e.key === 'Backspace') {
                setCurrentGuess(prevGuess => prevGuess.slice(0, -1))
                return
            }

            if (currentGuess.length === 5 && e.key === 'Enter') {
                if (!wordlist.includes(currentGuess.join('').toLowerCase())) {
                    setNotFound(true)
                    return
                }

                if (currentGuess.join('') === answer) {
                    setDidWin(true)
                }

                if (currentRow === 5 && currentGuess.join('') !== answer) {
                    setDidLose(true)
                }

                const guess = currentGuess.map((letter, idx) => ({
                    letter: letter,
                    color: isLetterCorrect(letter, idx),
                }))

                updateColors(guess)
                setWords(prevWords => [...prevWords, guess])
                setCurrentGuess([])

                return
            }

            // return if key is not a letter or there are already 5 letters
            if (char.length > 1 || currentGuess.length === 5) {
                return
            }

            if (char.toLowerCase() !== char.toUpperCase()) {
                setCurrentGuess(prevGuess => [...prevGuess, char])
            }
        },
        [currentGuess]
    )

    useEffect(() => {
        document.addEventListener('keydown', handleKeyPress)
        // console.log('mount')

        return () => {
            document.removeEventListener('keydown', handleKeyPress)
            // console.log('unmount')
        }
    }, [handleKeyPress])

    const getBackgroundColor = (color: Colors) => {
        switch (color) {
            case 'GREEN':
                return 'bg-green-600'
            case 'YELLOW':
                return 'bg-yellow-600'
            case 'GRAY':
                return 'bg-zinc-800'
        }
    }

    return (
        <main className='flex min-h-screen flex-col items-center p-24'>
            <div className='flex flex-col items-center h-40'>
                <h1 className='text-7xl'>Wordle</h1>
                {didWin && (
                    <h2 className='text-4xl mt-6 font-light'>You won!</h2>
                )}
                {didLose && (
                    <h2 className='text-4xl mt-6 font-light'>You lost!</h2>
                )}
                {notFound && (
                    <h2 className='text-3xl mt-6 font-light'>Word not found</h2>
                )}
            </div>
            <div className='game flex flex-col gap-[0.5rem]'>
                {Array.from({ length: 6 }, (_, i) => (
                    <div key={i} className='flex gap-[0.5rem]'>
                        {Array.from({ length: 5 }, (_, j) => (
                            <div
                                key={j}
                                className={`size-20 border-solid transition-colors duration-0 ${
                                    i <= currentRow && j < currentGuess.length
                                        ? 'border-zinc-light'
                                        : 'border-zinc-dark'
                                }  ${
                                    i < currentRow
                                        ? `delay-[250ms] animate-flip`
                                        : 'border-2'
                                } font-medium text-5xl text-center leading-[81px] ${
                                    i < currentRow &&
                                    getBackgroundColor(words?.[i]?.[j].color)
                                }`}
                            >
                                {words?.[i]?.[j].letter}
                                {i === currentRow ? currentGuess[j] : ''}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            {didLose && (
                <>
                    <h2 className='text-4xl mt-4 font-light'>The answer was</h2>
                    <span className='text-5xl mt-2 font-normal'>{answer}</span>
                </>
            )}
        </main>
    )
}

export default Wordle