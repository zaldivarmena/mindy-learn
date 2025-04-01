import { db } from "@/configs/db";
import { USER_TABLE, PAYMENT_RECORD_TABLE } from "@/configs/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { headers } from "next/headers";

export async function POST(req) {
  // Get the request body as text for webhook verification
  const text = await req.text();
  const headersList = headers();
  const signature = headersList.get("stripe-signature");
  
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // Fixed typo in env variable name

  let event;
  let data;
  let eventType;
  
  // Check if webhook signing is configured
  const webhookSecret = process.env.STRIPE_WEB_HOOK_KEY;
  
  try {
    if (webhookSecret && signature) {
      // Verify webhook signature
      event = stripe.webhooks.constructEvent(text, signature, webhookSecret);
      data = event.data;
      eventType = event.type;
      console.log(`✅ Webhook verified: ${eventType}`);
    } else {
      // For testing without signature verification
      const payload = JSON.parse(text);
      data = payload.data;
      eventType = payload.type;
      console.log(`⚠️ Webhook without signature: ${eventType}`);
    }
  } catch (err) {
    console.error(`❌ Webhook Error: ${err.message}`);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Log the event for debugging
  console.log(`Processing Stripe event: ${eventType}`);
  console.log('Event data:', JSON.stringify(data.object));
  
  try {
    switch (eventType) {
      case 'checkout.session.completed':
        // Payment is successful and the subscription is created
        const session = data.object;
        
        // Make sure we have the customer email
        if (!session.customer_details?.email) {
          console.error('No customer email found in session');
          break;
        }
        
        // Update user record with subscription info
        const updateResult = await db.update(USER_TABLE).set({
          isMember: true,
          customerId: session.customer // Save the customer ID for future reference
        }).where(eq(USER_TABLE.email, session.customer_details.email));
        
        // Record the payment in payment records table
        await db.insert(PAYMENT_RECORD_TABLE).values({
          customerId: session.customer,
          sessionId: session.id
        });
        
        console.log(`User ${session.customer_details.email} subscription activated`);
        break;
        
      case 'invoice.paid':
        // Continue to provision the subscription as payments continue to be made
        const invoice = data.object;
        
        // Update user membership status
        await db.update(USER_TABLE).set({
          isMember: true
        }).where(eq(USER_TABLE.email, invoice.customer_email));
        
        // Record the payment
        await db.insert(PAYMENT_RECORD_TABLE).values({
          customerId: invoice.customer,
          sessionId: invoice.id
        });
        
        console.log(`Invoice paid for customer ${invoice.customer}`);
        break;

      case 'customer.subscription.deleted':
        // Handle subscription cancellation
        const subscription = data.object;
        
        // Update user membership status to false
        await db.update(USER_TABLE).set({
          isMember: false
        }).where(eq(USER_TABLE.customerId, subscription.customer));
        
        console.log(`Subscription deleted for customer ${subscription.customer}`);
        break;
        
      case 'invoice.payment_failed':
        // The payment failed or the customer does not have a valid payment method
        const failedInvoice = data.object;
        
        // Update user membership status
        if (failedInvoice.customer_email) {
          await db.update(USER_TABLE).set({
            isMember: false
          }).where(eq(USER_TABLE.email, failedInvoice.customer_email));
          
          console.log(`Payment failed for ${failedInvoice.customer_email}`);
        } else if (failedInvoice.customer) {
          // Fallback to customer ID if email not available
          await db.update(USER_TABLE).set({
            isMember: false
          }).where(eq(USER_TABLE.customerId, failedInvoice.customer));
          
          console.log(`Payment failed for customer ${failedInvoice.customer}`);
        }
        break;
        
      default:
        // Unhandled event type
        console.log(`Unhandled event type: ${eventType}`);
    }
  } catch (error) {
    console.error(`Error processing webhook: ${error.message}`);
    return new Response(`Error processing webhook: ${error.message}`, { status: 500 });
  }

  // Return a 200 response to acknowledge receipt of the event
  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}