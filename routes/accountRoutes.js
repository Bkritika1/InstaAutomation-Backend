const express = require("express")
const axios = require("axios")
const supabase = require("../config/supabase")

const router = express.Router()

/* -----------------------------
   GET ACCOUNT INFO
--------------------------------*/

router.get("/account", async (req, res) => {

    try {

        const { user_id } = req.query

        const { data: user } = await supabase
            .from("users")
            .select("*")
            .eq("instagram_user_id", user_id)
            .single()

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            })
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

    } catch (err) {

        console.log(err.response?.data || err.message)

        res.status(500).json({
            error: "Failed to fetch account"
        })

    }

})

/* -----------------------------
   GET POSTS
--------------------------------*/

router.get("/posts", async (req, res) => {

    try {

        const { user_id } = req.query

        const { data: user } = await supabase
            .from("users")
            .select("*")
            .eq("instagram_user_id", user_id)
            .single()

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

    } catch (err) {

        console.log(err.response?.data || err.message)

        res.status(500).json({
            error: "Failed to fetch posts"
        })

    }

})

/* -----------------------------
   GET SCHEDULED POSTS
--------------------------------*/

router.get("/scheduled-posts", async (req, res) => {

    try {

        const { user_id } = req.query

        const { data } = await supabase
            .from("scheduled_posts")
            .select("*")
            .eq("user_id", user_id)
            .order("schedule_time", { ascending: false })

        res.json(data)

    } catch (err) {

        console.log(err)

        res.status(500).json({
            error: "Failed to fetch scheduled posts"
        })

    }

})

module.exports = router