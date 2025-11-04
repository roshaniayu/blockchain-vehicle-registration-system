"use client";

export function ProfileTable(props: {
  mainTitle: string;
  dataset: { title: string; value: string }[];
}) {
  const { mainTitle, dataset } = props;

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg mb-4">
      <div className="bg-white/20 p-4">
        <h5 className="font-bold"> {mainTitle} </h5>
      </div>
      <table className="w-full text-sm text-left rtl:text-right text-black">
        <tbody>
          {dataset.map((data, index) => (
            <tr
              key={index}
              className="odd:bg-zinc-800 text-white even:bg-zinc-700"
            >
              <th
                scope="row"
                className="px-6 py-4 font-medium whitespace-nowrap text-gray-500 "
              >
                {data.title}:
              </th>
              <td className="px-6 py-4">{data.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
