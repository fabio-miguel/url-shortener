const express = require("express");
const router = express.router();
const { customAlphabet } = require("nanoid");
const validUrl = require("valid-url");
const { DB } = require("../db");

const nanoid = customAlphabet(
  "1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
  6
);

// Return the list of URLs user has shortened
router.get("url", async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).send({ error: "Unauthorized" });
    }

    const data = await DB.find(
      `SELECT long_url, shortened_url_id, id FROM urls WHERE user_id=${userId} ORDER BY created_at DESC`
    );

    res.send({ urls: data, domain: process.env.DOMAIN });
  } catch (error) {}
});
