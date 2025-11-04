"use client";

import { useRef } from "react";

// Helpers
import { useClickOutside } from "@/helpers/triggers";

export function StaticPopup(props: {
  className?: string;
  title?: string;
  children: React.ReactNode;
  closeHandler: () => void;
}) {
  const wrapperRef = useRef(null);
  const { children, className, title, closeHandler } = props;

  useClickOutside(wrapperRef, () => {
    closeHandler();
  });

  return (
    <div
      className={`flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full 
        bg-black/10 backdrop-blur-2xl
        ${className}`}
    >
      <div className="relative p-4 w-full max-w-2xl max-h-full">
        <div
          ref={wrapperRef}
          className="relativerounded-xl shadow-sm bg-zinc-900"
        >
          <div
            className="flex items-center justify-between p-4 md:p-5 rounded-t-xl
             bg-gradient-to-br from-violet-800 to-orange-800"
          >
            <h3 className="text-xl font-semibold  text-white text-center w-full">
              {title}
            </h3>
          </div>
          <div className="p-4">{children}</div>
        </div>
      </div>
    </div>
  );
}
