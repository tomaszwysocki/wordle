interface Props {}

const Keyboard = (props: Props) => {
    const keyboardLetters = 'QWERTYUIOPASDFGHJKLZXCVBNM'.split('')
    const deleteKey = 'Delete'
    const enterKey = 'Enter'

    const fullKeyboard = [
        ...keyboardLetters.slice(0, 19),
        deleteKey,
        ...keyboardLetters.slice(19),
        enterKey,
    ]

    return (
        <div className='mt-6 grid grid-cols-10 gap-1'>
            {fullKeyboard.map((key, idx) => (
                <div
                    key={key}
                    className={`flex select-none cursor-pointer justify-center items-center w-[44px] h-14 text-2xl p-2 border-solid border-zinc-700 rounded border-2 ${
                        key === 'L' ? 'col-span-2' : 'place-self-center'
                    } ${
                        (key === deleteKey || key === enterKey) && 'text-base'
                    } ${idx > 9 && idx < 19 && 'ml-6 -mr-6'} ${
                        idx > 18 ? 'ml-6 -mr-6' : ''
                    } ${
                        key === deleteKey &&
                        'scale-x-[1.55] -translate-x-[12px]'
                    } ${
                        key === enterKey && 'scale-x-[1.55] translate-x-[12px]'
                    }`}
                >
                    <p
                        className={`${
                            (key === deleteKey || key === enterKey) &&
                            'scale-x-[0.65]'
                        }`}
                    >
                        {key}
                    </p>
                </div>
            ))}
        </div>
    )
}

export default Keyboard
