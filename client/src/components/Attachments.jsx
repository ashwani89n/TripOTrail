import React, { useEffect, useState } from "react";
import api from "../api/api";
import addImg from "../images/AddImage.png";
import addVideo from "../images/AddVideo.png";
import addReceipts from "../images/AddReceipt.png";
import deleteimage from "../images/Delete.png";

const Attachments = ({ id }) => {
  const [fetchedImages, setFetchedImages] = useState([]);
  const [fetchedVideos, setFetchedVideos] = useState([]);
  const [fetchedReceipts, setFetchedReceipts] = useState([]);

  const getMediaById = async () => {
    try {
      const response = await api.get(`/trips/${id}/media`);
      const media = response.data.media;

      const images = media.filter((item) => item.file_type === "image");
      const videos = media.filter((item) => item.file_type === "video");
      const receipts = media.filter((item) => item.file_type === "receipt");

      console.log(images);

      setFetchedImages(images);
      setFetchedVideos(videos);
      setFetchedReceipts(receipts);
    } catch (error) {
      console.log(
        error.response?.data?.message || "Media Loading Unsuccessful"
      );
    }
  };

  useEffect(() => {
    if (id) {
      getMediaById();
    }
  }, [id]);

  // Handle file uploads
  const handleFileUpload = async (file, fileType) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("file_type", fileType);

    try {
      const response = await api.post(`/trips/${id}/media`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // After successful upload, update the state with the new media
      const newMedia = response.data.media;
      if (fileType === "picture") {
        setFetchedImages((prev) => [...prev, newMedia]);
      } else if (fileType === "video") {
        setFetchedVideos((prev) => [...prev, newMedia]);
      } else if (fileType === "receipt") {
        setFetchedReceipts((prev) => [...prev, newMedia]);
      }

      alert("File uploaded successfully!");
      getMediaById();
    } catch (error) {
      console.error("Upload failed", error);
      alert("File upload failed");
    }
  };

  // Handle Add Image
  const handleAddImage = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleFileUpload(file, "image");
    }
  };

  // Handle Add Video
  const handleAddVideo = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleFileUpload(file, "video");
    }
  };

  // Handle Add Receipt
  const handleAddReceipt = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleFileUpload(file, "receipt");
    }
  };

  // Handle Remove Media
  const handleDelete = async (fileUrl) => {

    console.log(fileUrl);

    try {
      await api.delete(`/trips/${id}/media`, {
        params: { file_url: fileUrl },
      });
  
      setTimeout(() => {
        getMediaById(); // Re-fetch fresh data from server
      }, 500);

    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete media.");
    }
  };

  return (
    <div className="min-h-[72vh] mt-5 bg-headerBG pl-10 pt-5 rounded-lg flex flex-col gap-8 text-white">
      {/* Images Row */}
      <div>
        <h2 className="text-lg font-normal mb-2 font-aldrich ">
          Travel&nbsp;<span className="text-topHeader">Photos</span>
        </h2>
        <div className="grid grid-cols-4 gap-4 pr-10 ">
          {fetchedImages.map((img, index) => (
            <div key={index} className="relative group">
              <img
                src={`http://localhost:5000${img.file_url}`}
                alt={`Image ${index + 1}`}
                className="w-full h-[15vh] object-cover rounded-lg"
              />
              <button
                onClick={() => handleDelete(img.file_url, "image")}
                className="absolute top-1 right-1 bg-topHeader text-white rounded-full text-xs p-1 opacity-0 group-hover:opacity-100 transition"
              >
                <img src={deleteimage} className="w-5 h-5"/>
              </button>
            </div>
          ))}
          <label
            htmlFor="image-upload"
            className="bg-calendarView flex items-center justify-center text-topHeader rounded-lg h-[15vh]"
          >
            <div className="flex flex-col text-textCard justify-center items-center">
              <img src={addImg} className="w-8 h-6" />
              Add Image
            </div>
          </label>
          <input
            id="image-upload"
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleAddImage}
          />
        </div>
      </div>

      {/* Videos Row */}
      <div>
        <h2 className="text-lg font-normal mb-2 font-aldrich ">
          Travel&nbsp;<span className="text-topHeader">Videos</span>
        </h2>
        <div className="grid grid-cols-4 gap-4">
          {fetchedVideos.map((vid, index) => (
            <div key={index} className="relative group">
            <video
              key={index}
              controls
              className="w-full h-[15vh] object-contain rounded-lg"
            >
              <source
                src={`http://localhost:5000${vid.file_url}`}
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
            <button
                onClick={() => handleDelete(vid.file_url, "image")}
                className="absolute top-1 right-1 bg-topHeader text-white rounded-full text-xs p-1 opacity-0 group-hover:opacity-100 transition"
              >
                <img src={deleteimage} className="w-5 h-5"/>
              </button>
            </div>
            
          ))}
          <label
            htmlFor="video-upload"
            className="bg-calendarView flex items-center justify-center text-topHeader rounded-lg h-[15vh]"
          >
            <div className="flex flex-col text-textCard justify-center items-center">
              <img src={addVideo} className="w-8 h-6" />
              Add Video
            </div>
          </label>
          <input
            id="video-upload"
            type="file"
            className="hidden"
            accept="video/*"
            onChange={handleAddVideo}
          />
        </div>
      </div>

      {/* Receipts Row */}
      <div>
        <h2 className="text-lg font-normal mb-2 font-aldrich ">
          Travel&nbsp;<span className="text-topHeader">Receipts</span>
        </h2>
        <div className="grid grid-cols-4 gap-4">
          {fetchedReceipts.map((receipt, index) => (
            <div key={index} className="relative group">
            <img
              key={index}
              src={`http://localhost:5000${receipt.file_url}`}
              alt={`Receipt ${index + 1}`}
              className="w-full h-[15vh] object-cover rounded-lg"
            />
            <button
            onClick={() => handleDelete(receipt.file_url, "image")}
            className="absolute top-1 right-1 bg-topHeader text-white rounded-full text-xs p-1 opacity-0 group-hover:opacity-100 transition"
          >
            <img src={deleteimage} className="w-5 h-5"/>
          </button>
          </div>
          ))}
          <label
            htmlFor="receipt-upload"
            className="bg-calendarView flex items-center justify-center text-topHeader rounded-lg h-[15vh]"
          >
            <div className="flex flex-col text-textCard justify-center items-center">
              <img src={addReceipts} className="w-8 h-6" />
              Add Receipt
            </div>
          </label>
          <input
            id="receipt-upload"
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleAddReceipt}
          />
        </div>
      </div>
    </div>
  );
};

export default Attachments;
