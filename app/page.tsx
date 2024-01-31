import { Metadata } from 'next'
import Wordle from './Wordle'
import { kv } from '@vercel/kv'

export const metadata: Metadata = {
    title: 'Wordle',
    description: 'Play Wordle now!',
}

export const dynamic = 'force-dynamic'

const Home = async () => {
    const wordlist = await kv.smembers('wordlist')
    const answer = ((await kv.srandmember('answers')) as string).toUpperCase()

    return <Wordle wordlist={wordlist} answer={answer} />
}

export default Home
