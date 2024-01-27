'use client'

import { useCallback, useEffect, useState } from 'react'

const Home = () => {
    const [wordle, setWordle] = useState<string[]>([])
    const [words, setWords] = useState<string[]>([])
    let currentRow = words.length

    const handleKeystroke = useCallback(
        (e: KeyboardEvent) => {
            const char = e.key.toUpperCase()

            // console.log(`Key pressed: ${e.key}`)

            if (e.key === 'Backspace') {
                setWordle(prevWordle => prevWordle.slice(0, -1))
                return
            }

            if (wordle.length === 5 && e.key === 'Enter') {
                setWords(prevWords => [...prevWords, wordle.join('')])
                setWordle([])
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
        console.log('mount')

        return () => {
            document.removeEventListener('keydown', handleKeystroke)
            console.log('unmount')
        }
    }, [handleKeystroke])

    return (
        <main className='flex min-h-screen flex-col items-center p-24'>
            <h1 className='text-7xl mb-16'>Wordle {wordle}</h1>
            <div className='game flex flex-col gap-2'>
                {Array.from({ length: 6 }, (_, i) => (
                    <div key={i} className='flex gap-2'>
                        {Array.from({ length: 5 }, (_, j) => (
                            <div
                                key={j}
                                className='size-20 bg-zinc-700 text-5xl text-center leading-[5rem]'
                            >
                                {words?.[i]?.[j]}
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
