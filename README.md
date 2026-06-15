# QuikCart — File Structure

## Copy files into these exact locations:

quikcart/
├── pages/
│   ├── _app.js               ← App wrapper + cart context (REQUIRED FIRST)
│   ├── index.js              ← Homepage
│   ├── shop.js               ← Shop / product listing
│   ├── cart.js               ← Cart page
│   ├── checkout.js           ← Checkout + Stripe redirect
│   ├── order-success.js      ← Post-payment confirmation
│   └── api/
│       ├── checkout.js       ← Creates Stripe session
│       └── webhook.js        ← Handles payment + triggers Amazon + email
│
├── components/
│   ├── Navbar.js             ← Top navigation bar
│   ├── Footer.js             ← Footer
│   ├── ProductCard.js        ← Reusable product card
│   └── Toast.js              ← "Added to cart" notification
│
├── lib/
│   ├── products.js           ← Product data (replace with Supabase)
│   ├── supabase.js           ← Database client
│   ├── amazon.js             ← Amazon auto-purchase service
│   └── email.js              ← Confirmation email sender
│
├── styles/
│   └── globals.css           ← Global styles
│
├── .env.local                ← Your secret keys (never commit to GitHub)
├── next.config.js
└── package.json

## Run locally:
npm run dev
→ Open http://localhost:3000

## Deploy:
git add .
git commit -m "QuikCart build"
git push origin main
→ Vercel auto-deploys in 60 seconds
