import { useEffect, useRef, useState } from "react"
import { Control, useController, UseFormRegister } from "react-hook-form"
import Image from "next/image"
import { RegisterPayload } from "../register/definitions"

interface PhoneInputGroupProps {
  label?: string
  countryCodeId: keyof RegisterPayload
  phoneId: keyof RegisterPayload
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: UseFormRegister<any>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>
  countryCodeOptions: {
    label: string
    value: string
    code?: string
    dialCode?: string
  }[]
  countryCodeValidation?: object
  phoneValidation?: object
  countryCodeError?: string
  phoneError?: string
  countryCodePlaceholder?: string
  phonePlaceholder?: string
  defaultCountry?: string
  disabled?: boolean
}

export function PhoneInputGroup({
  label = "Phone Number",
  countryCodeId,
  phoneId,
  register,
  control,
  countryCodeOptions,
  countryCodeValidation,
  phoneValidation,
  countryCodeError,
  phoneError,
  countryCodePlaceholder = "+00",
  phonePlaceholder = "555-987-6543",
  defaultCountry,
  disabled = false,
}: PhoneInputGroupProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const itemRefs = useRef<(HTMLLIElement | null)[]>([])

  const { field } = useController({
    name: countryCodeId,
    control,
    rules: countryCodeValidation,
    defaultValue: defaultCountry,
  })

  const selectedValue = field.value

  const selectedOption = countryCodeOptions.find(
    (opt) => opt.value === selectedValue,
  )

  const countryCode =
    selectedOption?.code ||
    (selectedOption?.value?.match(/^[A-Za-z]{2}$/)
      ? selectedOption?.value
      : undefined)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Force update default value if provided and field is empty
  useEffect(() => {
    if (!field.value && defaultCountry) {
      field.onChange(defaultCountry)
    }
  }, [defaultCountry, field.value, field])

  // Focus the selected item when the dropdown opens
  useEffect(() => {
    if (isOpen) {
      const selectedIndex = countryCodeOptions.findIndex(
        (opt) => opt.value === field.value,
      )
      const indexToFocus = selectedIndex >= 0 ? selectedIndex : 0
      // Use setTimeout to allow the UI to render the list before focusing
      setTimeout(() => {
        itemRefs.current[indexToFocus]?.focus()
      }, 0)
    }
  }, [isOpen, field.value, countryCodeOptions])

  const handleButtonKeyDown = (e: React.KeyboardEvent) => {
    if (
      !disabled &&
      (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ")
    ) {
      e.preventDefault()
      setIsOpen(true)
    }
  }

  const handleItemKeyDown = (
    e: React.KeyboardEvent,
    index: number,
    value: string,
  ) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        const nextIndex = (index + 1) % countryCodeOptions.length
        itemRefs.current[nextIndex]?.focus()
        break
      case "ArrowUp":
        e.preventDefault()
        const prevIndex =
          (index - 1 + countryCodeOptions.length) % countryCodeOptions.length
        itemRefs.current[prevIndex]?.focus()
        break
      case "Enter":
      case " ":
        e.preventDefault()
        field.onChange(value)
        setIsOpen(false)
        buttonRef.current?.focus()
        break
      case "Escape":
        e.preventDefault()
        setIsOpen(false)
        buttonRef.current?.focus()
        break
      case "Tab":
        setIsOpen(false)
        break
    }
  }

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={phoneId} className="text-sm font-normal text-gray-700">
        {label}
      </label>
      <div
        className={`flex h-10 items-center rounded-md bg-white border relative ${
          isOpen
            ? "border-primary ring-1 ring-primary"
            : "border-gray-300 has-[input:focus-within]:border-primary has-[input:focus-within]:ring-1 has-[input:focus-within]:ring-primary has-[button:focus]:border-primary has-[button:focus]:ring-1 has-[button:focus]:ring-primary"
        }`}
      >
        <div
          className="grid shrink-0 grid-cols-1 focus-within:relative h-full relative"
          ref={containerRef}
        >
          <button
            ref={buttonRef}
            type="button"
            onClick={() => !disabled && setIsOpen(!isOpen)}
            onKeyDown={handleButtonKeyDown}
            disabled={disabled}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            className={`flex items-center h-full rounded-md bg-transparent py-2 pr-8 focus:outline-none ${
              countryCode ? "pl-9" : "pl-2"
            } ${disabled ? "cursor-not-allowed text-gray-400" : "text-gray-500 cursor-pointer"}`}
          >
            {countryCode && (
              <Image
                src={`https://flagcdn.com/w20/${countryCode.toLowerCase()}.png`}
                alt="Flag"
                width={20}
                height={12}
                className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 object-contain z-10"
              />
            )}
            <span className="truncate max-w-16">
              {selectedOption?.dialCode ||
                selectedOption?.label ||
                countryCodePlaceholder}
            </span>
          </button>

          {isOpen && (
            <ul
              role="listbox"
              className="absolute top-full left-0 mt-1 max-h-60 w-64 overflow-auto rounded-md bg-white py-1 text-base shadow-lg border border-gray-300 focus:outline-none sm:text-sm z-50"
            >
              {countryCodeOptions.map((opt, index) => (
                <li
                  key={opt.value}
                  role="option"
                  aria-selected={selectedValue === opt.value}
                  tabIndex={-1} // Programmatically focused
                  ref={(el) => {
                    itemRefs.current[index] = el
                  }}
                  onKeyDown={(e) => handleItemKeyDown(e, index, opt.value)}
                  className={`relative cursor-pointer select-none py-2 pl-10 pr-4 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none ${
                    selectedValue === opt.value
                      ? "bg-gray-50 text-primary font-medium"
                      : "text-gray-900"
                  }`}
                  onClick={() => {
                    field.onChange(opt.value)
                    setIsOpen(false)
                    buttonRef.current?.focus()
                  }}
                >
                  <span className="flex items-center gap-2 font-normal truncate">
                    {opt.code && (
                      <Image
                        src={`https://flagcdn.com/w20/${opt.code.toLowerCase()}.png`}
                        alt=""
                        width={20}
                        height={12}
                        className="object-contain"
                      />
                    )}
                    {opt.label}
                  </span>
                  {selectedValue === opt.value && (
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary">
                      <svg
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}

          <svg
            viewBox="0 0 16 16"
            fill="currentColor"
            data-slot="icon"
            aria-hidden="true"
            className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 size-4 text-gray-500"
          >
            <path
              d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z"
              clipRule="evenodd"
              fillRule="evenodd"
            />
          </svg>
        </div>

        <div className="w-px bg-gray-300 self-stretch my-2"></div>

        <input
          id={phoneId}
          type="tel"
          {...register(phoneId, phoneValidation)}
          placeholder={phonePlaceholder}
          autoComplete="tel"
          className="block w-full h-full min-w-0 grow p-2 text-gray-900 placeholder:text-gray-400 focus:outline-none rounded-md"
        />
      </div>
      {countryCodeError && (
        <p className="text-xs text-red-500">{countryCodeError}</p>
      )}
      {phoneError && <p className="text-xs text-red-500">{phoneError}</p>}
    </div>
  )
}
