"use client";

import { useRef, useState, useEffect } from "react";
import "./style.css";

const rootCSS = {
  margin: 0,
};


export default function Camera() {
  const [photoURL, setPhotoURL] = useState(null);
  const videoRef = useRef(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
    } catch (error) {
      console.error("Something went wrong!", error);
    }
  };

  const stopCamera = () => {
    const stream = videoRef.current.srcObject;
    const tracks = stream.getTracks();

    tracks.forEach((track) => track.stop());
  };

  const capturePhoto = async () => {
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // 将canvas转换为DataURL并显示捕获的照片
    const dataURL = canvas.toDataURL("image/jpeg");
    setPhotoURL(dataURL);

    canvas.toBlob(async (blob) => {
      if (blob) {
        const formData = new FormData();
        formData.append("photo", blob, "photo.jpg");

        try {
          const response = await fetch(
             "https://morethanchat.club/server/update_photo",
            //"http://localhost:9210/server/update_photo",
            {
              method: "POST",
              body: formData,
            }
          );

          const data = await response.json();
          setPhotoURL(data.url);
          console.log(data.url);
          gptAgent.send(data.url,)
        } catch (error) {
          console.error("Error uploading photo:", error);
        }
      }
    }, "image/jpeg");
  };

  return (
    <div>
      <video ref={videoRef} autoPlay playsInline style={{ width: "100%" }} />
      <button onClick={startCamera}>Start Camera</button>
      <button onClick={capturePhoto}>Capture Photo</button>
      {photoURL && (
        <>
          <img
            src={photoURL}
            alt="Captured Photo"
            style={{ maxWidth: "100%", height: "auto" }}
          />
          <button onClick={() => navigator.clipboard.writeText(photoURL)}>
            Copy Image URL
          </button>
        </>
      )}
    </div>
  );
}
