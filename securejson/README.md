# 🔐 SecureJSON

SecureJSON is a lightweight standard for **signing and verifying JSON files** — perfect for Web3 mints, NFTs, collectibles, and proofs.

It works like a JSON Web Token (JWT), but without being tied to an auth system.

> 📎 One file.  
> 🔑 One public key.  
> 🧠 Trust you can prove — anywhere your metadata lives.

---

## 🚀 Quick Start

### 📦 Install the CLI
```bash
npm install -g securejson
```

### ✍️ Sign a JSON file
```bash
securejson sign ./mintpack.json --key ./private.pem --out ./signed.json
```

### ✅ Verify a signed file
```bash
securejson verify ./signed.json --key ./public.pem
```

## 🛡️ Core Features

**Deterministic Key Sorting**  
Ensures consistent hashes even if field order changes.

**Algorithm Flexibility**  
Supports both RSA (RS256) and Elliptic Curve (ES256) signing algorithms with auto-detection.

**CLI Output Options**  
Multiple output formats (pretty, raw, quiet) for different use cases and automation.

**Detached JWS Signatures**  
Compact signatures that only store the hash, minimizing onchain metadata size while maintaining full security.

## 🧪 Demo

**Live Demo:** [seclayer.io/securejson](https://seclayer.io/securejson)  
Try SecureJSON in your browser with interactive examples!

### Quick Start
```bash
# 1. Generate keys
securejson generate-key --algo es256

# 2. Sign your data
securejson sign --key key-private.pem --file data.json --out signed.json

# 3. Verify signature
securejson verify --key key-public.pem --file signed.json
```

## 📜 TL;DR Whitepaper

**The Problem:**  
Web3 metadata is often unsigned and editable, meaning anyone can spoof a mint or tamper with your data.

**The Solution:**  
SecureJSON signs your metadata using JWS and embeds a cryptographic signature in a standard, portable format.

**Why It Matters:**  
Your token isn't secure if your metadata isn't.  
SecureJSON adds proof without needing a vault, blockchain, or server.

## 🔍 Example

Here's a sample signed file output:

```json
{
  "payload": {
    "name": "Kickass MintPack",
    "cards": ["wood-rc", "soto-ssp", "elinfire-foil"]
  },
  "signature": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjEifQ....",
  "alg": "RS256"
}
```

## 📂 Test Files

Use these to try it out:

- `mintpack.json`
- `signed-mintpack.json`
- `public.pem`
- `private.pem`

*(Coming soon in testdata/ folder)*

## 🤝 License

MIT — use it, fork it, remix it.  
If it helps the Layerverse or hobby, you're already family.

**Built by Hope3 Labs**  
SecureLayer division | [seclayer.io](https://seclayer.io)

*Inspired by "Can Security Be Built into Pure Data?" by Wyatt Lee - 2600 Volume Thirty-Three, Number Four*
