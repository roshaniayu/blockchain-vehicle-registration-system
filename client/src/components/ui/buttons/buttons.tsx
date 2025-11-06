"use client";

export function Button(props: {
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  const { children, className, onClick } = props;

  return (
    <button
      className={`
        text-white rounded-lg text-sm w-full 
        sm:w-auto px-5 py-2.5 text-center cursor-pointer
        bg-gradient-to-br from-violet-800 to-orange-800
        font-bold
        ${className}
       `}
      onClick={() => (onClick ? onClick() : null)}
    >
      {children}
    </button>
  );
}

export function ButtonOutline(props: {
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  const { children, className, onClick } = props;

  return (
    <div
      className={`rounded-lg p-px bg-linear-to-r from-violet-500 to-orange-500 group text-center ${className}`}
    >
      <div
        className="bg-zinc-900 rounded-lg 
        group-hover:bg-linear-to-br
      group-hover:from-zinc-800 group-hover:to-gray-900
        group-hover:transition group-hover:duration-300 p-2
      "
      >
        <button
          type="submit"
          className={`
        rounded-lg text-sm w-full 
        sm:w-auto text-center cursor-pointer
        bg-clip-text text-transparent bg-linear-to-br from-violet-900 to-orange-400
        font-bold
        ${className}
       `}
          onClick={() => (onClick ? onClick() : null)}
        >
          {children}
        </button>
      </div>
    </div>
  );
}
