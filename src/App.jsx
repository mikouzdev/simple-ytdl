import axios from "axios";
import { useState } from "react";
import "./App.css";

function App() {
  const [videoUrl, setVideoUrl] = useState("");
  const [status, setStatus] = useState("");

  const handleDownload = async () => {
    try {
      // Check if the input is a valid YouTube URL
      if (!isValidUrl(videoUrl)) {
        setStatus("Invalid YouTube video URL. Please enter a valid URL.");
        return;
      }

      setStatus("Downloading...");
      const response = await axios.post(
        "http://localhost:3001/download",
        { videoUrl },
        { responseType: "blob" }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "local_download.mp3");
      document.body.appendChild(link);
      link.click();
      setStatus("Download successful!");
    } catch (error) {
      console.error("Error downloading MP3:", error);
      setStatus("Error downloading MP3. Please try again.");
    }
  };

  // Function to check if the input is a valid YouTube URL
  const isValidUrl = (url) => {
    const pattern =
      /^(https?:\/\/)?(www\.)?(youtube\.com\/(?:[^\\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i;
    return pattern.test(url);
  };

  return (
    <div className="App">
      <div className="container">
        <h1 className="title">YouTube MP3 Downloader</h1>
        <div className="controls-container">
          <input
            type="text"
            placeholder="Enter YouTube video URL"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
          />
          <button onClick={handleDownload}>Download MP3</button>
        </div>
      </div>
      <div className="status-box">{status}</div>
    </div>
  );
}

export default App;
