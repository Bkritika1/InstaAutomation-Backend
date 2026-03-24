function matchKeywords(commentText, rules = []) {

    if (!commentText) return null

    const text = commentText.toLowerCase()

    for (const rule of rules) {

        if (!rule.enabled) continue

        if (!rule.keyword) continue

        const keywords =
            rule.keyword
                .split(",")
                .map(k => k.trim().toLowerCase())

        const matched = keywords.some(keyword =>
            text.includes(keyword)
        )

        if (matched) return rule

    }

    return null

}

module.exports = matchKeywords