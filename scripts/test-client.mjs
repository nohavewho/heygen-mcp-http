import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";

const origin = process.argv[2] || "http://localhost:3000";

async function main() {
  const transport = new SSEClientTransport(new URL(`${origin}/sse`));

  const client = new Client(
    {
      name: "heygen-test-client",
      version: "1.0.0",
    },
    {
      capabilities: {
        prompts: {},
        resources: {},
        tools: {},
      },
    }
  );

  console.log("Connecting to", origin);
  await client.connect(transport);

  console.log("Connected! Server capabilities:", client.getServerCapabilities());

  console.log("\nListing available tools:");
  const tools = await client.listTools();
  console.log(JSON.stringify(tools, null, 2));

  // Test get_remaining_credits
  console.log("\nTesting get_remaining_credits:");
  try {
    const creditsResult = await client.callTool("get_remaining_credits", {});
    console.log("Credits:", creditsResult);
  } catch (error) {
    console.error("Error getting credits:", error.message);
  }

  // Test get_voices
  console.log("\nTesting get_voices:");
  try {
    const voicesResult = await client.callTool("get_voices", {});
    console.log("Voices (first 3):", JSON.stringify(voicesResult.content[0].text.slice(0, 500) + "...", null, 2));
  } catch (error) {
    console.error("Error getting voices:", error.message);
  }

  client.close();
}

main().catch(console.error); 