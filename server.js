// require("dotenv").config()
// const express = require("express")
// const axios = require("axios")
// const cors = require("cors")
// const cron = require("node-cron")
// const app = express()

// app.use(cors())
// app.use(express.json())

// const IG_USER_ID = process.env.IG_USER_ID
// const TOKEN = process.env.ACCESS_TOKEN

// // 1️⃣ Get Account Info

// app.get("/account", async (req, res) => {
//   try {

//     const url = `https://graph.facebook.com/v25.0/${IG_USER_ID}?fields=username,followers_count&access_token=${TOKEN}`

//     const response = await axios.get(url)

//     res.json(response.data)

//   } catch (error) {
//     res.status(500).json(error.response?.data || error.message)
//   }
// })


// // 2️⃣ Get Latest Posts

// app.get("/posts", async (req, res) => {
//   try {

//     const url = `https://graph.facebook.com/v25.0/${IG_USER_ID}/media?fields=id,caption,media_url,timestamp&access_token=${TOKEN}`

//     const response = await axios.get(url)

//     res.json(response.data)

//   } catch (error) {
//     res.status(500).json(error.response?.data || error.message)
//   }
// })

// app.post("/post", async (req, res) => {

//   const { image_url, caption } = req.body

//   try {

//     // STEP 1 create media container

//     const createMedia = await axios.post(
//       `https://graph.facebook.com/v25.0/${IG_USER_ID}/media`,
//       null,
//       {
//         params: {
//           image_url: image_url,
//           caption: caption,
//           access_token: TOKEN
//         }
//       }
//     )

//     const creationId = createMedia.data.id

//     // STEP 2 publish media

//     const publishMedia = await axios.post(
//       `https://graph.facebook.com/v25.0/${IG_USER_ID}/media_publish`,
//       null,
//       {
//         params: {
//           creation_id: creationId,
//           access_token: TOKEN
//         }
//       }
//     )

//     res.json({
//       message: "Post published successfully 🚀",
//       post: publishMedia.data
//     })

//   } catch (error) {
//     res.status(500).json(error.response?.data || error.message)
//   }

// })


// cron.schedule("*/2 * * * *", async () => {

//  console.log("Posting to Instagram...")

//  try {

//    const createMedia = await axios.post(
//      `https://graph.facebook.com/v25.0/${IG_USER_ID}/media`,
//      null,
//      {
//        params: {
//          image_url:"https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d",
//          caption:"Auto scheduled post 🚀",
//          access_token:TOKEN
//        }
//      }
//    )

//    const creationId = createMedia.data.id

//    await axios.post(
//      `https://graph.facebook.com/v25.0/${IG_USER_ID}/media_publish`,
//      null,
//      {
//        params:{
//          creation_id:creationId,
//          access_token:TOKEN
//        }
//      }
//    )

//    console.log("Post published automatically")

//  } catch(error){
//    console.log(error.response?.data || error.message)
//  }

// })
// // Start server


// app.get("/auth/instagram", (req, res) => {

// const authUrl =
// `https://api.instagram.com/oauth/authorize
// ?client_id=${process.env.CLIENT_ID}
// &redirect_uri=${process.env.REDIRECT_URI}
// &scope=user_profile,user_media
// &response_type=code`;

// res.redirect(authUrl);

// });

// app.get("/auth/callback", async (req,res)=>{

// const code = req.query.code;

// console.log("Authorization Code:",code);

// res.redirect("http://localhost:3000/dashboard");

// });


// const response = await axios.post(
// "https://api.instagram.com/oauth/access_token",
// {
// client_id: process.env.CLIENT_ID,
// client_secret: process.env.CLIENT_SECRET,
// grant_type: "authorization_code",
// redirect_uri: process.env.REDIRECT_URI,
// code: code
// }
// );

// const access_token = response.data.access_token;

// app.listen(process.env.PORT, () => {
//   console.log("Server running on port", process.env.PORT)
// })

// cron.schedule("*/2 * * * *", async () => {
//  console.log("Posting to Instagram...")
// })


// require("dotenv").config()
// const express = require("express")
// const axios = require("axios")
// const cors = require("cors")
// const cron = require("node-cron")

// const app = express()

// app.use(cors())
// app.use(express.json())

// const PORT = process.env.PORT || 5000

// let ACCESS_TOKEN = process.env.ACCESS_TOKEN
// let IG_USER_ID = process.env.IG_USER_ID

// /* -----------------------------
//    1️⃣ Instagram OAuth Start
// --------------------------------*/

// app.get("/auth/instagram", (req, res) => {

// const authUrl =
// `https://api.instagram.com/oauth/authorize
// ?client_id=${process.env.CLIENT_ID}
// &redirect_uri=${process.env.REDIRECT_URI}
// &scope=user_profile,user_media
// &response_type=code`

// res.redirect(authUrl)

// })


// /* -----------------------------
//    2️⃣ OAuth Callback
// --------------------------------*/

// app.get("/auth/callback", async (req,res)=>{

// try{

// const code = req.query.code

// console.log("Authorization Code:",code)

// const response = await axios.post(
// "https://api.instagram.com/oauth/access_token",
// null,
// {
// params:{
// client_id: process.env.CLIENT_ID,
// client_secret: process.env.CLIENT_SECRET,
// grant_type: "authorization_code",
// redirect_uri: process.env.REDIRECT_URI,
// code: code
// }
// }
// )

// ACCESS_TOKEN = response.data.access_token
// IG_USER_ID = response.data.user_id

// console.log("Access Token:",ACCESS_TOKEN)

// res.redirect("http://localhost:3000/dashboard")

// }catch(error){

// console.log(error.response?.data || error.message)

// res.send("OAuth failed")

// }

// })


// /* -----------------------------
//    3️⃣ Get Account Info
// --------------------------------*/

// app.get("/account", async (req,res)=>{

// try{

// const url = `https://graph.facebook.com/v25.0/${IG_USER_ID}?fields=username,followers_count&access_token=${ACCESS_TOKEN}`

// const response = await axios.get(url)

// res.json(response.data)

// }catch(error){

// res.status(500).json(error.response?.data || error.message)

// }

// })


// /* -----------------------------
//    4️⃣ Get Latest Posts
// --------------------------------*/

// app.get("/posts", async (req,res)=>{

// try{

// const url = `https://graph.facebook.com/v25.0/${IG_USER_ID}/media?fields=id,caption,media_url,timestamp&access_token=${ACCESS_TOKEN}`

// const response = await axios.get(url)

// res.json(response.data)

// }catch(error){

// res.status(500).json(error.response?.data || error.message)

// }

// })


// /* -----------------------------
//    5️⃣ Create / Publish Post
// --------------------------------*/

// app.post("/post", async (req,res)=>{

// const { image_url, caption } = req.body

// try{

// const createMedia = await axios.post(
// `https://graph.facebook.com/v25.0/${IG_USER_ID}/media`,
// null,
// {
// params:{
// image_url:image_url,
// caption:caption,
// access_token:ACCESS_TOKEN
// }
// }
// )

// const creationId = createMedia.data.id

// const publishMedia = await axios.post(
// `https://graph.facebook.com/v25.0/${IG_USER_ID}/media_publish`,
// null,
// {
// params:{
// creation_id:creationId,
// access_token:ACCESS_TOKEN
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
//    6️⃣ Auto Post Scheduler
// --------------------------------*/

// cron.schedule("*/2 * * * *", async ()=>{

// console.log("Running scheduled job...")

// try{

// const createMedia = await axios.post(
// `https://graph.facebook.com/v25.0/${IG_USER_ID}/media`,
// null,
// {
// params:{
// image_url:"https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d",
// caption:"Auto scheduled post 🚀",
// access_token:ACCESS_TOKEN
// }
// }
// )

// const creationId = createMedia.data.id

// await axios.post(
// `https://graph.facebook.com/v25.0/${IG_USER_ID}/media_publish`,
// null,
// {
// params:{
// creation_id:creationId,
// access_token:ACCESS_TOKEN
// }
// }
// )

// console.log("Auto post published")

// }catch(error){

// console.log(error.response?.data || error.message)

// }

// })


// /* -----------------------------
//    Start Server
// --------------------------------*/

// app.listen(PORT, ()=>{
// console.log("Server running on port",PORT)
// })


// require("dotenv").config()

// const express = require("express")
// const axios = require("axios")
// const cors = require("cors")

// const app = express()

// app.use(cors())
// app.use(express.json())

// const PORT = process.env.PORT || 5000

// // Temporary storage (later database)
// let ACCESS_TOKEN = null
// let IG_USER_ID = null


// /* -----------------------------
//    1️⃣ Start Instagram Login
// --------------------------------*/

// app.get("/auth/instagram", (req, res) => {

// const authUrl =
// `https://www.facebook.com/v19.0/dialog/oauth?client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}&scope=instagram_basic,instagram_content_publish,pages_show_list&response_type=code`

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

// const response = await axios.post(
// "https://api.instagram.com/oauth/access_token",
// null,
// {
// params:{
// client_id:process.env.CLIENT_ID,
// client_secret:process.env.CLIENT_SECRET,
// grant_type:"authorization_code",
// redirect_uri:process.env.REDIRECT_URI,
// code:code
// }
// }
// )

// ACCESS_TOKEN = response.data.access_token
// IG_USER_ID = response.data.user_id

// console.log("Access Token:",ACCESS_TOKEN)
// console.log("IG USER ID:",IG_USER_ID)

// // redirect to frontend dashboard
// res.redirect("http://localhost:3000/dashboard")

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

// if(!ACCESS_TOKEN){
// return res.status(401).json({message:"Instagram not connected"})
// }

// const url =
// `https://graph.facebook.com/v18.0/${IG_USER_ID}?fields=username,followers_count,media_count&access_token=${ACCESS_TOKEN}`

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

// const url =
// `https://graph.facebook.com/v18.0/${IG_USER_ID}/media?fields=id,caption,media_url,timestamp&access_token=${ACCESS_TOKEN}`

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

// if(!ACCESS_TOKEN){
// return res.status(401).json({message:"Instagram not connected"})
// }

// // create media container
// const createMedia = await axios.post(
// `https://graph.facebook.com/v18.0/${IG_USER_ID}/media`,
// null,
// {
// params:{
// image_url:image_url,
// caption:caption,
// access_token:ACCESS_TOKEN
// }
// }
// )

// const creationId = createMedia.data.id

// // publish media
// const publishMedia = await axios.post(
// `https://graph.facebook.com/v18.0/${IG_USER_ID}/media_publish`,
// null,
// {
// params:{
// creation_id:creationId,
// access_token:ACCESS_TOKEN
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


// require("dotenv").config()

// const express = require("express")
// const axios = require("axios")
// const cors = require("cors")

// const app = express()

// app.use(cors())
// app.use(express.json())

// const PORT = process.env.PORT || 5000

// const session = {
// accessToken: null,
// igUserId: null
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

// const pages = await axios.get(
// `https://graph.facebook.com/v19.0/me/accounts`,
// {
// params:{
// access_token:session.accessToken
// }
// }
// )

// const pageId = pages.data.data[0].id

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

// res.redirect("http://localhost:3000/dashboard?login=success")

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
// `https://graph.facebook.com/v19.0/${IG_USER_ID}?fields=username,followers_count,media_count&access_token=${ACCESS_TOKEN}`

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

// const url =
// `https://graph.facebook.com/v19.0/${IG_USER_ID}/media?fields=id,caption,media_url,timestamp&access_token=${ACCESS_TOKEN}`

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

// if(!ACCESS_TOKEN){
// return res.status(401).json({message:"Instagram not connected"})
// }

// // create media container
// const createMedia = await axios.post(
// `https://graph.facebook.com/v19.0/${IG_USER_ID}/media`,
// null,
// {
// params:{
// image_url:image_url,
// caption:caption,
// access_token:ACCESS_TOKEN
// }
// }
// )

// const creationId = createMedia.data.id


// // publish media
// const publishMedia = await axios.post(
// `https://graph.facebook.com/v19.0/${IG_USER_ID}/media_publish`,
// null,
// {
// params:{
// creation_id:creationId,
// access_token:ACCESS_TOKEN
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


require("dotenv").config()

const express = require("express")
const axios = require("axios")
const cors = require("cors")
const cron = require("node-cron")   // ✅ NEW

const app = express()

app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 5000

// simple session storage
const session = {
  accessToken: null,
  igUserId: null
}

// ✅ NEW: scheduled posts storage
const scheduledPosts = []


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

res.redirect("http://localhost:5173/dashboard?login=success")

}catch(error){

console.log(error.response?.data || error.message)

res.send("OAuth failed")

}

})


/* -----------------------------
   3️⃣ Publish Function (Reusable)
--------------------------------*/

async function publishToInstagram(image_url, caption){

// create container
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

// publish
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
app.post("/schedule-post",(req,res)=>{

const { image_url, caption, schedule_time } = req.body

scheduledPosts.push({
image_url,
caption,
time:new Date(schedule_time)
})

res.json({
message:"Post scheduled successfully"
})

})


/* -----------------------------
   6️⃣ CRON JOB (Check every minute)
--------------------------------*/

cron.schedule("* * * * *", async ()=>{

const now = new Date()

for(let i=0;i<scheduledPosts.length;i++){

const post = scheduledPosts[i]

if(now >= post.time){

try{

await publishToInstagram(post.image_url,post.caption)

console.log("Scheduled post published")

scheduledPosts.splice(i,1)

}catch(err){

console.log("Error publishing scheduled post")

console.log(err.response?.data || err.message)

}

}

}

})

app.get("/test",(req,res)=>{
res.send("backend working")
})

/* -----------------------------
   Server Start
--------------------------------*/

app.listen(PORT, ()=>{
console.log("Server running on port",PORT)
})