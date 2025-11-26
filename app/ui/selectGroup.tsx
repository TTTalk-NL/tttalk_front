import { UseFormRegister } from "react-hook-form"

export function SelectGroup({
  label,
  id,
  register,
  options,
  validation,
  error,
  placeholder = "Select an option",
  disabled,
}: {
  label: string
  id: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: UseFormRegister<any>
  options: { label: string; value: string }[]
  validation?: object
  error?: string
  placeholder?: string
  disabled?: boolean
}) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-normal text-gray-700">
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          disabled={disabled}
          {...register(id, validation)}
          className={`w-full h-10 font-normal text-gray-500 appearance-none border p-2 pr-8 rounded-md bg-white focus:outline-none ${
            error
              ? "border-red-500 focus:ring-1 focus:ring-red-500"
              : "border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary"
          }`}
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
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
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
