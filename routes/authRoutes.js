const express = require("express")
const axios = require("axios")
const supabase = require("../config/supabase")

const router = express.Router()

/* -----------------------------
   1️⃣ Start Instagram Login
--------------------------------*/

router.get("/auth/instagram", (req, res) => {

    const authUrl =
        `https://www.facebook.com/v19.0/dialog/oauth?client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}&scope=pages_show_list,instagram_basic,instagram_content_publish&response_type=code`

    res.redirect(authUrl)

})

/* -----------------------------
   2️⃣ OAuth Callback
--------------------------------*/

router.get("/auth/callback", async (req, res) => {

    try {

        const code = req.query.code

        const tokenResponse = await axios.get(
            "https://graph.facebook.com/v19.0/oauth/access_token",
            {
                params: {
                    client_id: process.env.CLIENT_ID,
                    client_secret: process.env.CLIENT_SECRET,
                    redirect_uri: process.env.REDIRECT_URI,
                    code
                }
            }
        )

        const accessToken = tokenResponse.data.access_token

        /* get pages */

        const pages = await axios.get(
            "https://graph.facebook.com/v19.0/me/accounts",
            {
                params: { access_token: accessToken }
            }
        )

        const pageId = pages.data.data[0].id

        /* get IG account */

        const igRes = await axios.get(
            `https://graph.facebook.com/v19.0/${pageId}`,
            {
                params: {
                    fields: "instagram_business_account",
                    access_token: accessToken
                }
            }
        )

        const igUserId =
            igRes.data.instagram_business_account.id

        /* get username */

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

        /* store user */

        await supabase
            .from("users")
            .upsert({
                instagram_user_id: igUserId,
                username,
                access_token: accessToken
            }, {
                onConflict: "instagram_user_id"
            })

        res.redirect(
            `http://localhost:5173/dashboard?user_id=${igUserId}`
        )

    } catch (err) {

        console.log(err.response?.data || err.message)

        res.send("OAuth failed")

    }

})

module.exports = router