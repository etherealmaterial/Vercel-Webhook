// Load environment variables
require("dotenv").config()

const express = require("express")
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)
const morgan = require("morgan")
const app = express()

// Add morgan for logging
app.use(morgan("dev"))

// This is critical: use raw body parser for Stripe webhooks
app.post("/webhook", express.raw({ type: "application/json" }), async (request, response) => {
  const sig = request.headers["stripe-signature"]
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

  let event

  try {
    // Verify the event came from Stripe
    if (endpointSecret) {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret)
    } else {
      // For testing without signature verification
      event = JSON.parse(request.body.toString())
      console.log("⚠️ Webhook signature verification bypassed")
    }
  } catch (err) {
    console.log(`⚠️ Webhook signature verification failed: ${err.message}`)
    return response.status(400).send(`Webhook Error: ${err.message}`)
  }

  // Handle the event
  console.log(`✅ Received event: ${event.type}`)

  if (event.type === "issuing_authorization.request") {
    try {
      // Simple authorization logic - approve transactions under 1000 units
      const auth = event.data.object
      const approved = auth.pending_request.amount <= 1000

      console.log(`Authorization decision: ${approved ? "APPROVED" : "DECLINED"}`)

      // Return a synchronous response for the authorization decision
      response.writeHead(200, {
        "Stripe-Version": "2022-08-01",
        "Content-Type": "application/json",
      })

      const responseBody = {
        approved,
        metadata: {
          reason: approved ? "Amount within limit" : "Amount exceeds limit",
          processed_at: new Date().toISOString(),
        },
      }

      response.end(JSON.stringify(responseBody))
      return
    } catch (error) {
      console.error("Error handling authorization request:", error)
      return response.status(500).send("Error processing authorization")
    }
  } else {
    // For all other event types, just acknowledge receipt
    response.status(200).send()
  }
})

// Standard JSON parser for other routes
app.use(express.json())

app.get("/api", (req, res) => {
  res.json({ message: "Hello from the API" })
})

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).send({ status: "ok" })
})

// For local development
const PORT = process.env.PORT || 4242
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

// Export the Express app for Vercel
module.exports = app

