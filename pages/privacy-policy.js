// pages/privacy-policy.js
import Head from 'next/head'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function PrivacyPolicy() {
  return (
    <>
      <Head><title>Privacy Policy — QuikCart</title></Head>
      <div className="page-wrap">
        <Navbar />
        <div style={{ maxWidth:760, margin:'32px auto', padding:'0 16px' }}>
          <div style={{ background:'white', border:'1px solid #e0e6ef', borderRadius:10, padding:'32px 36px' }}>
            <h1 style={{ fontSize:24, fontWeight:800, color:'#1a1f2e', marginBottom:6 }}>Privacy Policy</h1>
            <p style={{ fontSize:13, color:'#6b7280', marginBottom:28 }}>Last updated: January 2025</p>

            {[
              ['1. Who we are', 'QuikCart is an e-commerce platform operated as a sole trader business in the United Kingdom. When you place an order with us, we act as the seller and retailer. Our contact email is quikcarttoday@gmail.com.'],
              ['2. What information we collect', 'We collect information you provide when placing an order: your name, email address, and delivery address. We also collect payment information, which is processed securely by Stripe and never stored on our servers. We may collect basic usage data about how you interact with our website.'],
              ['3. How we use your information', 'We use your personal information solely to process and fulfil your orders, send you order confirmation and tracking information, respond to your customer service enquiries, and comply with our legal obligations.'],
              ['4. Who we share your information with', 'We share your delivery address with our fulfilment suppliers in order to dispatch your order. We use Stripe for payment processing — their privacy policy applies to payment data. We use Resend to send transactional emails. We do not sell, rent, or trade your personal information to any third party for marketing purposes.'],
              ['5. How long we keep your data', 'We retain your order information for up to 6 years to comply with UK tax and accounting regulations. You may request deletion of your data outside of this legal requirement by contacting us.'],
              ['6. Your rights', 'Under UK GDPR you have the right to access the personal data we hold about you, request correction of inaccurate data, request deletion of your data (subject to legal obligations), and object to processing. To exercise any of these rights, email quikcarttoday@gmail.com.'],
              ['7. Cookies', 'We use only essential cookies required for the website to function, including session cookies for your shopping cart. We do not use advertising or tracking cookies.'],
              ['8. Security', 'We use industry-standard security measures to protect your data. All payments are processed over encrypted HTTPS connections. We never store your full card details.'],
              ['9. Contact', 'For any privacy-related questions or requests, please contact us at quikcarttoday@gmail.com.'],
            ].map(([title, body]) => (
              <div key={title} style={{ marginBottom:24 }}>
                <h2 style={{ fontSize:15, fontWeight:700, color:'#1a1f2e', marginBottom:8 }}>{title}</h2>
                <p style={{ fontSize:13, color:'#444', lineHeight:1.8 }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
        <Footer />
      </div>
    </>
  )
}
