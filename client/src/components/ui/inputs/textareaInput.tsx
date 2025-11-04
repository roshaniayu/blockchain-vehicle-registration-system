"use client";

export function Textarea(props: {
  id: string;
  label: string;
  onChange: (newValue: string) => void;
}) {
  const { id, label } = props;
  return (
    <div className="relative z-0 w-full mb-5 group">
      <textarea
        id={id}
        rows={4}
        className="block py-2.5 px-0 w-full text-sm  bg-transparent 
        border-0 border-b-2  appearance-none text-white border-gray-600 
         focus:outline-none peer"
        placeholder={""}
        onChange={(e) => props.onChange(e.target.value)}
      ></textarea>
      <label
        htmlFor={id}
        className="peer-focus:font-medium absolute text-sm 
        text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0
         peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
      >
        {label}
      </label>
    </div>
  );
}
