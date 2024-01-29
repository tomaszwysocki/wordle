'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'

type Colors = 'GREEN' | 'YELLOW' | 'GRAY'

interface Letter {
    letter: string
    color: Colors
}

const Home = () => {
    const [currentGuess, setCurrentGuess] = useState<string[]>([])
    const [words, setWords] = useState<Letter[][]>([])
    const [answer, setAnswer] = useState('')
    const [didWin, setDidWin] = useState(false)
    const [didLose, setDidLose] = useState(false)
    const [notFound, setNotFound] = useState(false)
    let currentRow = words.length

    const possibleWords = useMemo(
        () => [
            'money',
            'royal',
            'lives',
            'honks',
            'sting',
            'plumb',
            'draft',
            'choke',
            'swift',
            'drive',
            'drove',
            'shoot',
            'cooks',
        ],
        []
    )

    const isLetterCorrect = (letter: string, idx: number): Colors => {
        if (letter === answer.toUpperCase().charAt(idx)) {
            return 'GREEN'
        }

        if (answer.toUpperCase().includes(letter)) {
            return 'YELLOW'
        }

        return 'GRAY'
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
                if (
                    !possibleWords.includes(currentGuess.join('').toLowerCase())
                ) {
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
        setAnswer(
            possibleWords[
                Math.floor(Math.random() * possibleWords.length)
            ].toUpperCase()
        )
    }, [possibleWords])

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
            <div className='game flex flex-col gap-[0.6rem]'>
                {Array.from({ length: 6 }, (_, i) => (
                    <div key={i} className='flex gap-[0.6rem]'>
                        {Array.from({ length: 5 }, (_, j) => (
                            <div
                                key={j}
                                className={`size-20 border-solid transition-colors duration-0 delay-[250ms] border-zinc-700 ${
                                    i < currentRow ? `animate-flip` : 'border-2'
                                } font-medium text-5xl text-center leading-[81px] ${
                                    i < currentRow
                                        ? words?.[i]?.[j].color === 'GREEN'
                                            ? 'bg-green-600'
                                            : words?.[i]?.[j].color === 'YELLOW'
                                            ? 'bg-yellow-600'
                                            : 'bg-zinc-800'
                                        : ''
                                }`}
                            >
                                {words?.[i]?.[j].letter}
                                {i === currentRow ? currentGuess[j] : ''}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </main>
    )
}

export default Home
