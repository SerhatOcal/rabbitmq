const amqp = require("amqplib");
const message = {description: "Bu bir test mesajıdır.."};
const data = require("./data.json");
const queueName = process.argv[2] || "jobsQueue";

connect();

async function connect() {
  try {
    const connection = await amqp.connect("amqp://localhost:5672");
    const channel = await connection.createChannel();
    const assertion = await channel.assertQueue(queueName);
    // Mesajın Gönderilmesi...
    data.forEach(i => {
        message.description = i.id;
        channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
        console.log("Gonderilen Mesaj", i.id);    
    })

  } catch (error) {
    console.log("Error", error);
  }
}