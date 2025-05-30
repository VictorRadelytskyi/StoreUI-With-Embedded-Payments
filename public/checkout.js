
async function initialize(selectedItems = null){
    async function fetchClientSecret(){
        return fetch("/create-checkout-session", {
            method: "POST",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify(selectedItems)
        })
        .then(response => response.json()).then(res=>res.clientSecret)
        .catch(err=>console.log(`error initializing checkout session: ${err}`));
    }
    const checkout = await stripe.initEmbeddedCheckout({
        fetchClientSecret
    });
    checkout.mount("#checkout");
}