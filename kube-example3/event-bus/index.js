const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

const events = [];

app.post("/events", async (req, res) => {
  const event = req.body;

  // Store the events in the case when the query service goes down
  events.push(event);

  await Promise.all([
    axios.post("http://posts-clusterip-srv:4000/events", event),
    axios.post("http://comments-srv:4001/events", event),
    axios.post("http://query-srv:4002/events", event),
    axios.post("http://moderation-srvs:4003/events", event)
  ]);

  res.send({ status: "OK" });
});

app.get('/events', (req, res) => {
  res.send(events);
});

const PORT = process.env.PORT || 4005;
app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});
