'use client'

import { useCallback, useEffect, useState } from 'react'

const Home = () => {
    const [state, setState] = useState<string[]>([])

    const handleKeystroke = useCallback(
        (e: KeyboardEvent) => {
            const char = e.key.toUpperCase()

            console.log(`Key pressed: ${e.key}`)

            if (e.key === 'Backspace') {
                setState(prevState => prevState.slice(0, -1))
                return
            }

            // return if key is not a letter or there are already 5 letters
            if (char.length > 1 || state.length === 5) {
                return
            }

            if (char.toLowerCase() !== char.toUpperCase()) {
                setState(prevState => [...prevState, char])
            }
        },
        [state]
    )

    useEffect(() => {
        document.addEventListener('keydown', handleKeystroke)

        return () => {
            document.removeEventListener('keydown', handleKeystroke)
        }
    }, [handleKeystroke])

    return (
        <main className='flex min-h-screen flex-col items-center p-24'>
            <h1 className='text-7xl mb-16'>Wordle {state}</h1>
            <div className='game flex flex-col gap-2'>
                {Array.from({ length: 6 }, (_, i) => (
                    <div key={i} className='flex gap-2'>
                        {Array.from({ length: 5 }, (_, j) => (
                            <div
                                key={j}
                                className='size-20 bg-zinc-700 text-4xl text-center leading-[5rem]'
                            ></div>
                        ))}
                    </div>
                ))}
            </div>
        </main>
    )
}

export default Home
