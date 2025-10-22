import fs from "fs/promises";
import { generateKeyPairSync } from "crypto";
import { createFormatter } from "./output.js";

export async function generateKeyPair(opts: {
  algo: string;
  prefix: string;
  pretty?: boolean;
  raw?: boolean;
  quiet?: boolean;
}) {
  const { algo, prefix, ...outputOpts } = opts;
  const output = createFormatter(outputOpts);

  try {
    output.keygen(`Generating ${algo.toUpperCase()} key pair...`);

    let keyPair: any;

    if (algo === "es256") {
      // Generate EC key pair for ES256
      keyPair = generateKeyPairSync("ec", {
        namedCurve: "prime256v1",
        publicKeyEncoding: {
          type: "spki",
          format: "pem"
        },
        privateKeyEncoding: {
          type: "pkcs8",
          format: "pem"
        }
      });
    } else if (algo === "rs256") {
      // Generate RSA key pair for RS256
      keyPair = generateKeyPairSync("rsa", {
        modulusLength: 2048,
        publicKeyEncoding: {
          type: "spki",
          format: "pem"
        },
        privateKeyEncoding: {
          type: "pkcs8",
          format: "pem"
        }
      });
    } else {
      throw new Error(`Unsupported algorithm: ${algo}. Use 'rs256' or 'es256'`);
    }

    // Write keys to files
    const privateKeyFile = `${prefix}-private.pem`;
    const publicKeyFile = `${prefix}-public.pem`;

    await fs.writeFile(privateKeyFile, keyPair.privateKey);
    await fs.writeFile(publicKeyFile, keyPair.publicKey);

    output.success(`Private key saved to: ${privateKeyFile}`);
    output.success(`Public key saved to: ${publicKeyFile}`);
    output.info(`Algorithm: ${algo.toUpperCase()}`);

  } catch (error: any) {
    output.error(`❌ Key generation failed: ${error.message}`);
    process.exit(1);
  }
}
