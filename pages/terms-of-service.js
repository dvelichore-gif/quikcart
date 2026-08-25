// pages/terms-of-service.js
import Head from 'next/head'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function TermsOfService() {
  return (
    <>
      <Head><title>Terms of Service — QuikCart</title></Head>
      <div className="page-wrap">
        <Navbar />
        <div style={{ maxWidth:760, margin:'32px auto', padding:'0 16px' }}>
          <div style={{ background:'white', border:'1px solid #e0e6ef', borderRadius:10, padding:'32px 36px' }}>
            <h1 style={{ fontSize:24, fontWeight:800, color:'#1a1f2e', marginBottom:6 }}>Terms of Service</h1>
            <p style={{ fontSize:13, color:'#6b7280', marginBottom:28 }}>Last updated: January 2025</p>

            {[
              ['1. Agreement', 'By placing an order on QuikCart you agree to these Terms of Service in full. If you do not agree with any part of these terms, you must not use our website or place an order.'],
              ['2. About QuikCart', 'QuikCart is an e-commerce retailer operating in the United Kingdom. We source and fulfil products on behalf of our customers. All prices are displayed in GBP and all transactions are processed in GBP via Stripe.'],
              ['3. Orders and payment', 'When you place an order, you are making an offer to purchase the products at the stated price. We reserve the right to refuse or cancel any order at our discretion. Payment is taken at the time of checkout and processed securely by Stripe. We accept Visa, Mastercard, American Express, Apple Pay, and Google Pay.'],
              ['4. Delivery', 'We aim to dispatch orders within 2 working days. Estimated delivery times are 7 to 14 working days for standard UK delivery. These are estimates only and not guaranteed. We are not liable for delays caused by circumstances outside our control including customs, courier issues, or supplier delays.'],
              ['5. Pricing', 'All prices are shown inclusive of any applicable VAT where required. We reserve the right to change our prices at any time. The price shown at the time you place your order is the price you will be charged.'],
              ['6. Returns and refunds', 'If you wish to return an item or request a refund, you must contact us at quikcarttoday@gmail.com within 14 days of receiving your order. All refund requests are reviewed and processed at QuikCart sole discretion. We reserve the right to decline refund requests where the product has been used, damaged by the customer, or where the return request falls outside the 14-day window. Approved refunds will be processed within 10 working days to your original payment method.'],
              ['7. Chargebacks', 'Initiating a chargeback or payment dispute without first contacting us and allowing us a reasonable opportunity to resolve the matter may result in your account being suspended and legal action being taken to recover the disputed funds plus associated costs.'],
              ['8. Limitation of liability', 'To the fullest extent permitted by law, QuikCart shall not be liable for any indirect, incidental, or consequential damages arising from your use of our website or products purchased through it. Our total liability for any claim shall not exceed the amount you paid for the relevant order.'],
              ['9. Intellectual property', 'All content on the QuikCart website including text, graphics, logos, and design is the property of QuikCart and may not be reproduced without our written consent.'],
              ['10. Governing law', 'These terms are governed by the laws of England and Wales. Any disputes shall be subject to the exclusive jurisdiction of the courts of England and Wales.'],
              ['11. Contact', 'For any questions about these terms, please contact us at quikcarttoday@gmail.com.'],
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
