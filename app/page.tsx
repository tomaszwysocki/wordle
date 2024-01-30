import { promises as fs } from 'fs'

import Wordle from './Wordle'

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
