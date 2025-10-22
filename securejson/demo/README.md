# SecureJSON Demo Files

This directory contains sample files and examples for the SecureJSON demo on seclayer.io.

## Files

### Sample Data
- `nft-metadata.json` - NFT metadata example
- `mintpack.json` - Trading card collection example

### Demo Keys
- `demo-private.pem` - ES256 private key (for demo only!)
- `demo-public.pem` - ES256 public key (for demo only!)

### Signed Examples
- `nft-signed.json` - Signed NFT metadata
- `mintpack-signed.json` - Signed mintpack data

## Demo Commands

```bash
# Generate new keys
securejson generate-key --algo es256 --prefix demo

# Sign data
securejson sign --key demo-private.pem --file nft-metadata.json --out nft-signed.json --algo es256

# Verify signature
securejson verify --key demo-public.pem --file nft-signed.json

# Raw output (for scripting)
securejson verify --key demo-public.pem --file nft-signed.json --raw

# Quiet mode (for automation)
securejson sign --key demo-private.pem --file data.json --out signed.json --quiet
```

## Integration

The `demo-section.html` file contains the complete demo section that can be integrated into the seclayer.io/securejson page.

## Security Note

⚠️ **These are demo keys only!** Never use these keys in production. Always generate your own keys for real applications.
