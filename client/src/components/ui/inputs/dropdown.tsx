"use client";

import { useState } from "react";

export function Dropdown(props: {
  optionsList: Record<string, string> | string[];
  label: string;
  selected: string;
  onChange: (newValue: string, idx?: number) => void;
  className?: string;
}) {
  const { optionsList, label, selected, className, onChange } = props;

  const [toggle, setToggle] = useState<boolean>(false);

  return (
    <div
      className={`flex items-center text-[14px] gap-2 ${className} relative`}
    >
      <div className="w-32 text-gray-400">{label}</div>
      <button
        id="dropdownDefaultButton"
        data-dropdown-toggle="dropdown"
        className="justify-between text-white ring-2 ring-zinc-500 focus:outline-none w-full cursor-pointer
          font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
        type="button"
        onClick={() => setToggle(!toggle)}
      >
        {selected === "" && "Please select user"}
        {Array.isArray(optionsList) ? selected : optionsList[selected]}
        <svg
          className="w-2.5 h-2.5 ms-3"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 4 4 4-4"
          />
        </svg>
      </button>
      {toggle && (
        <div
          id="dropdown"
          className="z-20 w-full bg-zinc-500/50 backdrop-blur-md 
          divide-y divide-gray-100 rounded-lg shadow-sm
          absolute top-12 overflow-hidden"
        >
          <ul
            className=" overflow-hidden text-sm text-gray-200 grid"
            aria-labelledby="dropdownDefaultButton"
          >
            {typeof optionsList === "object" &&
              !Array.isArray(optionsList) &&
              Object.entries(optionsList).map(([k, v]) => (
                <li
                  key={k}
                  className="hover:bg-zinc-200 hover:text-black cursor-pointer px-4 py-2"
                  onClick={() => {
                    onChange(k);
                    setToggle(false);
                  }}
                >
                  {v}
                </li>
              ))}

            {Array.isArray(optionsList) &&
              optionsList.map((o, idx) => (
                <li
                  key={o + idx}
                  className="hover:bg-zinc-200 hover:text-black cursor-pointer px-4 py-2"
                  onClick={() => {
                    onChange(o, idx);
                    setToggle(false);
                  }}
                >
                  {o}
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
}
