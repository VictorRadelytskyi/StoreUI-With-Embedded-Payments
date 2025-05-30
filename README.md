# StoreUI-With-Embedded-Payments

A straightforward online store with embedded payment processing built using JavaScript, Express.js, and Stripe.js.

## Features
- Three main endpoints:
  - `/` — Home page  
  - `/store` — Product listing and shopping cart  
  - `/about` — About page  
- Secure payment integration using Stripe API and Stripe.js  
- Serves static files for frontend UI  
- Smooth payment flow with redirect on success  

## UI Preview

**Home Page:**  
![Home UI](https://github.com/user-attachments/assets/4ee5c841-e394-4fd7-9486-b8ae399be52d)

**Store Page:**  
![Store UI](https://github.com/user-attachments/assets/2797e47e-c16d-4454-8629-7b49086ff462)

**Payment Page (example card info filled):**  
![Payment UI](https://github.com/user-attachments/assets/31ceb110-151b-49a3-9f59-d6f71c660490)

## How It Works
1. Browse products on the store page and add items to the cart.  
2. Proceed to checkout and enter payment details securely via Stripe.js.  
3. Click "Purchase" to process the payment.  
4. On success, the user is redirected to a confirmation page.

## Tech Stack
- JavaScript (Node.js)  
- Express.js (Backend server)  
- Stripe.js (Payment integration)

## Getting Started

### Prerequisites
- Node.js installed  
- Stripe account and API keys  

### Installation
```bash
git clone <repo-url>
cd StoreUI-With-Embedded-Payments
npm install
