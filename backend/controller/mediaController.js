import { supabase } from "../config/supabase.js";
import { groupMessage } from "../table/groupMessage.js";
import { message } from "../table/messagesTable.js";
import { ress } from "./error.js";

export const uploadMedia = async (req, res) => {
  try {
    const file = req.file;
    const { senderId, groupId, receiverId } = req.body;
    if (!file) {
      return ress(req, res, 400, "please select a file", false, null);
    }

    if (!senderId || (!groupId && !receiverId)) {
      return ress(
        req,
        res,
        400,
        "Sender and a group or receiver are required",
        false,
        null,
      );
    }

    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
    const suffix = Math.random().toString(36).slice(2, 10);

    const filePath = `messages/${Date.now()}-${suffix}-${safeName}`;

    const { data: urlData, error: urlError } = await supabase.storage
      .from(process.env.SUPABASE_BUCKET)
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (urlError) throw urlError;

    const { data: signedData, error: signedError } = await supabase.storage
      .from(process.env.SUPABASE_BUCKET)
      .createSignedUrl(urlData.path, 3600);

    if (signedError) throw signedError;

    const attachment = {
      fileUrl: signedData.signedUrl,
      filePath: urlData.path,
      fileName: file.originalname,
      fileType: file.mimetype,
      fileSize: file.size,
    };
    let sevedMessage;

    if (groupId) {
      sevedMessage = await groupMessage.create({
        groupId,
        senderId,
        text: "",
        ...attachment,
      });
    } else {
      sevedMessage = await message.create({
        senderId,
        receiverId,
        message: "",
        ...attachment,
      });
    };

    const payload = {
      ...sevedMessage.toJSON(),
      fileUrl: signedData.signedUrl,
    };

    const io = req.app.get("io");

    if(groupId){
      io.to(`group:${groupId}`).emit("receiveGroupMessage",payload);
    }else{
      io.to(String(senderId)).to(String(receiverId)).emit("receiveMessage",payload);
    }

    return ress(req, res, 200, "File uploaded successfully", true, payload);
  } catch (error) {
    return ress(req, res, 500, error.message, false, null);
  }
};
