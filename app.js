const express = require("express")
const app = express()
const bodyparser = require("body-parser")
const mongoose = require("mongoose")
const port = process.env.PORT || 5000

require("dotenv").config()
// express middleware
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({ extended: true }))

// mongo connect
console.log("connecting to database")
mongoose.connect(process.env.MONGO_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
}).then(
    ()=> {console.log("connected to Database!")},
    (err)=>{console.log(err)}
)

app.use("/", require("./routes/index"))

//sever port
app.listen(port, () => {
    console.log(`Server has started at http://localhost:${port}/`)
})
