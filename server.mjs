import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';



 let dbURI ='mongodb+srv://abcd:abcd@cluster0.0nsp7aq.mongodb.net/myProductBase?retryWrites=true&w=majority';
mongoose.connect(dbURI);

const app = express();
app.use (express.json());
app.use ( cors());
const port = process.env.PORT || 5000;

const productSchema = new mongoose.Schema({ ///from mongoose
   name :{type:String, required:true},
   price:{type:Number, required:true},
  code:{type:Number, required:true},
  description :{type:String, required:true},
    createdOn:{ type: Date, default: Date.now },
  });
const productModel = mongoose.model('Products', productSchema);

app.post('/product',(req , res)=>{////from expres.js

    let body = req.body;

                let newProduct =productModel({
                    name:body.name,
                  price:body.price,
                    code:body.code,
                    description:body.description
                  
                })
                newProduct.save((err,result)=>{
                    if(!err){
                        console.log(err)
                        console.log("product saved:",result)
                        res.status(201).send({message:'product is created'});
                    }else{
                        console.log('db error:',err)
                        res.status(500).send({message:'internal server error'})
                    }
            
                });
           
})


app.get("/products", async (req, res) => {

    try {
        let allproducts = await productModel.find({}).exec();
        console.log("allproducts:",allproducts);
        res.send(allproducts);

    } catch (error) {
        res.status(500).send({ message: "error getting products" });
    }
})

app.use(express.json()); app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
////////////////mongodb connected disconnected events///////////////////////////////////////////////
mongoose.connection.on('connected', function () { //connected
    console.log("mongoose connected");
});

mongoose.connection.on('disconnected', function () {//disconnected
    console.log("Mongoose is disconnected");
    process.exit(1);
});

mongoose.connection.on('error', function (err) {//any error
    console.log('Mongoose connection error: ', err);
    process.exit(1);
});


process.on('SIGINT', function () {/////this function will run jst before app is closing
    console.log("app is terminating");
    mongoose.connection.close(function () {
        console.log('Mongoose default connection closed');
        process.exit(0);
    });
});

//////////////////////////////////////