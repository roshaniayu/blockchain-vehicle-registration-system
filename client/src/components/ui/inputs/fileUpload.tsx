"use client";

export function FileUpload(props: {
  label?: string;
  description?: string;
  id: string;
}) {
  const { label, description, id } = props;
  return (
    <div>
      <label className="block mb-2 text-sm font-medium text-white" htmlFor={id}>
        {label}
      </label>
      <input
        className="block w-full text-sm border rounded-lg cursor-pointer text-gray-400 focus:outline-none bg-gray-700 border-gray-600 placeholder-gray-400"
        id={id}
        type="file"
      />
      <div className="mt-1 text-sm text-gray-300">{description}</div>
    </div>
  );
}
