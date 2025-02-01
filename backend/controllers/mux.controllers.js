import Mux from "@mux/mux-node";
import { Chapter } from "../models/chapters.model.js";
import { generateMuxUploadUrl } from "../services/mux.services.js";

let chapterId = null;

export const getMuxUploadUrl = async (req, res) => {
  try {
    const uploadUrl = await generateMuxUploadUrl();
    chapterId = req.params.chapterId;
    res.status(200).json({ uploadUrl: uploadUrl?.url });
  } catch (error) {
    console.error("Mux Error:", error);
    res.status(500).json({ message: "Failed to generate Mux upload URL" });
  }
};

export const webhookHandler = async(req,res)=>{
    const event = req.body;
    if(event.type === "video.asset.ready"){
        const playbackId = event.data.playback_ids[0].id;
        const assetId = event.data.id;
        try {
            await Chapter.findOneAndUpdate({_id:chapterId},{
                video:{
                  muxAssetId:assetId,
                  muxPlaybackId:playbackId
                }
            })
        } catch (chapterVideoUpdateError) {
            console.log("Error updating chapter video",chapterVideoUpdateError);
        }
    }
   
}