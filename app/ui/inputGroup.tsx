import { UseFormRegister } from "react-hook-form"

export function InputGroup({
  label,
  id,
  type = "text",
  placeholder = "",
  register,
  validation,
  error,
  disabled,
}: {
  label: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  id: any // Flexible ID to support different forms (Login/Register)
  type?: string
  placeholder?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: UseFormRegister<any>
  validation?: object
  error?: string
  disabled?: boolean
}) {
  return (
    <div className="flex flex-col gap-1 ">
      <label htmlFor={id} className="text-sm font-normal text-gray-700">
        {label}
      </label>
      <input
        id={id}
        type={type}
        disabled={disabled}
        placeholder={placeholder}
        {...register(id, validation)} // This wires up the input to RHF
        className={`border p-2 h-10 rounded-md transition-colors focus:outline-none ${
          error
            ? "border-red-500 focus:ring-1 focus:ring-red-500"
            : "border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary"
        }`}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
