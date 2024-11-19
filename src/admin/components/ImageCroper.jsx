import React, { useRef, useState } from "react";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import canvasOutput from "./javascripts/canvasOutput";

const ASPECT_RATIO = 1;
const MIN_DIMENSION = 150;

function ImageCroper({ imageSrc, closeModal, updateProfile }) {
  const [crop, setCrop] = useState({
    unit: "px",
    width: 0,
    height: 0,
    x: 0,
    y: 0,
  });
  const imageRef = useRef(null);
  const canvasRef = useRef(null);
  const onImageLoad = (e) => {
    const { width, height } = e.target;
    const crop = makeAspectCrop(
      {
        unit: "px",
        width: Math.min(width, height) * 0.6,
      },
      ASPECT_RATIO,
      width,
      height
    );
    setCrop(crop);
  };

  async function handleCanvas() {
    try {
      const blob = await canvasOutput(
        imageRef.current,
        canvasRef.current,
        crop
      );
      const file = new File([blob], "croppedImage.jpg", { type: blob.type });
      updateProfile(file);
      closeModal();
    } catch (error) {
      console.error("Error cropping the image:", error);
    }
  }

  return (
    <div className="min-h-screen absolute z-[999] inset-0 flex justify-center items-center bg-[#000000d5]">
      <div className="bg-white relative flex flex-col items-center gap-5 p-5 rounded-xl">
            <a
              onClick={closeModal}
              className="text-[20px] px-5 py-3 absolute right-2 top-2 z-[9999] text-white bg-black rounded-full"
            >
              <i className="fas fa-x"></i>
            </a>
        <ReactCrop
          crop={crop}
          onChange={(newCrop) => setCrop(newCrop)}
          keepSelection
          aspect={ASPECT_RATIO}
          minWidth={MIN_DIMENSION}
        >
          <div className="w-[1000px] h-[70vh] rounded-xl relative">
            <img
              ref={imageRef}
              src={imageSrc}
              alt="Crop Preview"
              crossOrigin="anonymous"
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
              onLoad={onImageLoad}
            />
          </div>
        </ReactCrop>
        <a
          onClick={handleCanvas}
          className="px-5 py-3 rounded-md text-[20px] bg-black text-white"
        >
          Crop Image
        </a>
      </div>

      <canvas
        ref={canvasRef}
        style={{
          display: "none",
          border: "1px solid black",
          objectFit: "contain",
          width: 150,
          height: 150,
        }}
      />
    </div>
  );
}

export default ImageCroper;
