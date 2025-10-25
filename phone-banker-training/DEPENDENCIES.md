# Project Dependencies

This document lists all the dependencies for the Phone Banker Training Platform.

## 📦 Production Dependencies

### Core Framework
- **next** `^16.0.0` - React framework with server-side rendering and app router
- **react** `^19.x` - UI library
- **react-dom** `^19.x` - React DOM renderer

### External Services
- **@supabase/supabase-js** `^2.x` - Supabase client for database operations
- **@vapi-ai/web** `^2.x` - Vapi AI SDK for voice agent integration

### UI & Styling
- **tailwindcss** `^4.x` - Utility-first CSS framework
- **@tailwindcss/postcss** `^4.x` - PostCSS plugin for Tailwind
- **lucide-react** `^0.x` - Icon library
- **clsx** `^2.x` - Utility for constructing className strings
- **tailwind-merge** `^2.x` - Utility for merging Tailwind classes

### User Experience
- **lenis** `^1.x` - Smooth scrolling library

## 🛠️ Development Dependencies

- **typescript** `^5.x` - JavaScript with syntax for types
- **@types/node** `^20.x` - Type definitions for Node.js
- **@types/react** `^19.x` - Type definitions for React
- **@types/react-dom** `^19.x` - Type definitions for React DOM
- **eslint** `^9.x` - Linting utility
- **eslint-config-next** `^16.x` - ESLint configuration for Next.js

## 📥 Installation

### For New Team Members

```bash
# Clone the repository
git clone <repository-url>
cd phone-banker-training

# Install all dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys

# Run development server
npm run dev
```

### Adding New Dependencies

When adding a new dependency, please:

1. Install it properly:
   ```bash
   npm install <package-name>
   ```

2. Update this document with:
   - Package name
   - Version
   - Purpose/description
   - Category (production or development)

3. Update `README.md` if it's a major feature dependency

## 🔄 Keeping Dependencies Updated

### Check for updates
```bash
npm outdated
```

### Update all dependencies
```bash
npm update
```

### Update specific dependency
```bash
npm install <package-name>@latest
```

## 🚨 Important Notes

### Peer Dependencies
All peer dependencies are automatically handled by npm. If you see peer dependency warnings, they can usually be ignored unless there are breaking changes.

### Version Compatibility
- **Node.js**: 18+ required
- **npm**: 8+ recommended

### Platform-Specific Dependencies
This project uses cross-platform dependencies only. No platform-specific packages required.

## 📚 Key Dependencies Documentation

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [Vapi AI Docs](https://docs.vapi.ai)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Lenis Docs](https://github.com/studio-freight/lenis)
- [Lucide Icons](https://lucide.dev)

## 🔧 Troubleshooting

### Common Issues

**Issue: `npm install` fails**
```bash
# Clear npm cache and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

**Issue: Type errors with Vapi or Supabase**
```bash
# Reinstall type definitions
npm install --save-dev @types/node@latest
```

**Issue: Tailwind classes not working**
```bash
# Restart development server
# Ctrl+C to stop
npm run dev
```

## 📊 Dependency Tree Size

You can analyze the dependency tree with:
```bash
npm list --depth=0
```

For detailed analysis:
```bash
npm list --all
```

---

**Last Updated:** October 2025  
**Maintained By:** Development Team

