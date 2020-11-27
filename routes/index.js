const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const publicPath = {
    root : "./public"
}
// schema
const PersonSchema = new mongoose.Schema({
    name: String,
    age: String,
})

const PersonModel = mongoose.model("users", PersonSchema)
// routes

router.get("/", (req, res) => {
    res.sendFile("index.html", publicPath)
})
// add user
router.get("/add_user", (req, res) => {
    res.sendFile("adduser.html", publicPath)
})

router.post("/add_user", async (req, res) => {
    const { name, age } = req.body

    const NewPerson = new PersonModel({
        name: name,
        age: age,
    })

    await NewPerson.save()

    res.writeHeader(200, { "Content-Type": "text/html" })
    res.write(`sent your details to our databse! ${name}<br><br>`)
    res.write(`<a href="/"><button>Home</button></a><br>`)
    res.send()
})
// show user
router.get("/get_users", async (req, res) => {
    const User = await PersonModel.find({})
    
    res.render("showuser",{
        users : User
    })
})

// delete user
router.get("/delete_user", (req, res) => {
    res.sendFile("deleteUser.html", publicPath)
})
router.post("/delete_user", async (req, res) => {
    const id = req.body.id

    res.writeHeader(200, { "Content-Type": "text/html" })

    await PersonModel.deleteMany({ _id: id })
        .then(() => {
            res.write("user deleted<br>")
            res.write(`<a href="/"><button>Home</button></a><br>`)
            res.send()
        })
        .catch((e) => {
            console.log(e)
            res.write("user not deleted check the id once <br>")
            res.write(`<a href="/"><button>Home</button></a><br>`)
            res.send()
        })
})
// update user
router.get("/update_user", (req, res) => {
    res.sendFile("updateUser.html", publicPath)
})
router.post("/update_user", async (req, res) => {
    const { id, name, age } = req.body
    res.writeHeader(200, { "Content-Type": "text/html" })
    await PersonModel.findByIdAndUpdate(
        id,
        { name: name, age: age },
        (err, doc) => {
            if (err) {
                console.log(err)
                res.write("cant update! plz check and try again")
                res.write(`<a href="/"><button>Home</button></a><br>`)
            } else {
                res.write(
                    `updated! <br> Before name: ${doc.name} age: ${doc.age} <br>`
                )
                res.write(`After name: ${name} age: ${age}<br>`)
                res.write(`<a href="/"><button>Home</button></a><br>`)
            }
            res.send()
        }
    )
})
// Find user
router.get("/find_user", (req, res) => {
    res.sendFile("findUser.html", publicPath)
})

router.get("/users/", async (req, res) => {
    let id = req.query.id
    res.writeHeader(200, { "Content-Type": "text/html" })
    await PersonModel.find({ name: id }, (err, data) => {
        if (data.length === 0) {
            res.write("not found! the user")
        } else {
            data.forEach((d) => {
                const { name, age } = d
                res.write(`<h2>name : ${name} age: ${age}\n</h2>`)
            })
        }
        if (err !== null) {
            console.log(err)
        }
        res.send()
    })
})

module.exports = router
