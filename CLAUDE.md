# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is `@xmszm/core`, a Vue 3 + Naive UI component and utility library that provides configuration-driven forms, tables, dialogs, and common utilities. The project is currently undergoing a migration from JavaScript to TypeScript.

## Development Commands

### Build and Development
```bash
# Build the library
pnpm run build

# Clean build artifacts
pnpm run clean

# Start documentation development server
pnpm run docs:dev

# Build documentation
pnpm run docs:build

# Preview built documentation
pnpm run docs:preview
```

### Examples Development
```bash
# Navigate to examples directory
cd examples

# Start examples development server
pnpm run dev

# Build examples
pnpm run build

# Preview built examples
pnpm run preview
```

### Code Quality
```bash
# The project uses @antfu/eslint-config with auto-import support
# ESLint is configured in eslint.config.mjs with Vue, JSX, and TypeScript support
# Global variables ($dialog, $message, $loadingBar) are pre-configured
```

### Package Management
This project uses `pnpm` as the primary package manager. Always use `pnpm` commands when installing dependencies or managing the workspace.

## Architecture Overview

### Core Structure
The library follows a modular architecture with these main areas:

- **Form System**: Configuration-driven forms using `Options` pattern
- **Table System**: Enhanced DataTable with operation columns and utilities
- **Dialog System**: Integrated form dialogs with `commonDialogMethod`
- **Plugin System**: Vite plugins and Vue directives
- **Utility Functions**: Reusable helpers for common operations

### Key Architectural Patterns

#### Options Pattern
The library uses a centralized `Options` system for form field configuration:
- `src/options/defaultOptions.tsx` - Core option types (input, select, date, etc.)
- `src/options/Options.tsx` - Options component wrapper
- Options are extensible via `setupOptions()` function

#### Component Integration
- **DataForm** (`src/form/DataForm.vue`) - Renders forms from options configuration
- **DataTable** (`src/table/DataTable.vue`) - Enhanced table with operation columns
- **CommonQuery** (`src/query/CommonQuery.vue`) - Query form builder
- **commonDialogMethod** (`src/dialog/commonDialog.tsx`) - Integrated form dialogs

#### Plugin Architecture
- **Core Plugin** (`src/plugin/index.ts`) - Main Vue plugin for global installation
- **Vite Plugin** (`src/plugin/vite/initRouteMeta.ts`) - Route metadata initialization
- **Directives** (`src/directives/`) - Auto-registration and permission directives

### Build Configuration

The project uses Vite with a library build configuration:
- **Entry Points**: Main library (`src/index.ts`) and Vite plugin (`src/plugin/vite/initRouteMeta.ts`)
- **Output Formats**: ES modules (`.mjs`) and CommonJS (`.cjs`)
- **External Dependencies**: Vue, Naive UI, Vue Router, dayjs, lodash-es, @vicons/ionicons5
- **TypeScript**: Configured with JSX support for Vue components

### File Organization

```
src/
├── dialog/          # Dialog components and utilities
├── directives/      # Vue directives (permission, auto-register)
├── enum/           # Enumerations and constants
├── form/           # Form components
├── image/          # Image and upload components
├── options/        # Options system (core architecture)
├── plugin/         # Vue plugins and Vite plugins
├── query/          # Query components
├── store/          # Store utilities
├── table/          # Table components and utilities
└── utils/          # Utility functions
```

### TypeScript Migration Status

The project is actively migrating from JavaScript to TypeScript:
- Most `.js` files have been converted to `.ts`
- JSX components are being converted to `.tsx`
- Type definitions are in `types/` directory
- Some legacy `.js` files may still exist and should be converted when modified

### Key Dependencies

**Peer Dependencies** (must be installed by consumers):
- Vue 3.3+
- Naive UI 2.38+
- Vue Router 4.2+
- dayjs 1.11+
- lodash-es 4.17+
- @vicons/ionicons5 0.13+

**Development Dependencies**:
- Vite 5.4+ (build system)
- TypeScript 5.0+
- UnoCSS (utility-first CSS with presets for icons and attributify)
- VitePress (documentation)
- ESLint with @antfu/eslint-config
- unplugin-auto-import (automatic imports for Vue/Vue Router)

## Working with This Codebase

### When Adding New Components
1. Follow the existing Options pattern for form fields
2. Use TypeScript and JSX for new components
3. Export new components from `src/index.ts`
4. Add type definitions to `types/` directory

### When Modifying Options System
- Core option types are in `src/options/defaultOptions.tsx`
- Use `setupOptions()` to register new option types
- Follow the `OptionFunction` interface pattern
- Support both read and edit modes

### When Working with Dialogs
- Use `commonDialogMethod` for form dialogs
- Dialog utilities are in `src/dialog/utils/dialog.ts`
- Support both discrete API and component context usage

### When Adding Utilities
- Place in appropriate `src/utils/` file
- Export from `src/index.ts`
- Follow existing naming conventions
- Add TypeScript types

### Build System Notes
- The build creates both ES and CommonJS outputs
- Vite plugin has separate entry point for tree-shaking
- External dependencies are not bundled
- CSS is extracted to `dist/style.css`
- UnoCSS provides utility-first styling with icon and attributify presets
- Auto-import generates type definitions in `types/auto-imports.d.ts`

### CI/CD and Deployment
- GitHub Actions workflow deploys docs automatically on push to main/master
- Workflow builds core library, docs, and examples together
- Examples are deployed as part of the documentation site
- Uses pnpm for consistent package management in CI

### Documentation
- Documentation uses VitePress
- Located in `docs/` directory
- Examples are in `examples/` directory (separate Vite app)
- README.md contains usage examples and API overview
- Examples app demonstrates real usage and is deployed alongside docs

### Development Environment Setup
- Global variables `$dialog`, `$message`, `$loadingBar` are available via ESLint config
- Auto-imports are configured for Vue and Vue Router APIs
- UnoCSS scans `src/**/*.{vue,js,ts,jsx,tsx}` for utility classes
- Less preprocessor is available for component styling