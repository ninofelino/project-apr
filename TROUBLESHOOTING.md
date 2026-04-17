# Troubleshooting Guide - Middleware Project

## Issue: Development Server Not Starting

### Symptoms
- Running `npm run dev` does not start the server
- No error message displayed initially
- Server appears to start but is not accessible

### Root Cause
The `node_modules` directory was corrupted or incomplete. Specifically:
- The `next` binary was missing from `node_modules/.bin/`
- Package installation was incomplete or corrupted
- File system conflicts (e.g., `caniuse-lite` directory rename failures)

### Diagnosis Steps

1. **Check if dependencies are installed:**
   ```bash
   ls -la node_modules/.bin/ | grep next
   ```
   If no output, Next.js is not properly installed.

2. **Verify next binary:**
   ```bash
   node_modules/.bin/next --version
   ```
   If it returns "No such file or directory", installation is incomplete.

3. **Check dev logs:**
   ```bash
   cat dev.log
   ```

### Solution

#### Option 1: Clean Reinstall (Recommended)
```bash
# Remove corrupted node_modules and lock file
rm -rf node_modules package-lock.json

# Clean npm cache (optional)
npm cache clean --force

# Reinstall dependencies
npm install

# Start development server
npm run dev
```

#### Option 2: Force Reinstall
```bash
npm install --force
```

#### Option 3: Use Alternative Registry (if network is slow)
```bash
rm -rf node_modules package-lock.json
npm install --registry https://registry.npmmirror.com
npm run dev
```

### Prevention

1. **Always run `npm install` after cloning or pulling changes:**
   ```bash
   git clone <repo-url>
   cd <project-directory>
   npm install
   ```

2. **Use `.npmrc` for faster installs** (optional):
   ```
   registry=https://registry.npmjs.org/
   ```

3. **Consider using pnpm or yarn** for better performance and reliability:
   ```bash
   # Install pnpm
   npm install -g pnpm
   
   # Use pnpm instead of npm
   pnpm install
   pnpm dev
   ```

### Common Port Issues

If port 3000 is already in use:
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 npm run dev
```

### Environment Setup Checklist

- [ ] Node.js installed (v18+ recommended)
- [ ] npm/pnpm/yarn installed
- [ ] `.env.local` file exists with required variables
- [ ] `node_modules` directory exists and is complete
- [ ] No processes blocking port 3000

### Quick Start Commands

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Build for production
npm run build

# 4. Start production server
npm start
```

### Need Help?

If the issue persists:
1. Check `dev.log` for error messages
2. Verify `.env.local` has correct database URLs
3. Check Node.js version: `node --version`
4. Clear npm cache: `npm cache clean --force`
5. Delete and reinstall node_modules
