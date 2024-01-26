const Home = () => {
    return (
        <main className='flex min-h-screen flex-col items-center p-24'>
            <h1 className='text-7xl mb-16'>Wordle</h1>
            <div className='game flex flex-col gap-2'>
                {Array.from({ length: 6 }, (_, i) => (
                    <div key={i} className='flex gap-2'>
                        {Array.from({ length: 5 }, (_, j) => (
                            <div
                                key={j}
                                className='size-20 bg-zinc-700 text-4xl text-center leading-[5rem]'
                            >
                                A
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </main>
    )
}

export default Home
