import { Op } from "sequelize";
import { db } from "../db/db.js";
import { message } from "../table/messagesTable.js";
import { ArchivedChat } from "../table/ArchivedChat.js";
import { CronJob } from "cron";

export const archiveMessages = async() => {
  const cutoff = new Date(Date.now()-24*60*60*1000);
  let total = 0;

  while(true){
    const count = await db.transaction(async()=>{
      const oldMessage = await message.findAll({
        where:{
          createdAt:{[Op.lt]:cutoff},
        },
        order:[["id","ASC"]],
        limit:500,
        transaction,
        lock:transaction.lock.update,
      });

      if(oldMessage.length == 0) return 0;

      const rows = oldMessage.map((item)=>item.toJSON());

      ArchivedChat.bulkCreate(rows,{
        transaction,
        validate:true
      });
      
      await message.destroy({
        where:{
          id:{[Op.in]:rows.map ((item)=>item.id)}
        },
        transaction,
      });

      return rows.length;
    });

    total += count;
    if(count == 0) break;
  };

  console.log(`Archived ${total} messages`);
};

export const ArchiveJob = CronJob.from({
  cronTime: "0 0 0 * * *",
  timeZone:"Asia/Kolkata",
  waitForCompletion:true,
  start:false,
  onTick:async() => {
    try {
      archiveMessages();
    } catch (error) {
      console.error("Message archiving failed:", error.message);
    }
  }
});

