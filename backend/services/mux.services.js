import Mux from "@mux/mux-node";
import dotenv from "dotenv";

dotenv.config();

const mux = new Mux({
   tokenId: process.env.MUX_ID,
  tokenSecret:
    process.env.MUX_SECRET,
});

export const generateMuxUploadUrl = async() => {
  try {
    const upload = await mux.video.uploads.create({
      cors_origin: "http://localhost:5173",
      timeout:233333,
      new_asset_settings: {
        playback_policy: ["public"]
      },
    });
    console.log('upload',upload);

    return upload; // Returns upload URL and asset details
  } catch (error) {
    console.error("Mux Upload Error:", error);
    throw error;
  }

};
