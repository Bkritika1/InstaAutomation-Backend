const cron = require("node-cron")
const supabase = require("../config/supabase")
const { publishToInstagram } = require("../services/instagramService")

function startCron() {

    cron.schedule("* * * * *", async () => {

        const now = new Date().toISOString()

        const { data: posts } = await supabase
            .from("scheduled_posts")
            .select("*")
            .eq("status", "pending")
            .lte("schedule_time", now)

        for (const post of posts || []) {

            const { data: user } = await supabase
                .from("users")
                .select("*")
                .eq("instagram_user_id", post.user_id)
                .single()

            const mediaId = await publishToInstagram(
                post.image_url,
                post.caption,
                user.access_token,
                user.instagram_user_id
            )

            await supabase
                .from("scheduled_posts")
                .update({
                    status: "published",
                    media_id: mediaId
                })
                .eq("id", post.id)

        }

    })

}

module.exports = startCron