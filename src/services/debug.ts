/**
 * Debug/Logging Service
 * Centralise tous les logs pour faciliter le débogage
 */

export const DEBUG_LEVELS = {
  LOG: "LOG",
  INFO: "INFO",
  WARN: "WARN",
  ERROR: "ERROR",
  DEBUG: "DEBUG",
} as const;

type DebugLevel = (typeof DEBUG_LEVELS)[keyof typeof DEBUG_LEVELS];

interface DebugEntry {
  timestamp: string;
  level: DebugLevel;
  module: string;
  message: string;
  data?: unknown;
}

class DebugService {
  private logs: DebugEntry[] = [];
  private maxLogs = 500; // Keep last 500 logs in memory

  private formatTime(): string {
    return new Date().toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      fractionalSecondDigits: 3,
    });
  }

  private formatLevel(level: DebugLevel): string {
    const colors: Record<DebugLevel, string> = {
      LOG: "%cℹ️",
      INFO: "%c✅",
      WARN: "%c⚠️",
      ERROR: "%c❌",
      DEBUG: "%c🔍",
    };

    const bgColors: Record<DebugLevel, string> = {
      LOG: "background-color: #3b82f6; color: white; padding: 2px 6px; border-radius: 3px;",
      INFO: "background-color: #10b981; color: white; padding: 2px 6px; border-radius: 3px;",
      WARN: "background-color: #f59e0b; color: white; padding: 2px 6px; border-radius: 3px;",
      ERROR:
        "background-color: #ef4444; color: white; padding: 2px 6px; border-radius: 3px;",
      DEBUG:
        "background-color: #8b5cf6; color: white; padding: 2px 6px; border-radius: 3px;",
    };

    return `${colors[level]} ${bgColors[level]}`;
  }

  debug(module: string, message: string, data?: unknown): void {
    const entry: DebugEntry = {
      timestamp: this.formatTime(),
      level: "DEBUG",
      module,
      message,
      data,
    };

    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    if (typeof window !== "undefined") {
      console.log(
        `%c${entry.timestamp} %c[${module}]%c 🔍 ${message}`,
        "color: #666; font-size: 0.8em;",
        "color: #333; font-weight: bold;",
        "color: #8b5cf6; font-weight: bold;",
        data !== undefined ? data : "",
      );
    }
  }

  info(module: string, message: string, data?: unknown): void {
    const entry: DebugEntry = {
      timestamp: this.formatTime(),
      level: "INFO",
      module,
      message,
      data,
    };

    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    if (typeof window !== "undefined") {
      console.log(
        `%c${entry.timestamp} %c[${module}]%c ✅ ${message}`,
        "color: #666; font-size: 0.8em;",
        "color: #333; font-weight: bold;",
        "color: #10b981; font-weight: bold;",
        data !== undefined ? data : "",
      );
    }
  }

  warn(module: string, message: string, data?: unknown): void {
    const entry: DebugEntry = {
      timestamp: this.formatTime(),
      level: "WARN",
      module,
      message,
      data,
    };

    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    if (typeof window !== "undefined") {
      console.warn(
        `%c${entry.timestamp} %c[${module}]%c ⚠️ ${message}`,
        "color: #666; font-size: 0.8em;",
        "color: #333; font-weight: bold;",
        "color: #f59e0b; font-weight: bold;",
        data !== undefined ? data : "",
      );
    }
  }

  error(module: string, message: string, data?: unknown): void {
    const entry: DebugEntry = {
      timestamp: this.formatTime(),
      level: "ERROR",
      module,
      message,
      data,
    };

    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    if (typeof window !== "undefined") {
      console.error(
        `%c${entry.timestamp} %c[${module}]%c ❌ ${message}`,
        "color: #666; font-size: 0.8em;",
        "color: #333; font-weight: bold;",
        "color: #ef4444; font-weight: bold;",
        data !== undefined ? data : "",
      );
    }
  }

  log(module: string, message: string, data?: unknown): void {
    const entry: DebugEntry = {
      timestamp: this.formatTime(),
      level: "LOG",
      module,
      message,
      data,
    };

    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    if (typeof window !== "undefined") {
      console.log(
        `%c${entry.timestamp} %c[${module}]%c ℹ️ ${message}`,
        "color: #666; font-size: 0.8em;",
        "color: #333; font-weight: bold;",
        "color: #3b82f6; font-weight: bold;",
        data !== undefined ? data : "",
      );
    }
  }

  getLogs(): DebugEntry[] {
    return [...this.logs];
  }

  getLogsByModule(module: string): DebugEntry[] {
    return this.logs.filter((log) => log.module === module);
  }

  getLogsByLevel(level: DebugLevel): DebugEntry[] {
    return this.logs.filter((log) => log.level === level);
  }

  printLogs(): void {
    console.table(this.logs);
  }

  clear(): void {
    this.logs = [];
    console.log("Debug logs cleared");
  }
}

// Singleton instance
export const debugService = new DebugService();

// Export pour accès global en console
if (typeof window !== "undefined") {
  (window as Window & { __DEBUG__?: DebugService }).__DEBUG__ = debugService;
  console.log("🔧 Debug service available: window.__DEBUG__.printLogs()");
}
