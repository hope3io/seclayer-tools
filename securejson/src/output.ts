// Output formatting utilities for SecureJSON CLI

export interface OutputOptions {
  pretty?: boolean;
  raw?: boolean;
  quiet?: boolean;
}

export class OutputFormatter {
  private options: OutputOptions;

  constructor(options: OutputOptions = {}) {
    this.options = options;
  }

  // Log a message (respects quiet mode)
  log(message: string): void {
    if (!this.options.quiet) {
      console.log(message);
    }
  }

  // Log an error (always shows, even in quiet mode)
  error(message: string): void {
    console.error(message);
  }

  // Log success message with emoji
  success(message: string): void {
    if (!this.options.quiet) {
      console.log(`✅ ${message}`);
    }
  }

  // Log info message with emoji
  info(message: string): void {
    if (!this.options.quiet) {
      console.log(`🔐 ${message}`);
    }
  }

  // Log verification message with emoji
  verify(message: string): void {
    if (!this.options.quiet) {
      console.log(`🔍 ${message}`);
    }
  }

  // Log key generation message with emoji
  keygen(message: string): void {
    if (!this.options.quiet) {
      console.log(`🔑 ${message}`);
    }
  }

  // Output JSON data with appropriate formatting
  outputJson(data: any, label?: string): void {
    if (this.options.quiet) {
      return;
    }

    if (label) {
      console.log(`📦 ${label}:`);
    }

    if (this.options.raw) {
      // Raw JSON output (compact)
      console.log(JSON.stringify(data));
    } else if (this.options.pretty) {
      // Pretty output with colors and formatting
      console.log(JSON.stringify(data, null, 2));
    } else {
      // Default output (pretty but no colors)
      console.log(JSON.stringify(data, null, 2));
    }
  }

  // Output signature info
  outputSignature(signature: string, algorithm: string): void {
    if (this.options.quiet) {
      return;
    }

    if (this.options.raw) {
      console.log(signature);
    } else {
      console.log(`🔐 Algorithm: ${algorithm}`);
      if (this.options.pretty) {
        console.log(`📝 Signature: ${signature.substring(0, 50)}...`);
      }
    }
  }

  // Output file info
  outputFileInfo(action: string, file: string): void {
    if (!this.options.quiet) {
      const emoji = action === 'signing' ? '🔐' : action === 'verifying' ? '🔍' : '📁';
      console.log(`${emoji} ${action} file...`);
    }
  }

  // Output success with file path
  outputSuccess(action: string, file: string): void {
    if (!this.options.quiet) {
      console.log(`✅ ${action} complete!`);
      if (file) {
        console.log(`📁 File: ${file}`);
      }
    }
  }
}

// Helper function to create formatter from CLI options
export function createFormatter(options: any): OutputFormatter {
  return new OutputFormatter({
    pretty: options.pretty || false,
    raw: options.raw || false,
    quiet: options.quiet || false
  });
}
