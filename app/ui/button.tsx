import clsx from "clsx"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode
    textColor?: string
}

export function Button({ children, className, textColor, ...rest }: ButtonProps) {
    return (
        <button
            {...rest}
            className={clsx(
                "flex items-center justify-center rounded-md bg-primary px-8 py-1.5 text-sm font-medium hover:text-white transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-100 hover:bg-primary/95 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-primary active:bg-primary/80 aria-disabled:cursor-not-allowed aria-disabled:opacity-50",
                textColor,
                className,
            )}
        >
            {children}
        </button>
    )
}
