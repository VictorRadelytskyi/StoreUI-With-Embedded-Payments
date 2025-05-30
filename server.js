
if (process.env.NODE_ENV !== "production"){
    require('dotenv').config()
}
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripePublicKey = process.env.STRIPE_PUBLIC_KEY;


const express = require('express');
const app = express();
const fs = require('fs');
const stripe = require('stripe')(stripeSecretKey);
const createProducts = require('./stripe_products/products');


app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());

app.get('/store', function(req, res){
    fs.readFile('./stripe_products/products.json', function(error, data){
        if(error){
            console.log("Error parsing items.json:", error);
            res.send(500).end();
        }else{
            let parsedData = JSON.parse(data);
            res.render("store.ejs", {
                stripePublicKey: stripePublicKey,
                items: parsedData
            });
        }
    });
});

app.post("/create-checkout-session", async (req, res)=>{
    const selectedProducts = req.body;
    if (!selectedProducts || Object.keys(selectedProducts).length === 0){
         res.status(400).json({status: "Failed", message: "No products selected"})
    }
    createProducts(stripe);
        fs.readFile('./stripe_products/products.json', async(error, allProductsString)=>{
            if (error) {
                console.log(`Error reading products.json: ${error}`);
                return res.status(500).json({ status: "Failed", message: "Server error" });
            }
            const allProductsObj = JSON.parse(allProductsString);
            const allProducts = [...(allProductsObj.music||[]), ...(allProductsObj.merch||[])]
            const lineItems = selectedProducts.map(selected => {
                console.log("selectedProducts:", selectedProducts);
                console.log("allProducts:", allProducts);
                const product = allProducts.find(p => p.id === selected.id);
                if (!product) return null;
                return {
                    price_data: {
                        currency: 'usd',
                        product_data: { name: product.name },
                        unit_amount: product.price, // price in cents
                    },
                    quantity: selected.quantity
                };
            }).filter(item => item !== null);
            if (lineItems.length === 0) {
                return res.status(400).json({ status: "Failed", message: "No valid products selected" });
            }
            try{
                const session = await stripe.checkout.sessions.create({
                    ui_mode: 'embedded',
                    line_items: lineItems,
                    mode: 'payment',
                    return_url: `https://localhost:3000/success.html`
                });
                res.send({clientSecret: session.client_secret});
            }catch (err) {
            console.log(`Stripe error: ${err}`);
            res.status(500).json({ status: "Failed", message: "Stripe error" });
        }
    });
});

app.listen(3000, (error)=>{
    if(error){
        console.log("Can't open socket endpoint on port 3000 :(");
    } else{
    console.log("I am listening on port 3000!");
    }
});