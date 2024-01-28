'use client'

import { useCallback, useEffect, useState } from 'react'

type Colors = 'GREEN' | 'YELLOW' | 'RED'

interface Letter {
    letter: string
    color: Colors
}

const Home = () => {
    const [wordle, setWordle] = useState<string[]>([])
    const [words, setWords] = useState<Letter[][]>([])
    const [answer, setAnswer] = useState('')
    const [didWin, setDidWin] = useState(false)
    const [notFound, setNotFound] = useState(false)
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

    const isLetterCorrect = (letter: string, idx: number): Colors => {
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
            setNotFound(false)

            if (didWin) {
                return
            }

            const char = e.key.toUpperCase()

            if (e.key === 'Backspace') {
                setWordle(prevWordle => prevWordle.slice(0, -1))
                return
            }

            if (wordle.length === 5 && e.key === 'Enter') {
                if (wordle.join('') === answer) {
                    setDidWin(true)
                }

                if (!possibleWords.includes(wordle.join('').toLowerCase())) {
                    setNotFound(true)
                    return
                }

                const guess = wordle.map((letter, idx) => ({
                    letter: letter,
                    color: isLetterCorrect(letter, idx),
                }))

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
            possibleWords[
                Math.floor(Math.random() * possibleWords.length)
            ].toUpperCase()
        )
    }, [])

    return (
        <main className='flex min-h-screen flex-col items-center p-24'>
            <div className='flex flex-col items-center h-40'>
                <h1 className='text-7xl'>Wordle</h1>
                {didWin && (
                    <h2 className='text-4xl mt-6 font-light'>You won!</h2>
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
                                {(() => {
                                    console.log(`animate-delay-[${j * 0.5}s]`)
                                    return ''
                                })()}
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
