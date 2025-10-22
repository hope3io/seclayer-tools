#!/usr/bin/env ts-node

import { Command } from "commander";
import { signFile } from "../src/sign.js";
import { verifyFile } from "../src/verify.js";
import { generateKeyPair } from "../src/generate.js";

const program = new Command();

program
  .name("securejson")
  .description("Sign and verify SecureJSON files")
  .version("0.1.0");

program
  .command("sign")
  .description("Sign a JSON file with a private key")
  .requiredOption("-k, --key <path>", "Private key file (PEM)")
  .requiredOption("-f, --file <path>", "JSON file to sign")
  .requiredOption("-o, --out <path>", "Output file for signed JSON")
  .option("-a, --algo <algorithm>", "Signing algorithm (rs256 or es256)", "rs256")
  .option("--pretty", "Pretty print output with colors and formatting")
  .option("--raw", "Output raw JSON without formatting")
  .option("--quiet", "Suppress all output except errors")
  .action(signFile);

program
  .command("verify")
  .description("Verify a signed SecureJSON file")
  .requiredOption("-k, --key <path>", "Public key file (PEM)")
  .requiredOption("-f, --file <path>", "Signed JSON file")
  .option("-a, --algo <algorithm>", "Signing algorithm (rs256 or es256)", "rs256")
  .option("--pretty", "Pretty print output with colors and formatting")
  .option("--raw", "Output raw JSON without formatting")
  .option("--quiet", "Suppress all output except errors")
  .action(verifyFile);

program
  .command("generate-key")
  .description("Generate a new key pair")
  .requiredOption("-a, --algo <algorithm>", "Key algorithm (rs256 or es256)", "rs256")
  .option("-p, --prefix <prefix>", "Key file prefix", "key")
  .option("--pretty", "Pretty print output with colors and formatting")
  .option("--raw", "Output raw JSON without formatting")
  .option("--quiet", "Suppress all output except errors")
  .action(generateKeyPair);

program.parse();
