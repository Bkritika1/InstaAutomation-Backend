const express = require("express")

const {
    processComment
} = require("../services/autoReplyService")

const router = express.Router()

/* -----------------------------
   webhook verification
--------------------------------*/

router.get("/webhook", (req, res) => {

    const VERIFY_TOKEN =
        process.env.WEBHOOK_VERIFY_TOKEN

    const mode =
        req.query["hub.mode"]

    const token =
        req.query["hub.verify_token"]

    const challenge =
        req.query["hub.challenge"]

    if (
        mode === "subscribe" &&
        token === VERIFY_TOKEN
    ) {

        console.log("Webhook verified")

        return res
            .status(200)
            .send(challenge)

    }

    res.sendStatus(403)

})

/* -----------------------------
   receive comment events
--------------------------------*/

router.post("/webhook", async (req, res) => {

    try {

        console.log(
            "FULL WEBHOOK BODY:"
        )
        console.log(
            JSON.stringify(req.body, null, 2)
        )

        const entry =
            req.body.entry?.[0]

        const change =
            entry?.changes?.[0]

        const value =
            change?.value

        if (change?.field === "comments") {

            console.log("Comment event detected")

            await processComment(value)

        }

        res.sendStatus(200)

    } catch (err) {

        console.log(
            "Webhook error:",
            err
        )

        res.sendStatus(500)

    }

})

module.exports = router