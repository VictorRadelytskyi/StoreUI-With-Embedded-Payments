const fs = require('fs');

function createProducts(stripe){
   fs.readFile("./stripe_products/products.json", async function(err, data){
    if (err){
        console.log(`Error reading products.json: ${err}`);
        return;
    }else{
        try{
            data = JSON.parse(data);
            const updates = [];
            if(data){
                for (const category of ['music', 'merch']){
                    for (item of data[category]){
                            if (!item.product_id){
                                    updates.push(
                                        stripe.products.create({
                                        name: item.name,
                                        default_price_data: {
                                            currency: 'usd',
                                            unit_amount: item.price
                                        }
                                    }).then(res=>{
                                        item.product_id = res.id;
                                        item.price_id = res.default_price;
                                    }).catch(err=>console.log(`error creating product: ${err}`))
                                )
                            }
                        }
                    }
            }
            await Promise.all(updates);
            //TODO print updates, write to .json beautifully
            if(updates.length !==0 ){
                fs.writeFile('./stripe_products/products.json', JSON.stringify(data, null, 2), (err)=>{
                    if(err){
                        console.log(`error writing to products.json: ${err}`)
                    }
                    else{console.log("wrote to products.json successfully")};
                });
            }
        }
        catch (err){
            console.log(`Failed to create products: ${err}`);
        }
    }
   })
}

module.exports = createProducts;