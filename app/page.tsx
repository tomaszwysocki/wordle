'use client'

import { useCallback, useEffect, useState } from 'react'

interface Letter {
    letter: string
    color: 'GREEN' | 'YELLOW' | 'RED'
}

const Home = () => {
    const [wordle, setWordle] = useState<string[]>([])
    const [words, setWords] = useState<Letter[][]>([])
    let currentRow = words.length

    const possibleWords = [
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
    ]

    const [answer, setAnswer] = useState('')

    const isLetterCorrect = (
        letter: string,
        idx: number
    ): 'GREEN' | 'YELLOW' | 'RED' => {
        if (letter === answer.toUpperCase().charAt(idx)) {
            return 'GREEN'
        }

        if (answer.toUpperCase().includes(letter)) {
            return 'YELLOW'
        }

        return 'RED'
    }

    const handleKeystroke = useCallback(
        (e: KeyboardEvent) => {
            const char = e.key.toUpperCase()

            if (e.key === 'Backspace') {
                setWordle(prevWordle => prevWordle.slice(0, -1))
                return
            }

            if (wordle.length === 5 && e.key === 'Enter') {
                // setWords(prevWords => [...prevWords, wordle.join('')])

                const guess = wordle.map((letter, idx) => ({
                    letter: letter,
                    color: isLetterCorrect(letter, idx),
                }))

                console.log(guess)

                setWords(prevWords => [...prevWords, guess])
                setWordle([])

                return
            }

            // return if key is not a letter or there are already 5 letters
            if (char.length > 1 || wordle.length === 5) {
                return
            }

            if (char.toLowerCase() !== char.toUpperCase()) {
                setWordle(prevWordle => [...prevWordle, char])
            }
        },
        [wordle]
    )

    useEffect(() => {
        document.addEventListener('keydown', handleKeystroke)
        // console.log('mount')

        return () => {
            document.removeEventListener('keydown', handleKeystroke)
            // console.log('unmount')
        }
    }, [handleKeystroke])

    useEffect(() => {
        setAnswer(
            possibleWords[Math.floor(Math.random() * possibleWords.length)]
        )
    }, [])

    return (
        <main className='flex min-h-screen flex-col items-center p-24'>
            <h1 className='text-7xl mb-16'>Wordle</h1>
            <div className='game flex flex-col gap-2'>
                {Array.from({ length: 6 }, (_, i) => (
                    <div key={i} className='flex gap-2'>
                        {Array.from({ length: 5 }, (_, j) => (
                            <div
                                key={j}
                                className={`size-20  text-5xl text-center leading-[5rem] ${
                                    i === currentRow && wordle.length === j
                                        ? 'bg-zinc-600'
                                        : 'bg-zinc-700'
                                } ${
                                    i < currentRow
                                        ? words?.[i]?.[j].color === 'GREEN'
                                            ? 'bg-green-500'
                                            : words?.[i]?.[j].color === 'YELLOW'
                                            ? 'bg-yellow-400'
                                            : 'bg-red-600'
                                        : ''
                                }`}
                            >
                                {words?.[i]?.[j].letter}
                                {i === currentRow ? wordle[j] : ''}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </main>
    )
}

export default Home
