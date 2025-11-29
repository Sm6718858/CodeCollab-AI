const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const User = require("./Model/User");
const { Webhook } = require("svix");

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));


app.use(
  "/clerk/webhook",
  bodyParser.raw({ type: "application/json" })
);

app.use(express.json());
app.use("/ai", require("./routes/ai.routes"));

app.post("/clerk/webhook", async (req, res) => {
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

  try {
    const evt = wh.verify(req.body, req.headers);

    // console.log(" Clerk Event:", evt.type);

    if (evt.type === "user.created") {
      await User.create({
        clerkId: evt.data.id,
        email: evt.data.email_addresses[0].email_address,
        name: `${evt.data.first_name || ""} ${evt.data.last_name || ""}`,
        image: evt.data.image_url
      });

      // console.log(" USER CREATED & SAVED");
    }
  } catch (err) {
    console.log("Webhook error:", err.message);
  }

  res.json({ status: "ok" });
});

module.exports = app;
