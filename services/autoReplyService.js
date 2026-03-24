const axios = require("axios")
const supabase = require("../config/supabase")
const matchKeywords = require("../utils/matchKeywords")

async function processComment(commentData) {

    try {

        const commentText =
            commentData.text

        const mediaId =
            commentData.media?.id

        const commentId =
            commentData.id

        if (!mediaId || !commentId) return

        console.log("Incoming comment:", commentText)

        /* find post in DB */

        const { data: post } = await supabase
            .from("scheduled_posts")
            .select("*")
            .eq("media_id", mediaId)
            .single()

        if (!post) {

            console.log("No scheduled post found")

            return

        }

        const rules = post.rules || []

        /* find matching rule */

        const matchedRule =
            matchKeywords(commentText, rules)

        if (!matchedRule) {

            console.log("No keyword match")

            return

        }

        console.log(
            "Matched rule:",
            matchedRule.keyword
        )

        /* get user token */

        const { data: user } = await supabase
            .from("users")
            .select("*")
            .eq("instagram_user_id", post.user_id)
            .single()

        /* send reply */

        await axios.post(

            `https://graph.facebook.com/v19.0/${commentId}/replies`,
            null,
            {
                params: {
                    message: matchedRule.reply,
                    access_token: user.access_token
                }
            }

        )

        console.log("Auto reply sent")

    } catch (err) {

        console.log(
            "Auto reply error:",
            err.response?.data || err.message
        )

    }

}

module.exports = {
    processComment
}