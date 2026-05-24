import { Client } from "@gradio/client";

async function test() {
  try {
    const client = await Client.connect("hnninioi/AyurGenixV8");
    const result = await client.predict("/analyze_patient", [
      "Joint pain and swelling in cold weather",
      "Winter",
      45,
      "Male",
    ]);
    console.log("API RESULT:");
    console.log(result.data);
  } catch (err) {
    console.error("API ERROR:", err);
  }
}

test();
