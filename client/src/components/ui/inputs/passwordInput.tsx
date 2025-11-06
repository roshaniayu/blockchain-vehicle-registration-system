"use client";

export function PasswordInput(props: {
  label: string;
  id: string;
  required?: boolean;
  onChange: (newValue: string) => void;
}) {
  const { label, id, onChange, required } = props;

  return (
    <div className="relative z-0 w-full mb-5 group">
      <input
        type="password"
        name={id}
        id={id}
        className="block py-2.5 px-0 w-full text-sm  bg-transparent border-0 border-b-2 appearance-none text-white border-gray-600
         focus:border-blue-500 focus:outline-none focus:ring-0  peer"
        placeholder={""}
        required={required}
        onChange={(e) => onChange(e.target.value)}
      />
      <label
        htmlFor={id}
        className="peer-focus:font-medium absolute text-sm  text-gray-400 duration-300 transform 
        -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4
         peer-placeholder-shown:scale-100 
         peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
      >
        {label}
      </label>
    </div>
  );
}
