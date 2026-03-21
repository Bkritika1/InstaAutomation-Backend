const axios = require("axios")

async function publishToInstagram(image_url, caption, accessToken, igUserId) {

    const createMedia = await axios.post(
        `https://graph.facebook.com/v19.0/${igUserId}/media`,
        null,
        {
            params: {
                image_url,
                caption,
                access_token: accessToken
            }
        }
    )

    const creationId = createMedia.data.id

    const publishRes = await axios.post(
        `https://graph.facebook.com/v19.0/${igUserId}/media_publish`,
        null,
        {
            params: {
                creation_id: creationId,
                access_token: accessToken
            }
        }
    )

    return publishRes.data.id
}

module.exports = {
    publishToInstagram
}