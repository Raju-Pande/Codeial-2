// 1st
const kue=require("kue");

const queue=kue.createQueue();

module.exports=queue;

// second create the ne folder workers and inside workers create new file "comment_email_workers.js"