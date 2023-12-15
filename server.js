import cors from "cors";
import express from "express";
import ytdl from "ytdl-core";

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(cors()); // Enable CORS

app.post("/download", async (req, res) => {
  const { videoUrl } = req.body;

  try {
    const info = await ytdl.getInfo(videoUrl);
    const meta = await ytdl.getBasicInfo(videoUrl);

    // Choose the highest quality audio format
    const audioFormat = ytdl.chooseFormat(info.formats, {
      quality: "highestaudio",
    });

    if (!audioFormat) {
      throw new Error("No audio formats available");
    }

    res.header(
      "Content-Disposition",
      `attachment; filename="${meta.videoDetails.title}.mp3"`
    );
    ytdl(videoUrl, { format: audioFormat }).pipe(res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
