const axios = require("axios");
const { generateClientSecret } = require("../util/apple");
const { generateToken } = require("../util/jwt");
const db = require("../models/db");
const { v4: uuidv4 } = require("uuid");

exports.appleLogin = async (req, res) => {
  const { code } = req.body;
  if (!code) return res.status(400).json({ error: "code missing" });

  try {
    const clientSecret = generateClientSecret();

    const tokenResponse = await axios.post(
      "https://appleid.apple.com/auth/token",
      null,
      {
        params: {
          grant_type: "authorization_code",
          code,
          client_id: process.env.APPLE_CLIENT_ID,
          client_secret: clientSecret,
          redirect_uri: process.env.APPLE_REDIRECT_URI,
        },
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    const { id_token } = tokenResponse.data;
    const decoded = JSON.parse(
      Buffer.from(id_token.split(".")[1], "base64").toString()
    );
    const { sub: apple_id, email } = decoded;

    const [rows] = await db.query("SELECT * FROM Users WHERE apple_id = ?", [
      apple_id,
    ]);

    let user = rows[0];
    if (!user) {
      const user_id = uuidv4();
      await db.query(
        "INSERT INTO Users (user_id, apple_id, email) VALUES (?, ?, ?)",
        [user_id, apple_id, email]
      );
      user = { user_id, email };
    }

    const jwtToken = generateToken(user);
    res.status(200).json({ token: jwtToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Apple login failed" });
  }
};
