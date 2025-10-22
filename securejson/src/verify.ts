import fs from "fs/promises";
import { jwtVerify } from "jose";
import { createPublicKey } from "crypto";
import { canonicalize, hashPayload } from "./utils.js";
import { createFormatter } from "./output.js";

export async function verifyFile(opts: {
  key: string;
  file: string;
  algo?: string;
  pretty?: boolean;
  raw?: boolean;
  quiet?: boolean;
}) {
  const { key, file, algo, ...outputOpts } = opts;
  const output = createFormatter(outputOpts);

  try {
    output.outputFileInfo("Verifying", file);
    
    // 1. Load public key
    const keyPem = await fs.readFile(key, "utf-8");
    const publicKey = createPublicKey({ key: keyPem, format: "pem" });

    // 2. Load signed JSON
    const data = JSON.parse(await fs.readFile(file, "utf-8"));
    const { payload, signature, alg: fileAlg } = data;

    // 3. Determine algorithm (prefer file's alg, then CLI option, then auto-detect)
    const detectedAlg = fileAlg || algo || await detectAlgorithm(publicKey);
    output.info(`Using algorithm: ${detectedAlg}`);

    // 4. Verify the JWS
    const { payload: verifiedPayload, protectedHeader } = await jwtVerify(
      signature,
      publicKey
    );

    // 5. Validate custom claims (like jti === "securejson")
    if (verifiedPayload?.jti !== "securejson") {
      throw new Error("Invalid JWS claim: jti mismatch");
    }

    // 6. Verify detached signature (hash must match)
    const payloadHash = await hashPayload(payload);
    if (verifiedPayload?.hash !== payloadHash) {
      throw new Error("Payload hash mismatch - data may have been tampered with");
    }

    // 7. Verify canonical form matches
    const canonicalPayload = canonicalize(payload);
    if (verifiedPayload?.canonical !== canonicalPayload) {
      throw new Error("Canonical form mismatch - data may have been tampered with");
    }

    output.success("Signature verified!");
    
    if (!outputOpts.quiet) {
      if (outputOpts.raw) {
        // Raw mode: just output the payload as JSON
        console.log(JSON.stringify(payload));
      } else {
        // Normal/pretty mode: show formatted output
        output.outputJson(payload, "Payload");
        output.outputSignature(signature, detectedAlg);
      }
    }
    
  } catch (err: any) {
    output.error(`❌ Verification failed: ${err.message}`);
    process.exit(1);
  }
}

// Auto-detect algorithm from public key
async function detectAlgorithm(publicKey: any): Promise<string> {
  try {
    const keyInfo = publicKey.asymmetricKeyType;
    if (keyInfo === "ec") {
      return "ES256";
    } else if (keyInfo === "rsa") {
      return "RS256";
    } else {
      throw new Error("Unsupported key type");
    }
  } catch (error) {
    throw new Error("Could not detect algorithm from key");
  }
}
