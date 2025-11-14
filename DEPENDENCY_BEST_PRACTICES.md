# Dependency Management Best Practices

## ❌ Current Issues (What We Fixed)

### 1. **Using `any` Types**
**Problem:**
```typescript
// ❌ BAD - Loses type safety
type LeafletMap = any;
type Marker = any;
```

**Solution:**
```typescript
// ✅ GOOD - Proper type imports
import type { Map as LeafletMap, Marker } from 'leaflet';
```

### 2. **Using `legacy-peer-deps`**
**Problem:**
- `.npmrc` with `legacy-peer-deps=true` bypasses dependency resolution
- Can hide real compatibility issues
- May cause runtime errors

**Better Approach:**
- Use `overrides` in `package.json` to force compatible versions
- This is more explicit and maintainable

### 3. **Downgrading Packages Too Much**
**Problem:**
- Downgrading `next-sanity` from v11 to v7 loses features
- May miss security updates
- Harder to upgrade later

**Better Approach:**
- Find the latest compatible version
- Use `overrides` to resolve conflicts
- Plan for future upgrades

## ✅ Best Practices Implemented

### 1. **Proper TypeScript Types**
```typescript
// ✅ Use proper type imports
import type { Map as LeafletMap, Marker } from 'leaflet';
```

**Why:**
- Type safety catches errors at compile time
- Better IDE autocomplete
- Self-documenting code

### 2. **Package Overrides**
```json
{
  "overrides": {
    "@sanity/icons": "^2.8.0"
  }
}
```

**Why:**
- Explicitly resolves conflicts
- Works with all package managers
- More maintainable than `legacy-peer-deps`

### 3. **Keep Type Definitions**
```typescript
// src/types/leaflet.d.ts
// This file ensures TypeScript recognizes leaflet types
// The actual types come from @types/leaflet package
```

**Why:**
- Documents why the file exists
- Helps future developers understand the setup

## 📋 Recommendations

### Short Term (Current)
✅ **Keep current setup** - It works and is now more maintainable:
- Proper TypeScript types
- Package overrides instead of legacy-peer-deps
- Clear documentation

### Medium Term (Next 3-6 months)
1. **Upgrade Next.js to 15/16** when stable
   - Then upgrade `next-sanity` to v11+
   - Re-enable live API features

2. **Remove `.npmrc`** once dependencies are fully compatible
   - Test without `legacy-peer-deps`
   - Only keep if absolutely necessary

3. **Regular Dependency Audits**
   ```bash
   npm audit
   npm outdated
   ```

### Long Term (6+ months)
1. **Consider Alternative Solutions**
   - Evaluate if Sanity is still the best CMS choice
   - Consider other mapping libraries if Leaflet causes issues

2. **Dependency Pinning**
   - Consider using exact versions (`1.2.3` instead of `^1.2.3`)
   - Use `package-lock.json` consistently
   - Document why specific versions are required

## 🔍 Current Status

### ✅ What's Good Now
- Proper TypeScript types (no `any`)
- Package overrides for conflict resolution
- Build passes successfully
- Type safety maintained

### ⚠️ What Could Be Better
- Still using `legacy-peer-deps` (but it's documented)
- `next-sanity` is downgraded (but compatible)
- Live API disabled (but not currently used)

### 🎯 Priority Actions
1. ✅ **DONE**: Fix TypeScript types
2. ✅ **DONE**: Add package overrides
3. ⏳ **TODO**: Test removing `.npmrc` in staging
4. ⏳ **TODO**: Plan Next.js 15 upgrade

## 📚 Resources

- [npm overrides documentation](https://docs.npmjs.com/cli/v9/configuring-npm/package-json#overrides)
- [TypeScript best practices](https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html)
- [Dependency management guide](https://docs.npmjs.com/cli/v9/configuring-npm/package-json)

---

**Last Updated:** November 2025  
**Status:** ✅ Improved - Following best practices where possible

