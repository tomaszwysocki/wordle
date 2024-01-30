import { Metadata } from 'next'
import Wordle from './Wordle'
import { promises as fs } from 'fs'

export const metadata: Metadata = {
    title: 'Wordle',
    description: 'Play Wordle now!',
}

const Home = async () => {
    const file = await fs.readFile(
        `${process.cwd()}/app/wordlist.json`,
        'utf-8'
    )

    const wordlist = JSON.parse(file)
    const answer =
        wordlist[Math.floor(Math.random() * wordlist.length)].toUpperCase()

    return <Wordle wordlist={wordlist} answer={answer} />
}

export default Home
