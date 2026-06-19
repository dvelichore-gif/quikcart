"use strict";(()=>{var e={};e.id=91,e.ids=[91],e.modules={145:e=>{e.exports=require("next/dist/compiled/next-server/pages-api.runtime.prod.js")},6326:e=>{e.exports=import("resend")},6906:(e,t,a)=>{a.a(e,async(e,r)=>{try{a.r(t),a.d(t,{config:()=>l,default:()=>p,routeModule:()=>c});var i=a(1802),o=a(7153),s=a(6249),d=a(1985),n=e([d]);d=(n.then?(await n)():n)[0];let p=(0,s.l)(d,"default"),l=(0,s.l)(d,"config"),c=new i.PagesAPIRouteModule({definition:{kind:o.x.PAGES_API,page:"/api/contact",pathname:"/api/contact",bundlePath:"",filename:""},userland:d});r()}catch(e){r(e)}})},1985:(e,t,a)=>{a.a(e,async(e,r)=>{try{a.r(t),a.d(t,{default:()=>handler});var i=a(6326),o=e([i]);i=(o.then?(await o)():o)[0];let s=new i.Resend(process.env.RESEND_API_KEY);async function handler(e,t){if("POST"!==e.method)return t.status(405).end();let{name:a,email:r,message:i}=e.body;if(!i||!i.trim())return t.status(400).json({error:"Message cannot be empty"});try{await s.emails.send({from:`QuikCart Help Centre <${process.env.EMAIL_FROM}>`,to:"quikcarttoday@gmail.com",reply_to:r||void 0,subject:`New Help Centre message from ${a||"a customer"}`,html:`
        <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:560px;margin:0 auto">
          <div style="background:#1a6fc4;padding:16px 22px;border-radius:10px 10px 0 0">
            <span style="font-size:20px;font-weight:800;color:white">Quik<span style="color:#ff6b00">Cart</span></span>
            <div style="color:rgba(255,255,255,0.8);font-size:12px;margin-top:2px">New Help Centre message</div>
          </div>
          <div style="background:white;border:1px solid #e0e6ef;border-top:none;border-radius:0 0 10px 10px;padding:22px">
            <table cellpadding="0" cellspacing="0" width="100%" style="font-size:13px;color:#1a1f2e">
              <tr><td style="padding:4px 0;color:#6b7280;width:80px">From</td><td style="padding:4px 0;font-weight:600">${a||"Not provided"}</td></tr>
              <tr><td style="padding:4px 0;color:#6b7280">Email</td><td style="padding:4px 0;font-weight:600">${r||"Not provided"}</td></tr>
            </table>
            <div style="margin-top:14px;padding-top:14px;border-top:1px solid #f0f2f5">
              <div style="font-size:11px;color:#6b7280;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:6px">Message</div>
              <div style="font-size:14px;color:#1a1f2e;line-height:1.6;white-space:pre-wrap">${i}</div>
            </div>
          </div>
        </div>
      `}),t.status(200).json({success:!0})}catch(e){console.error("Contact email failed:",e),t.status(500).json({error:"Failed to send message. Please try again."})}}r()}catch(e){r(e)}})}};var t=require("../../webpack-api-runtime.js");t.C(e);var __webpack_exec__=e=>t(t.s=e),a=t.X(0,[702],()=>__webpack_exec__(6906));module.exports=a})();