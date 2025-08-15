const message = require("../../model/message.js");

export const getMessages = async(req, res) => {
  const id = req.params.id;
  try {
    const messages = await message.find({});
    res.send({ success: true, messages })
  } catch (error) {
    res.send({success:false,message:error.message})
  }
}