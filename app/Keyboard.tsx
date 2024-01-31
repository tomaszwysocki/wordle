import { KeyboardColors } from './Wordle'

interface Props {
    keyboardColors: KeyboardColors
    didLose: boolean
}

const Keyboard = ({ keyboardColors, didLose }: Props) => {
    const keyboardLetters = 'QWERTYUIOPASDFGHJKLZXCVBNM'.split('')
    const deleteKey = 'Delete'
    const enterKey = 'Enter'

    const fullKeyboard = [
        ...keyboardLetters.slice(0, 19),
        deleteKey,
        ...keyboardLetters.slice(19),
        enterKey,
    ]

    const getBackgroundColor = (
        color: KeyboardColors[keyof KeyboardColors]
    ) => {
        switch (color) {
            case 'GREEN':
                return 'bg-green-600'
            case 'YELLOW':
                return 'bg-yellow-600'
            case 'GRAY':
                return 'bg-zinc-800'
            case null:
                return 'border-solid border-zinc-dark border-2'
        }
    }

    const handleVirtualKeyPress = (key: string) => {
        let event: KeyboardEvent

        if (key === deleteKey) {
            event = new KeyboardEvent('keydown', { key: 'Backspace' })
        } else {
            event = new KeyboardEvent('keydown', { key })
        }

        document.dispatchEvent(event)
    }

    return (
        <div
            className={`${
                didLose ? 'mt-3 sm:mt-6' : 'mt-8 sm:mt-16'
            } grid grid-cols-10 gap-1`}
        >
            {fullKeyboard.map((key, idx) => (
                <div
                    key={key}
                    onClick={() => handleVirtualKeyPress(key)}
                    className={`flex select-none cursor-pointer justify-center items-center w-[34px] sm:w-[44px] h-14 sm:h-14 p-2 font-bold rounded ${getBackgroundColor(
                        keyboardColors[key]
                    )} ${key === 'L' ? 'col-span-2' : 'place-self-center'} ${
                        key === deleteKey || key === enterKey
                            ? 'border-solid border-2 border-zinc-dark text-xs sm:text-base'
                            : 'text-xl sm:text-2xl'
                    } ${idx > 9 && idx < 19 && 'ml-6 -mr-6'} ${
                        idx > 18 ? 'ml-6 -mr-6' : ''
                    } ${
                        key === deleteKey &&
                        'scale-x-[1.72] sm:scale-x-[1.55] -translate-x-[12px] sm:-translate-x-[12px]'
                    } ${
                        key === enterKey &&
                        'scale-x-[1.4] sm:scale-x-[1.55] translate-x-[6.5px] sm:translate-x-[12px]'
                    }`}
                >
                    <p
                        className={`${
                            key === deleteKey &&
                            'scale-x-[0.6] sm:scale-x-[0.65]'
                        } ${
                            key === enterKey &&
                            'scale-x-[0.69] sm:scale-x-[0.65]'
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
