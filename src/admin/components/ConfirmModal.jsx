import React from "react";

function ConfirmModal({heading,text,buttonConfigs,mainIcon}) {
  return (
    <div className="absolute inset-0 flex justify-center items-center bg-[#0000006b]">
      <div className="bg-white p-6 max-w-[25%] rounded-lg">
        <div className="flex gap-5">
          <div className="w-16 h-16 mx-auto flex flex-shrink-0  justify-center items-center rounded-full border border-gray-300">
            {mainIcon}
          </div>
          <div>
            <p className="font-bold mb-2">{heading}</p>
            <p className="text-sm">{text}</p>
          </div>
        </div>
        <div className="text-end px-2 mt-5">
        {buttonConfigs.map((buttonConfig, index) => (
        <button
          key={index}
          className={buttonConfig.styles}
          onClick={buttonConfig.action}
        >
          {buttonConfig.name}
        </button>
      ))}
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
