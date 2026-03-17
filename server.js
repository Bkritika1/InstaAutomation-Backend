


// require("dotenv").config()

// const express = require("express")
// const axios = require("axios")
// const cors = require("cors")

// const app = express()

// app.use(cors())
// app.use(express.json())

// const PORT = process.env.PORT || 5000


// // simple session storage
// const session = {
//   accessToken: null,
//   igUserId: null
// }


// /* -----------------------------
//    1️⃣ Start Instagram Login
// --------------------------------*/

// app.get("/auth/instagram", (req, res) => {

// const authUrl =
// `https://www.facebook.com/v19.0/dialog/oauth?client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}&scope=pages_show_list,instagram_basic,instagram_content_publish&response_type=code`

// res.redirect(authUrl)

// })


// /* -----------------------------
//    2️⃣ OAuth Callback
// --------------------------------*/

// app.get("/auth/callback", async (req,res)=>{

// try{

// const code = req.query.code

// if(!code){
// return res.send("Authorization code missing")
// }

// console.log("Authorization Code:",code)


// // Exchange code for access token
// const tokenResponse = await axios.get(
// `https://graph.facebook.com/v19.0/oauth/access_token`,
// {
// params:{
// client_id:process.env.CLIENT_ID,
// client_secret:process.env.CLIENT_SECRET,
// redirect_uri:process.env.REDIRECT_URI,
// code:code
// }
// }
// )

// session.accessToken = tokenResponse.data.access_token

// console.log("Access Token:",session.accessToken)


// // Get Facebook Pages
// const pages = await axios.get(
// `https://graph.facebook.com/v19.0/me/accounts`,
// {
// params:{
// access_token:session.accessToken
// }
// }
// )

// const pageId = pages.data.data[0].id


// // Get Instagram Business Account
// const igRes = await axios.get(
// `https://graph.facebook.com/v19.0/${pageId}`,
// {
// params:{
// fields:"instagram_business_account",
// access_token:session.accessToken
// }
// }
// )

// session.igUserId = igRes.data.instagram_business_account.id

// console.log("Instagram Business ID:",session.igUserId)

// res.redirect("http://localhost:5173/dashboard?login=success")

// }catch(error){

// console.log(error.response?.data || error.message)

// res.send("OAuth failed")

// }

// })


// /* -----------------------------
//    3️⃣ Get Instagram Account
// --------------------------------*/

// app.get("/account", async (req,res)=>{

// try{

// if(!session.accessToken){
// return res.status(401).json({message:"Instagram not connected"})
// }

// const url =
// `https://graph.facebook.com/v19.0/${session.igUserId}?fields=username,followers_count,media_count&access_token=${session.accessToken}`

// const response = await axios.get(url)

// res.json(response.data)

// }catch(error){

// res.status(500).json(error.response?.data || error.message)

// }

// })


// /* -----------------------------
//    4️⃣ Get Instagram Posts
// --------------------------------*/

// app.get("/posts", async (req,res)=>{

// try{

// if(!session.accessToken){
// return res.status(401).json({message:"Instagram not connected"})
// }

// const url =
// `https://graph.facebook.com/v19.0/${session.igUserId}/media?fields=id,caption,media_url,timestamp&access_token=${session.accessToken}`

// const response = await axios.get(url)

// res.json(response.data)

// }catch(error){

// res.status(500).json(error.response?.data || error.message)

// }

// })


// /* -----------------------------
//    5️⃣ Publish Post
// --------------------------------*/

// app.post("/post", async (req,res)=>{

// const { image_url, caption } = req.body

// try{

// if(!session.accessToken){
// return res.status(401).json({message:"Instagram not connected"})
// }


// // Create media container
// const createMedia = await axios.post(
// `https://graph.facebook.com/v19.0/${session.igUserId}/media`,
// null,
// {
// params:{
// image_url:image_url,
// caption:caption,
// access_token:session.accessToken
// }
// }
// )

// const creationId = createMedia.data.id


// // Publish media
// const publishMedia = await axios.post(
// `https://graph.facebook.com/v19.0/${session.igUserId}/media_publish`,
// null,
// {
// params:{
// creation_id:creationId,
// access_token:session.accessToken
// }
// }
// )

// res.json({
// message:"Post published successfully 🚀",
// post:publishMedia.data
// })

// }catch(error){

// res.status(500).json(error.response?.data || error.message)

// }

// })


// /* -----------------------------
//    Server Start
// --------------------------------*/

// app.listen(PORT, ()=>{
// console.log("Server running on port",PORT)
// })

// const supabase = require("./config/supabase")
// require("dotenv").config()

// const express = require("express")
// const axios = require("axios")
// const cors = require("cors")
// const cron = require("node-cron")   // ✅ NEW

// const app = express()

// app.use(cors())
// app.use(express.json())

// const PORT = process.env.PORT || 5000

// // simple session storage
// const session = {
//   accessToken: null,
//   igUserId: null
// }

// // ✅ NEW: scheduled posts storage
// const scheduledPosts = []


// /* -----------------------------
//    1️⃣ Start Instagram Login
// --------------------------------*/

// app.get("/auth/instagram", (req, res) => {

// const authUrl =
// `https://www.facebook.com/v19.0/dialog/oauth?client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}&scope=pages_show_list,instagram_basic,instagram_content_publish&response_type=code`

// res.redirect(authUrl)

// })


// /* -----------------------------
//    2️⃣ OAuth Callback
// --------------------------------*/

// app.get("/auth/callback", async (req,res)=>{
// console.log("CALLBACK ROUTE HIT")
// try{

// const code = req.query.code

// if(!code){
// return res.send("Authorization code missing")
// }

// const tokenResponse = await axios.get(
// `https://graph.facebook.com/v19.0/oauth/access_token`,
// {
// params:{
// client_id:process.env.CLIENT_ID,
// client_secret:process.env.CLIENT_SECRET,
// redirect_uri:process.env.REDIRECT_URI,
// code:code
// }
// }
// )

// session.accessToken = tokenResponse.data.access_token

// // Get Facebook Pages
// const pages = await axios.get(
// `https://graph.facebook.com/v19.0/me/accounts`,
// {
// params:{
// access_token:session.accessToken
// }
// }
// )

// const pageId = pages.data.data[0].id

// // Get Instagram Business Account
// const igRes = await axios.get(
// `https://graph.facebook.com/v19.0/${pageId}`,
// {
// params:{
// fields:"instagram_business_account",
// access_token:session.accessToken
// }
// }
// )

// session.igUserId = igRes.data.instagram_business_account.id

// res.redirect("http://localhost:5173/dashboard?login=success")

// }catch(error){

// console.log(error.response?.data || error.message)

// res.send("OAuth failed")

// }

// })
// console.log("CLIENT_ID:", process.env.CLIENT_ID)
// console.log("REDIRECT_URI:", process.env.REDIRECT_URI)

// /* -----------------------------
//    3️⃣ Publish Function (Reusable)
// --------------------------------*/

// async function publishToInstagram(image_url, caption){

// // create container
// const createMedia = await axios.post(
// `https://graph.facebook.com/v19.0/${session.igUserId}/media`,
// null,
// {
// params:{
// image_url:image_url,
// caption:caption,
// access_token:session.accessToken
// }
// }
// )

// const creationId = createMedia.data.id

// // publish
// await axios.post(
// `https://graph.facebook.com/v19.0/${session.igUserId}/media_publish`,
// null,
// {
// params:{
// creation_id:creationId,
// access_token:session.accessToken
// }
// }
// )

// }


// /* -----------------------------
//    4️⃣ Publish Now
// --------------------------------*/

// app.post("/post", async (req,res)=>{

// const { image_url, caption } = req.body

// try{

// if(!session.accessToken){
// return res.status(401).json({message:"Instagram not connected"})
// }

// await publishToInstagram(image_url,caption)

// res.json({
// message:"Post published successfully 🚀"
// })

// }catch(error){

// res.status(500).json(error.response?.data || error.message)

// }

// })


// /* -----------------------------
//    5️⃣ Schedule Post
// --------------------------------*/
// console.log("Schedule route loaded")
// app.post("/schedule-post",(req,res)=>{

// const { image_url, caption, schedule_time } = req.body

// scheduledPosts.push({
// image_url,
// caption,
// time:new Date(schedule_time)
// })

// res.json({
// message:"Post scheduled successfully"
// })

// })


// /* -----------------------------
//    6️⃣ CRON JOB (Check every minute)
// --------------------------------*/

// cron.schedule("* * * * *", async ()=>{

// const now = new Date()

// for(let i=0;i<scheduledPosts.length;i++){

// const post = scheduledPosts[i]

// if(now >= post.time){

// try{

// await publishToInstagram(post.image_url,post.caption)

// console.log("Scheduled post published")

// scheduledPosts.splice(i,1)

// }catch(err){

// console.log("Error publishing scheduled post")

// console.log(err.response?.data || err.message)

// }

// }

// }

// })

// /* -----------------------------
//    7️⃣ Get Instagram Account
// --------------------------------*/

// app.get("/account", async (req,res)=>{

// try{

// if(!session.accessToken || !session.igUserId){
// return res.status(401).json({message:"Instagram not connected"})
// }

// const response = await axios.get(
// `https://graph.facebook.com/v19.0/${session.igUserId}`,
// {
// params:{
// fields:"username,followers_count,media_count",
// access_token:session.accessToken
// }
// }
// )

// res.json(response.data)

// }catch(error){

// console.log(error.response?.data || error.message)

// res.status(500).json({error:"Failed to fetch account"})

// }

// })

// /* -----------------------------
//    8️⃣ Get Instagram Posts
// --------------------------------*/

// app.get("/posts", async (req,res)=>{

// try{

// if(!session.accessToken || !session.igUserId){
// return res.status(401).json({message:"Instagram not connected"})
// }

// const response = await axios.get(
// `https://graph.facebook.com/v19.0/${session.igUserId}/media`,
// {
// params:{
// fields:"id,caption,media_url",
// access_token:session.accessToken
// }
// }
// )

// res.json(response.data)

// }catch(error){

// console.log(error.response?.data || error.message)

// res.status(500).json({error:"Failed to fetch posts"})

// }

// })
// app.get("/test",(req,res)=>{
// res.send("backend working")
// })

// /* -----------------------------
//    Server Start
// --------------------------------*/

// app.listen(PORT, ()=>{
// console.log("Server running on port",PORT)
// })

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

const session = {
  accessToken: null,
  igUserId: null
}

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

app.get("/auth/callback", async (req,res)=>{

console.log("CALLBACK ROUTE HIT")

try{

const code = req.query.code

if(!code){
return res.send("Authorization code missing")
}

const tokenResponse = await axios.get(
`https://graph.facebook.com/v19.0/oauth/access_token`,
{
params:{
client_id:process.env.CLIENT_ID,
client_secret:process.env.CLIENT_SECRET,
redirect_uri:process.env.REDIRECT_URI,
code:code
}
}
)

session.accessToken = tokenResponse.data.access_token

// Get Facebook Pages
const pages = await axios.get(
`https://graph.facebook.com/v19.0/me/accounts`,
{
params:{
access_token:session.accessToken
}
}
)

const pageId = pages.data.data[0].id

// Get Instagram Business Account
const igRes = await axios.get(
`https://graph.facebook.com/v19.0/${pageId}`,
{
params:{
fields:"instagram_business_account",
access_token:session.accessToken
}
}
)

session.igUserId = igRes.data.instagram_business_account.id

/* -----------------------------
   GET USERNAME
--------------------------------*/

const igUser = await axios.get(
`https://graph.facebook.com/v19.0/${session.igUserId}`,
{
params:{
fields:"username",
access_token:session.accessToken
}
}
)

const username = igUser.data.username

/* -----------------------------
   SAVE USER IN DATABASE
--------------------------------*/

await supabase
.from("users")
.insert({
instagram_user_id: session.igUserId,
username: username,
access_token: session.accessToken
})

res.redirect("http://localhost:5173/dashboard?login=success")

}catch(error){

console.log(error.response?.data || error.message)

res.send("OAuth failed")

}

})

console.log("CLIENT_ID:", process.env.CLIENT_ID)
console.log("REDIRECT_URI:", process.env.REDIRECT_URI)

/* -----------------------------
   3️⃣ Publish Function
--------------------------------*/

async function publishToInstagram(image_url, caption){

const createMedia = await axios.post(
`https://graph.facebook.com/v19.0/${session.igUserId}/media`,
null,
{
params:{
image_url:image_url,
caption:caption,
access_token:session.accessToken
}
}
)

const creationId = createMedia.data.id

await axios.post(
`https://graph.facebook.com/v19.0/${session.igUserId}/media_publish`,
null,
{
params:{
creation_id:creationId,
access_token:session.accessToken
}
}
)

}

/* -----------------------------
   4️⃣ Publish Now
--------------------------------*/

app.post("/post", async (req,res)=>{

const { image_url, caption } = req.body

try{

if(!session.accessToken){
return res.status(401).json({message:"Instagram not connected"})
}

await publishToInstagram(image_url,caption)

res.json({
message:"Post published successfully 🚀"
})

}catch(error){

res.status(500).json(error.response?.data || error.message)

}

})

/* -----------------------------
   5️⃣ Schedule Post
--------------------------------*/

console.log("Schedule route loaded")

app.post("/schedule-post", async (req,res)=>{

const { image_url, caption, schedule_time } = req.body

try{

// await supabase
// .from("scheduled_posts")
// .insert({
// user_id: session.igUserId,
// image_url,
// caption,
// schedule_time
// })

await supabase
.from("users")
.upsert({
  instagram_user_id: session.igUserId,
  username: username,
  access_token: session.accessToken
},{
  onConflict: "instagram_user_id"
})

res.json({
message:"Post scheduled successfully"
})

}catch(err){

console.log(err)

res.status(500).json({error:"Failed to schedule post"})

}

})



/* -----------------------------
   6️⃣ CRON JOB
--------------------------------*/

cron.schedule("* * * * *", async ()=>{

const now = new Date().toISOString()

const { data:posts } = await supabase
.from("scheduled_posts")
.select("*")
.eq("status","pending")
.lte("schedule_time",now)

if(!posts || posts.length === 0) return

for(const post of posts){

try{

await publishToInstagram(post.image_url,post.caption)

console.log("Scheduled post published")

await supabase
.from("scheduled_posts")
.update({status:"published"})
.eq("id",post.id)

}catch(err){

console.log("Error publishing scheduled post")

console.log(err.response?.data || err.message)

}

}

})

/* -----------------------------
   7️⃣ Get Instagram Account
--------------------------------*/

app.get("/account", async (req,res)=>{

try{

if(!session.accessToken || !session.igUserId){
return res.status(401).json({message:"Instagram not connected"})
}

const response = await axios.get(
`https://graph.facebook.com/v19.0/${session.igUserId}`,
{
params:{
fields:"username,followers_count,media_count",
access_token:session.accessToken
}
}
)

res.json(response.data)

}catch(error){

console.log(error.response?.data || error.message)

res.status(500).json({error:"Failed to fetch account"})

}

})

/* -----------------------------
   8️⃣ Get Instagram Posts
--------------------------------*/

app.get("/posts", async (req,res)=>{

try{

if(!session.accessToken || !session.igUserId){
return res.status(401).json({message:"Instagram not connected"})
}

const response = await axios.get(
`https://graph.facebook.com/v19.0/${session.igUserId}/media`,
{
params:{
fields:"id,caption,media_url",
access_token:session.accessToken
}
}
)

res.json(response.data)

}catch(error){

console.log(error.response?.data || error.message)

res.status(500).json({error:"Failed to fetch posts"})

}

})

app.get("/test",(req,res)=>{
res.send("backend working")
})

/* -----------------------------
   Server Start
--------------------------------*/
console.log("SUPABASE URL:", process.env.SUPABASE_URL)
app.listen(PORT, ()=>{
console.log("Server running on port",PORT)
})