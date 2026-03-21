const express = require("express")
const supabase = require("../config/supabase")
const { publishToInstagram } = require("../services/instagramService")

const router = express.Router()

router.post("/post", async (req, res) => {

    const { user_id, image_url, caption } = req.body

    const { data: user } = await supabase
        .from("users")
        .select("*")
        .eq("instagram_user_id", user_id)
        .single()

    const mediaId = await publishToInstagram(
        image_url,
        caption,
        user.access_token,
        user.instagram_user_id
    )

    res.json({ mediaId })

})

module.exports = router