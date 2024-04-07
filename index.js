import express from "express";
const app = express();

app.get("/get-products" , (req , res) => {
    res.json(
        {
            status : true , 
            products : []
        }
    )
})

app.listen(5000 , ()=> {
    console.log("server is working");
})