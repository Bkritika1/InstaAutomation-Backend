require("dotenv").config()
const supabase = require("./config/supabase")


const express = require("express")
const axios = require("axios")
const cors = require("cors")
const cron = require("node-cron")

const app = express()

app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 5000

/* -----------------------------
   1️⃣ Start Instagram Login
--------------------------------*/

app.get("/auth/instagram", (req, res) => {

    const authUrl =
        `https://www.facebook.com/v19.0/dialog/oauth?client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}&scope=pages_show_list,instagram_basic,instagram_content_publish&response_type=code`

    res.redirect(authUrl)

})

/* -----------------------------
   2️⃣ OAuth Callback
--------------------------------*/

app.get("/auth/callback", async (req, res) => {

    console.log("CALLBACK ROUTE HIT")

    try {

        const code = req.query.code

        if (!code) {
            return res.send("Authorization code missing")
        }

        const tokenResponse = await axios.get(
            `https://graph.facebook.com/v19.0/oauth/access_token`,
            {
                params: {
                    client_id: process.env.CLIENT_ID,
                    client_secret: process.env.CLIENT_SECRET,
                    redirect_uri: process.env.REDIRECT_URI,
                    code: code
                }
            }
        )

        const accessToken = tokenResponse.data.access_token

        // Get Facebook Pages
        const pages = await axios.get(
            `https://graph.facebook.com/v19.0/me/accounts`,
            {
                params: {
                    access_token: accessToken
                }
            }
        )

        if (!pages.data.data.length) {
            return res.send("No Facebook pages found")
        }
        const pageId = pages.data.data[0].id
        // Get Instagram Business Account
        const igRes = await axios.get(
            `https://graph.facebook.com/v19.0/${pageId}`,
            {
                params: {
                    fields: "instagram_business_account",
                    access_token: accessToken
                }
            }
        )

        const igUserId = igRes.data.instagram_business_account.id

        /* -----------------------------
           GET USERNAME
        --------------------------------*/

        const igUser = await axios.get(
            `https://graph.facebook.com/v19.0/${igUserId}`,
            {
                params: {
                    fields: "username",
                    access_token: accessToken
                }
            }
        )

        const username = igUser.data.username

        /* -----------------------------
           SAVE USER IN DATABASE
        --------------------------------*/

        await supabase
            .from("users")
            .upsert({
                instagram_user_id: igUserId,
                username: username,
                access_token: accessToken
            }, {
                onConflict: "instagram_user_id"
            })

        res.redirect(`http://localhost:5173/dashboard?user_id=${igUserId}`)

    } catch (error) {

        console.log(error.response?.data || error.message)

        res.send("OAuth failed")

    }

})

console.log("CLIENT_ID:", process.env.CLIENT_ID)
console.log("REDIRECT_URI:", process.env.REDIRECT_URI)

/* -----------------------------
   3️⃣ Publish Function
--------------------------------*/

async function publishToInstagram(image_url, caption, accessToken, igUserId) {

    const createMedia = await axios.post(
        `https://graph.facebook.com/v19.0/${igUserId}/media`,
        null,
        {
            params: {
                image_url: image_url,
                caption: caption,
                access_token: accessToken
            }
        }
    )

    const creationId = createMedia.data.id

    await axios.post(
        `https://graph.facebook.com/v19.0/${igUserId}/media_publish`,
        null,
        {
            params: {
                creation_id: creationId,
                access_token: accessToken
            }
        }
    )
}

/* -----------------------------
   4️⃣ Publish Now
--------------------------------*/

app.post("/post", async (req, res) => {

    const { user_id, image_url, caption } = req.body

    try {

        const { data: user } = await supabase
            .from("users")
            .select("*")
            .eq("instagram_user_id", user_id)
            .single()

        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        await publishToInstagram(
            image_url,
            caption,
            user.access_token,
            user.instagram_user_id
        )

        res.json({
            message: "Post published successfully 🚀"
        })

    } catch (error) {

        res.status(500).json(error.response?.data || error.message)

    }

})

/* -----------------------------
   5️⃣ Schedule Post
--------------------------------*/

app.post("/schedule-post", async (req, res) => {

    const { user_id, image_url, caption, schedule_time } = req.body

    try {

        await supabase
            .from("scheduled_posts")
            .insert({
                user_id,
                image_url,
                caption,
                schedule_time,
                status: "pending"
            })

        res.json({
            message: "Post scheduled successfully"
        })

    } catch (err) {

        console.log("FULL ERROR:", err)

        res.status(500).json({
            error: err.message,
            details: err.details
        })

    }

})



/* -----------------------------
   6️⃣ CRON JOB
--------------------------------*/

cron.schedule("* * * * *", async () => {

    const now = new Date().toISOString()

    const { data: posts } = await supabase
        .from("scheduled_posts")
        .select("*")
        .eq("status", "pending")
        .lte("schedule_time", now)

    if (!posts || posts.length === 0) return

    for (const post of posts) {

        try {

            const { data: user } = await supabase
                .from("users")
                .select("*")
                .eq("instagram_user_id", post.user_id)
                .single()

            if (!user) continue

            await publishToInstagram(
                post.image_url,
                post.caption,
                user.access_token,
                user.instagram_user_id
            )

            console.log("Scheduled post published")

            await supabase
                .from("scheduled_posts")
                .update({ status: "published" })
                .eq("id", post.id)

        } catch (err) {

            console.log("Error publishing scheduled post")
            console.log(err.response?.data || err.message)

        }

    }

})

/* -----------------------------
   7️⃣ Get Instagram Account
--------------------------------*/

app.get("/account", async (req, res) => {

    try {

        const { user_id } = req.query

        const { data: user } = await supabase
            .from("users")
            .select("*")
            .eq("instagram_user_id", user_id)
            .single()

        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        const response = await axios.get(
            `https://graph.facebook.com/v19.0/${user.instagram_user_id}`,
            {
                params: {
                    fields: "username,followers_count,media_count",
                    access_token: user.access_token
                }
            }
        )

        res.json(response.data)

    } catch (error) {

        console.log(error.response?.data || error.message)

        res.status(500).json({ error: "Failed to fetch account" })

    }

})

/* -----------------------------
   8️⃣ Get Instagram Posts
--------------------------------*/

app.get("/posts", async (req, res) => {

    try {

        const { user_id } = req.query

        const { data: user } = await supabase
            .from("users")
            .select("*")
            .eq("instagram_user_id", user_id)
            .single()

        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        const response = await axios.get(
            `https://graph.facebook.com/v19.0/${user.instagram_user_id}/media`,
            {
                params: {
                    fields: "id,caption,media_url",
                    access_token: user.access_token
                }
            }
        )

        res.json(response.data)

    } catch (error) {

        console.log(error.response?.data || error.message)

        res.status(500).json({ error: "Failed to fetch posts" })

    }

})

app.get("/test", (req, res) => {
    res.send("backend working")
})

/* -----------------------------
   Server Start
--------------------------------*/
console.log("SUPABASE URL:", process.env.SUPABASE_URL)
app.listen(PORT, () => {
    console.log("Server running on port", PORT)
})