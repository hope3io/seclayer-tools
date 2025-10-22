import fs from "fs/promises";
import { SignJWT } from "jose";
import { createPrivateKey } from "crypto";
import { canonicalize, hashPayload } from "./utils.js";
import { createFormatter, OutputFormatter } from "./output.js";

export async function signFile(opts: {
  key: string;
  file: string;
  out: string;
  algo?: string;
  pretty?: boolean;
  raw?: boolean;
  quiet?: boolean;
}) {
  const { key, file, out, algo = "rs256", ...outputOpts } = opts;
  const output = createFormatter(outputOpts);

  try {
    output.outputFileInfo("Signing", file);
    output.info(`Using algorithm: ${algo.toUpperCase()}`);
    
    // 1. Load private key
    const keyPem = await fs.readFile(key, "utf-8");
    const privateKey = createPrivateKey({ key: keyPem, format: "pem" });

    // 2. Load and canonicalize JSON
    const json = JSON.parse(await fs.readFile(file, "utf-8"));
    const canonical = canonicalize(json);

    // 3. Create detached JWS (sign only the hash, not the payload)
    const payloadHash = await hashPayload(json);
    const jws = await new SignJWT({ 
      hash: payloadHash,
      canonical: canonical 
    })
      .setProtectedHeader({ alg: algo.toUpperCase() })
      .setIssuedAt()
      .setJti("securejson")
      .sign(privateKey);

    // 4. Save to signed file (detached format)
    const signed = {
      payload: json,
      signature: jws,
      alg: algo.toUpperCase()
    };

    // Determine output format
    const outputFormat = outputOpts.raw ? 0 : 2;
    await fs.writeFile(out, JSON.stringify(signed, null, outputFormat));
    
    output.outputSuccess("Signing", out);
    output.outputSignature(jws, algo.toUpperCase());
    
    if (!outputOpts.quiet && !outputOpts.raw) {
      output.outputJson(json, "Payload");
    }
    
  } catch (error: any) {
    output.error(`❌ Signing failed: ${error.message}`);
    process.exit(1);
  }
}
