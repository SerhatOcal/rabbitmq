const amqp = require("amqplib");
const queueName = process.argv[2] || "jobsQueue";
const data = require("./data.json");
const redis = require("redis");
const client = redis.createClient();

connect();

async function connect() {
  try {
    const connection = await amqp.connect("amqp://localhost:5672");
    const channel = await connection.createChannel();
    const assertion = await channel.assertQueue(queueName);
    // Mesajın Alınması...
    console.log("Mesaj bekleniyor...");
    channel.consume(queueName, message => {
        const messageInfo = JSON.parse(message.content.toString())
        const userInfo = data.find(u => u.id == messageInfo.description)

        if(userInfo){
            console.log("İşlenen Kayıt", userInfo);

            client.set(
                `user_${userInfo.id}`, 
                JSON.stringify(userInfo), 
                (error, replay) => {
                    if (!error) {
                        console.log("Response", replay);
                        channel.ack(message);
                    }
                }
            );
        }
    });
  } catch (error) {
    console.log("Error", error);
  }
}