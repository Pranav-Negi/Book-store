const bcrpt = require("bcrypt")

const fun = async()=>{
    const password = "ABC"
    const hashedPassword = await bcrpt.hash(password, 10)
    console.log(hashedPassword) // $2b$10$e0c5a1
    const match = await bcrpt.compare(password, hashedPassword)
    console.log(match) // true
}

console.log(fun())