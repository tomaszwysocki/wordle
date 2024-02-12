'use client'

import { useCallback, useEffect, useState } from 'react'
import Keyboard from './Keyboard'

type Colors = 'green' | 'yellow' | 'gray'
type GameStatus = 'playing' | 'lost' | 'won'

interface Letter {
    letter: string
    color: Colors
}

interface Counter {
    [letter: string]: number
}

export interface KeyboardColors {
    [letter: string]: Colors | null
}

interface WordleProps {
    wordlist: string[]
    answer: string
}

const Wordle = ({ wordlist, answer }: WordleProps) => {
    const [currentGuess, setCurrentGuess] = useState<string[]>([])
    const [words, setWords] = useState<Letter[][]>([])
    const [gameStatus, setGameStatus] = useState<GameStatus>('playing')
    const [notFound, setNotFound] = useState(false)
    const [keyboardColors, setKeyboardColors] = useState<KeyboardColors>(() => {
        const letters = 'QWERTYUIOPASDFGHJKLZXCVBNM'
        const initialObject: KeyboardColors = {}

        for (const letter of letters) {
            initialObject[letter] = null
        }

        return initialObject
    })
    const currentRow = words.length

    const isLetterCorrect = (letter: string, idx: number): Colors => {
        if (letter === answer.toUpperCase().charAt(idx)) {
            return 'green'
        }

        if (answer.toUpperCase().includes(letter)) {
            return 'yellow'
        }

        return 'gray'
    }

    const countOccurrences = (str: string, letter: string): number => {
        return str.split(letter).length - 1
    }

    const countGreenLetters = (guess: Letter[], letter: string): number => {
        let count = 0
        guess.forEach(guessLetter => {
            if (
                guessLetter.letter === letter &&
                guessLetter.color === 'green'
            ) {
                count++
            }
        })
        return count
    }

    const updateGuessColors = (guess: Letter[]) => {
        const newGuess = [...guess]
        const counter: Counter = {}

        guess.forEach(guessLetter => {
            if (guessLetter.color === 'yellow') {
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
            if (guessLetter.color === 'yellow') {
                if (counter[guessLetter.letter] > 0) {
                    counter[guessLetter.letter]--
                    return
                }

                newGuess[idx].color = 'gray'
            }
        })
    }

    const handleKeyPress = useCallback(
        (e: KeyboardEvent) => {
            setNotFound(false)

            if (gameStatus === 'won') {
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
                    setGameStatus('won')
                }

                if (currentRow === 5 && currentGuess.join('') !== answer) {
                    setGameStatus('lost')
                }

                const guess = currentGuess.map((letter, idx) => ({
                    letter: letter,
                    color: isLetterCorrect(letter, idx),
                }))

                updateGuessColors(guess)
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

    useEffect(() => {
        words.forEach(word => {
            word.forEach(letter => {
                setKeyboardColors(prevColors => {
                    if (
                        keyboardColors[letter.letter] === 'green' ||
                        (keyboardColors[letter.letter] === 'yellow' &&
                            letter.color !== 'green')
                    ) {
                        return prevColors
                    }

                    return { ...prevColors, [letter.letter]: letter.color }
                })
            })
        })
    }, [words])

    const getBackgroundColor = (color: Colors) => {
        switch (color) {
            case 'green':
                return 'bg-green-600'
            case 'yellow':
                return 'bg-yellow-600'
            case 'gray':
                return 'bg-zinc-800'
        }
    }

    return (
        <main className='flex min-h-screen flex-col items-center py-2'>
            <div className='flex flex-col items-center h-[110px] sm:h-40'>
                <h1 className='text-[50px] sm:text-[62px] leading-[65px] sm:leading-[93px]'>
                    Wordle
                </h1>
                {gameStatus === 'won' ? (
                    <h2 className='text-3xl sm:text-4xl sm:mt-2 font-light'>
                        You won!
                    </h2>
                ) : (
                    gameStatus === 'lost' && (
                        <h2 className='text-3xl sm:text-4xl sm:mt-2 font-light'>
                            You lost!
                        </h2>
                    )
                )}
                {notFound && (
                    <h2 className='text-2xl sm:text-3xl sm:mt-4 font-light'>
                        Word not found
                    </h2>
                )}
            </div>
            <div className='flex flex-col gap-[0.5rem]'>
                {Array.from({ length: 6 }, (_, i) => (
                    <div key={i} className='flex gap-[0.5rem]'>
                        {Array.from({ length: 5 }, (_, j) => (
                            <div
                                key={j}
                                className={`flex justify-center size-14 sm:size-16 border-solid transition-colors duration-0 items-center font-medium text-3xl sm:text-4xl text-center select-none ${
                                    i === currentRow && j < currentGuess.length
                                        ? 'border-zinc-light animate-pop'
                                        : 'border-zinc-dark'
                                } ${
                                    i < currentRow
                                        ? `delay-[250ms] animate-flip`
                                        : 'border-2'
                                }  ${
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
            {gameStatus === 'lost' && (
                <>
                    <h2 className='text-3xl sm:text-4xl mt-3 sm:mt-4 font-light'>
                        The answer was
                    </h2>
                    <span className='text-4xl sm:text-5xl mt-2 font-normal'>
                        {answer}
                    </span>
                </>
            )}
            <Keyboard
                keyboardColors={keyboardColors}
                didLose={gameStatus === 'lost'}
            />
        </main>
    )
}

export default Wordle
