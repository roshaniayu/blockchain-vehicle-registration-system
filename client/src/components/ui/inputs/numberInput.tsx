"use client";

import { useEffect, useState } from "react";

export function NumberInput(props: {
  label: string;
  id: string;
  className?: string;
  size?: number;
  onChange: (newValue: string) => void;
}) {
  const [number, setNumber] = useState(1);

  const { label, id, onChange, className, size } = props;

  useEffect(() => {
    onChange(number.toString());
  }, [number]);

  return (
    <div className={`flex gap-2 items-center ${className}`}>
      <div className="relative flex items-center ring-1 p-2 rounded-xl ring-zinc-700 w-full ">
        <button
          type="button"
          id="decrement-button"
          data-input-counter-decrement={id}
          className={`shrink-0  bg-gray-700 hover:bg-gray-600 
          inline-flex items-center justify-center cursor-pointer
          rounded-md focus:outline-none absolute left-2 p-[10px]`}
          onClick={() => setNumber(number - 1 > 0 ? number - 1 : 1)}
        >
          -
        </button>

        <div className="w-full">
          <input
            min={1}
            type="text"
            id={id}
            data-input-counter
            className="shrink-0  text-white border-0 bg-transparent text-sm 
          focus:outline-none focus:ring-0 text-center w-full font-bold pb-1"
            placeholder=""
            value={number ?? 1}
            onChange={(e) => {
              const isNumber = Number.isNaN(parseInt(e.target.value));
              setNumber(isNumber ? 1 : parseInt(e.target.value));
              onChange(isNumber ? "1" : e.target.value);
            }}
            required
          />
          <label
            htmlFor={id}
            className="block mb-1 font-medium text-gray-600 text-xs text-center "
          >
            {label}
          </label>
        </div>
        <button
          type="button"
          id="increment-button"
          data-input-counter-increment={id}
          className={`shrink-0  bg-gray-700 hover:bg-gray-600 
          inline-flex items-center justify-center cursor-pointer
            rounded-md p-[10px]  focus:outline-none absolute right-2`}
          onClick={() => setNumber(number + 1)}
        >
          +
        </button>
      </div>
    </div>
  );
}
