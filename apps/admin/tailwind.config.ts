import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ['selector', '[data-theme="dark"]'],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "slate-50": "var(--color-slate-50)",
        surface: "var(--color-surface)",
        "surface-neutral-soft": "var(--color-surface-neutral-soft)",
        "surface-container-lowest": "var(--color-surface-container-lowest)",
        "surface-container-low": "var(--color-surface-container-low)",
        "surface-container": "var(--color-surface-container)",
        "surface-container-high": "var(--color-surface-container-high)",
        "surface-container-highest": "var(--color-surface-container-highest)",
        "table-header-surface": "var(--color-table-header-surface)",
        "table-row-hover": "var(--color-table-row-hover)",
        "on-surface": "var(--color-on-surface)",
        "on-surface-variant": "var(--color-on-surface-variant)",
        primary: "var(--color-primary)",
        "primary-strong": "var(--color-primary-strong)",
        "primary-container": "var(--color-primary-container)",
        "auth-ambient-strong": "var(--color-auth-ambient-strong)",
        "auth-ambient-soft": "var(--color-auth-ambient-soft)",
        "on-primary": "var(--color-on-primary)",
        "on-primary-container": "var(--color-on-primary-container)",
        tertiary: "var(--color-tertiary)",
        "tertiary-container": "var(--color-tertiary-container)",
        "on-tertiary-container": "var(--color-on-tertiary-container)",
        success: "var(--color-success)",
        warning: "var(--color-warning)",
        danger: "var(--color-danger)",
        "outline-variant": "rgb(var(--color-outline-variant) / <alpha-value>)",
        "focus-ring": "var(--color-focus-ring)",
        "status-published-surface": "var(--color-status-published-surface)",
        "status-published-on": "var(--color-status-published-on)",
        "status-draft-surface": "var(--color-status-draft-surface)",
        "status-draft-on": "var(--color-status-draft-on)",
        "status-draft-border": "var(--color-status-draft-border)",
        "status-scheduled-surface": "var(--color-status-scheduled-surface)",
        "status-scheduled-on": "var(--color-status-scheduled-on)",
        "status-scheduled-border": "var(--color-status-scheduled-border)",
        "status-archived-surface": "var(--color-status-archived-surface)",
        "status-archived-on": "var(--color-status-archived-on)",
        "status-archived-border": "var(--color-status-archived-border)",
        "status-unknown-surface": "var(--color-status-unknown-surface)",
        "status-unknown-on": "var(--color-status-unknown-on)",
        "status-unknown-border": "var(--color-status-unknown-border)",
        "nav-active-surface": "var(--color-nav-active-surface)"
      },
      spacing: {
        1: "var(--space-1)",
        1.5: "var(--space-1-5)",
        2: "var(--space-2)",
        2.5: "var(--space-2-5)",
        3: "var(--space-3)",
        4: "var(--space-4)",
        5: "var(--space-5)",
        6: "var(--space-6)",
        8: "var(--space-8)",
        10: "var(--space-10)",
        12: "var(--space-12)",
        14: "var(--space-14)"
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        full: "var(--radius-full)"
      },
      boxShadow: {
        ambient: "var(--shadow-ambient)",
        float: "var(--shadow-float)"
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
        mono: ["var(--font-mono)"]
      }
    }
  }
};

export default config;
