// This script demonstrates the commands you need to run
// to set up your Stripe webhook application

const { execSync } = require('child_process');
const os = require('os');

// Function to execute shell commands and print output
function runCommand(command) {
  console.log(`\n> ${command}`);
  try {
    const output = execSync(command, { encoding: 'utf8' });
    if (output) console.log(output);
    return true;
  } catch (error) {
    console.error(`Error executing command: ${error.message}`);
    if (error.stdout) console.log(error.stdout.toString());
    if (error.stderr) console.log(error.stderr.toString());
    return false;
  }
}

// Main setup process
console.log("=== STRIPE WEBHOOK SETUP GUIDE ===\n");

console.log("Step 1: Install dependencies");
console.log("Run these commands in your terminal:");
console.log("npm install dotenv express morgan stripe nodemon");

console.log("\nStep 2: Create .env file");
console.log("Create a .env file with your Stripe API keys:");
console.log(`
STRIPE_SECRET_KEY=sk_test_51QgjgHGSIZgfDtrHXIeJdmFa2tUeB5pF8YAYGsxGBhT2qJSnibOujBh7FTVcKTcWvkjybalGdhIh3SdtMi0XCIuq00K7UxNEoH
PORT=4242
`);

console.log("\nStep 3: Start your server");
console.log("Run: npm start");

console.log("\nStep 4: Expose your local server to the internet");
console.log("You have several options:");

console.log("\nOption A: Use ngrok (recommended for development)");
console.log("1. Install ngrok: npm install -g ngrok");
console.log("2. Run: ngrok http 4242");
console.log("3. Copy the https URL provided by ngrok (e.g., https://a1b2c3d4.ngrok.io)");

console.log("\nOption B: Use Stripe CLI for local testing");
console.log("1. Install Stripe CLI from https://stripe.com/docs/stripe-cli");
console.log("2. Run: stripe login");
console.log("3. Run: stripe listen --forward-to localhost:4242/webhook");
console.log("4. Copy the webhook signing secret provided by the CLI");

console.log("\nOption C: Deploy to a hosting service");
console.log("1. Deploy your application to Vercel, Heroku, etc.");
console.log("2. Use the provided URL from your hosting service");

console.log("\nStep 5: Configure webhook in Stripe Dashboard");
console.log("1. Go to https://dashboard.stripe.com/webhooks");
console.log("2. Click 'Add endpoint'");
console.log("3. Enter your endpoint URL: https://your-url.com/webhook");
console.log("4. Select the 'issuing_authorization.request' event");
console.log("5. Click 'Add endpoint'");
console.log("6. Copy the signing secret and add it to your .env file as STRIPE_WEBHOOK_SECRET");

console.log("\n=== ENDPOINT FORMAT ===");
console.log("The endpoint URL to paste into Stripe will be:");
console.log("https://your-ngrok-url/webhook");
console.log("or");
console.log("https://your-deployed-app-url/webhook");

console.log("\n=== TESTING YOUR WEBHOOK ===");
console.log("To test your webhook, use the Stripe CLI:");
console.log("stripe trigger issuing_authorization.request");

