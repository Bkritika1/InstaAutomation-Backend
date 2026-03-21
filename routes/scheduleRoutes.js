const express = require("express")
const supabase = require("../config/supabase")

const router = express.Router()

router.post("/schedule-post", async (req, res) => {

    const {
        user_id,
        image_url,
        caption,
        schedule_time,
        rules
    } = req.body

    try {


        const { data, error } = await supabase
            .from("scheduled_posts")
            .insert({
                user_id,
                image_url,
                caption,
                schedule_time,
                rules,
                status: "pending"
            })
            .select()

        if (error) {
            console.log("SUPABASE ERROR:", error)

            return res.status(500).json({
                error: error.message
            })
        }

        res.json({
            message: "scheduled",
            data
        })

    } catch (err) {

        console.log("SERVER ERROR:", err)

        res.status(500).json({
            error: "Failed to schedule post"
        })

    }

})

module.exports = router