function Table({
  headings,
  pageName,
  data = [],
  columns,
  buttonConfigs,
  imageConfigs,
  mainButton,
}) {
console.log("data",data);
  return (
      <table className="min-w-full text-left divide-y divide-gray-200 bg-white rounded-2xl overflow-hidden">
        <thead>
          <tr>
            <td colSpan={headings.length} className="bg-white p-5 border-b">
              <div className="w-full flex justify-between items-center text-[20px]">
                <h2 className="font-bold">{pageName}</h2>
                {mainButton && (
                  <button
                    onClick={mainButton.action}
                    className="px-4 py-2 rounded-lg bg-black text-white"
                  >
                    {mainButton.name}
                  </button>
                )}
              </div>
            </td>
          </tr>
          <tr>
            {headings.map((heading, index) => {
              return (
                <th
                  key={index}
                  className="px-6 py-3 text-[16px] font-semibold text-gray-500 uppercase tracking-wider"
                >
                  {heading}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200  text-[14px] font-semibold">
          {/*  */}
          {data.length !== 0 ? (
            data.map((row) => {
              return (
                <tr key={row._id} className="px-6 py-4 ">
                  {imageConfigs && (
                    <td className="px-8 py-4 ">
                      <div className="max-w-[100px] h-[100px]">
                        <img
                          className="w-full h-full object-cover"
                          src={row.gallery[0]}
                          alt=""
                        />
                      </div>
                    </td>
                  )}
                  {columns.map((col, index) => (
                    <td
                      key={index}
                      className="px-6 py-4 whitespace-nowrap  max-w-[100px] truncate"
                    >
                      {row[col]}
                    </td>
                  ))}
                  {buttonConfigs.map((button, index) => (
                    <td key={index} className="px-8 py-4 whitespace-nowrap">
                      <button
                        onClick={() => button.action(row)}
                        className={`group ${button.styles}`}
                      >
                        {button.icon(row.isActive)}
                        <span className="bg-[#bdbdbd] p-1 text-[10px] absolute z-10 translate-x-2 pointer-events-none opacity-0 group-hover:opacity-100 transition-all ease-in">
                          {button.label}
                        </span>
                      </button>
                    </td>
                  ))}
                </tr>
              );
            })
          ) : (
            <tr>
              <td
                colSpan={headings.length}
                className="px-6 py-4 whitespace-nowrap text-center"
              >
                No {pageName}
              </td>
            </tr>
          )}
        </tbody>
      </table>
  );
}

export default Table;
