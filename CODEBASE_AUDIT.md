# Codebase Audit & Refactor Plan

## Executive Summary

This audit evaluates the codebase against industry best practices. The codebase shows good architectural patterns (feature-based structure, separation of concerns) but needs improvements in type safety, error handling, testing, and code quality.

**Overall Grade: B- (75/100)**

### Strengths ✅
- Feature-based architecture
- Separation of logic/UI/results
- Reusable shared components
- Good use of React hooks
- SEO optimization
- Semantic HTML

### Critical Issues ⚠️
- No TypeScript (despite tsconfig.json)
- No testing infrastructure
- Console.log statements in production
- Missing error boundaries
- No input validation
- Magic numbers scattered throughout

---

## Detailed Findings

### 1. Type Safety (Critical) 🔴

**Current State:**
- All files are `.jsx`/`.js` despite having `tsconfig.json`
- No PropTypes or TypeScript interfaces
- No type checking at compile time

**Issues:**
```javascript
// Example from index.jsx - no type safety
export default function Calculator({ 
    isVisible = true,
    initialRetirementAge = 65,
    // ... no type definitions
}) {
```

**Impact:** Runtime errors, poor IDE support, difficult refactoring

**Recommendation:** Migrate to TypeScript incrementally

---

### 2. Testing Infrastructure (Critical) 🔴

**Current State:**
- No test files found
- No testing framework configured
- No CI/CD test pipeline

**Impact:** No confidence in refactoring, regression risks

**Recommendation:** Add Jest + React Testing Library

---

### 3. Error Handling (High Priority) 🟡

**Current State:**
- Console.error statements but no user-facing error handling
- No React Error Boundaries
- No try-catch blocks in critical paths
- No error states in UI

**Examples:**
```javascript
// src/features/grocery/components/GroceryInflation.jsx:22
console.log("Available Grocery IDs:", STAPLES.map(...));

// src/components/AICopilot.jsx:58
console.error("Failed to parse tool arguments:", ...);
```

**Impact:** Poor user experience, silent failures

**Recommendation:** Add Error Boundaries, error states, proper logging

---

### 4. Code Quality Issues (Medium Priority) 🟡

#### 4.1 Magic Numbers
```javascript
// src/features/retirement/components/index.jsx:48
const TAX_RATE = 0.15; // Should be in constants file

// src/features/retirement/components/index.jsx:194
style={{ paddingBottom: activeTab === 'input' ? '100px' : '60px' }}
```

#### 4.2 Large Components
- `src/features/retirement/components/index.jsx`: 264 lines
- `src/features/parental-leave/components/ParentalLeave.jsx`: 265 lines
- Should be broken down further

#### 4.3 Prop Drilling
- Many props passed through multiple levels
- Consider Context API for shared state

#### 4.4 Inconsistent Patterns
- Mix of default exports and named exports
- Inconsistent naming conventions

---

### 5. Performance (Medium Priority) 🟡

**Current State:**
- Good use of `useMemo` and `useCallback`
- Components use `React.memo` where appropriate
- No code splitting
- All components loaded upfront

**Recommendation:** Add lazy loading for routes

---

### 6. Accessibility (Medium Priority) 🟡

**Current State:**
- Some ARIA labels present
- Missing in many interactive elements
- No keyboard navigation testing
- No focus management

**Examples:**
```jsx
// Missing aria-label
<button onClick={() => setActiveTab('input')} className={...}>
    1. Earnings & Inputs
</button>
```

**Recommendation:** Add comprehensive ARIA attributes

---

### 7. Input Validation (Medium Priority) 🟡

**Current State:**
- Basic validation in `MoneyInput` component
- No validation for date inputs
- No validation for number ranges
- No error messages for invalid inputs

**Recommendation:** Add comprehensive validation with error messages

---

### 8. Loading States (Low Priority) 🟢

**Current State:**
- No loading indicators
- No skeleton screens
- Calculations appear instant (may not always be)

**Recommendation:** Add loading states for async operations

---

## Refactor Plan

### Phase 1: Foundation (Week 1-2)

#### 1.1 Add TypeScript Support
- [ ] Create `tsconfig.json` configuration
- [ ] Migrate shared components to `.tsx`
- [ ] Add type definitions for props
- [ ] Migrate utility functions to `.ts`
- [ ] Add strict type checking

**Files to migrate:**
- `src/components/shared/*.jsx` → `.tsx`
- `src/features/*/utils/*.js` → `.ts`
- `src/hooks/*.js` → `.ts`

#### 1.2 Set Up Testing Infrastructure
- [ ] Install Jest + React Testing Library
- [ ] Configure test scripts in `package.json`
- [ ] Create test utilities
- [ ] Add test coverage reporting

**Target Coverage:** 60% initially, 80% long-term

#### 1.3 Error Handling
- [ ] Create `ErrorBoundary` component
- [ ] Add error logging service
- [ ] Replace `console.log/error` with proper logging
- [ ] Add error states to all components

**New Files:**
- `src/components/shared/ErrorBoundary.tsx`
- `src/utils/logger.ts`
- `src/utils/errorHandler.ts`

---

### Phase 2: Code Quality (Week 3-4)

#### 2.1 Extract Constants
- [ ] Create `src/constants/index.ts`
- [ ] Move all magic numbers to constants
- [ ] Create theme constants (colors, spacing)
- [ ] Create calculation constants

**New File:**
```typescript
// src/constants/index.ts
export const TAX_RATES = {
  DEFAULT: 0.15,
  HIGH_INCOME: 0.33,
} as const;

export const UI_CONSTANTS = {
  PADDING: {
    INPUT_TAB: '100px',
    RESULTS_TAB: '60px',
  },
} as const;
```

#### 2.2 Break Down Large Components
- [ ] Split `index.jsx` (retirement) into smaller components
- [ ] Extract custom hooks from large components
- [ ] Create compound components where appropriate

**Example:**
```typescript
// Before: 264 lines in index.jsx
// After:
// - Calculator.tsx (main orchestrator)
// - CalculatorTabs.tsx
// - CalculatorState.tsx (custom hook)
// - CalculatorEffects.tsx (custom hook)
```

#### 2.3 Add Context API
- [ ] Create `CalculatorContext` for shared state
- [ ] Reduce prop drilling
- [ ] Improve component composition

---

### Phase 3: User Experience (Week 5-6)

#### 3.1 Input Validation
- [ ] Create `useValidation` hook
- [ ] Add validation rules for all inputs
- [ ] Add error messages
- [ ] Add visual feedback

**New Files:**
- `src/hooks/useValidation.ts`
- `src/utils/validationRules.ts`
- `src/components/shared/ErrorMessage.tsx`

#### 3.2 Loading States
- [ ] Add `LoadingSpinner` component
- [ ] Add skeleton screens
- [ ] Add loading states to async operations

**New Files:**
- `src/components/shared/LoadingSpinner.tsx`
- `src/components/shared/Skeleton.tsx`

#### 3.3 Accessibility
- [ ] Audit all interactive elements
- [ ] Add ARIA labels
- [ ] Add keyboard navigation
- [ ] Add focus management
- [ ] Test with screen readers

---

### Phase 4: Performance (Week 7-8)

#### 4.1 Code Splitting
- [ ] Add lazy loading for routes
- [ ] Split large bundles
- [ ] Add route-based code splitting

**Example:**
```typescript
const RetirementCalculator = lazy(() => 
  import('../features/retirement/components/index')
);
```

#### 4.2 Optimize Re-renders
- [ ] Audit `useMemo` and `useCallback` usage
- [ ] Add `React.memo` where needed
- [ ] Optimize expensive calculations

---

### Phase 5: Developer Experience (Week 9-10)

#### 5.1 Documentation
- [ ] Add JSDoc comments to all functions
- [ ] Create component documentation
- [ ] Add README for each feature
- [ ] Document architecture decisions

#### 5.2 Code Standards
- [ ] Add ESLint configuration
- [ ] Add Prettier configuration
- [ ] Add pre-commit hooks
- [ ] Create coding standards document

**New Files:**
- `.eslintrc.js`
- `.prettierrc`
- `CONTRIBUTING.md`

---

## Implementation Priority

### Must Have (P0)
1. ✅ TypeScript migration
2. ✅ Testing infrastructure
3. ✅ Error boundaries
4. ✅ Remove console.log statements

### Should Have (P1)
5. ✅ Input validation
6. ✅ Extract constants
7. ✅ Break down large components
8. ✅ Accessibility improvements

### Nice to Have (P2)
9. ✅ Loading states
10. ✅ Code splitting
11. ✅ Performance optimizations
12. ✅ Documentation

---

## New File Structure

```
src/
├── components/
│   ├── shared/
│   │   ├── ErrorBoundary.tsx        # NEW
│   │   ├── LoadingSpinner.tsx        # NEW
│   │   ├── Skeleton.tsx              # NEW
│   │   ├── ErrorMessage.tsx          # NEW
│   │   └── ...
│   └── ...
├── hooks/
│   ├── useValidation.ts              # NEW
│   ├── useErrorHandler.ts            # NEW
│   └── ...
├── utils/
│   ├── logger.ts                     # NEW
│   ├── errorHandler.ts               # NEW
│   ├── validationRules.ts            # NEW
│   └── ...
├── constants/
│   ├── index.ts                      # NEW
│   ├── taxRates.ts                   # NEW
│   ├── uiConstants.ts                # NEW
│   └── ...
├── types/
│   ├── index.ts                      # NEW
│   ├── calculator.ts                 # NEW
│   └── ...
└── __tests__/                        # NEW
    ├── setup.ts
    └── utils/
```

---

## Metrics & Success Criteria

### Code Quality
- [ ] TypeScript coverage: 100%
- [ ] Test coverage: >80%
- [ ] ESLint errors: 0
- [ ] No console.log in production

### Performance
- [ ] First Contentful Paint: <1.5s
- [ ] Time to Interactive: <3s
- [ ] Bundle size: <500KB (gzipped)

### Accessibility
- [ ] WCAG 2.1 AA compliance
- [ ] Keyboard navigation: 100%
- [ ] Screen reader compatibility

---

## Risk Assessment

### Low Risk
- Adding TypeScript (incremental migration)
- Adding tests (non-breaking)
- Extracting constants (refactoring)

### Medium Risk
- Breaking down large components (requires testing)
- Adding Context API (state management changes)

### High Risk
- None identified (all changes are additive/refactoring)

---

## Timeline Estimate

**Total Duration:** 10 weeks (2.5 months)

- Phase 1: 2 weeks
- Phase 2: 2 weeks
- Phase 3: 2 weeks
- Phase 4: 2 weeks
- Phase 5: 2 weeks

**Note:** Phases can be done in parallel where possible.

---

## Next Steps

1. Review and approve this plan
2. Set up project board with tasks
3. Begin Phase 1 implementation
4. Weekly progress reviews
5. Continuous integration of changes

---

## Questions & Considerations

1. **TypeScript Migration Strategy:**
   - Incremental (file by file) or Big Bang?
   - Recommendation: Incremental with `allowJs: true`

2. **Testing Strategy:**
   - Unit tests, integration tests, or E2E?
   - Recommendation: Start with unit tests, add integration later

3. **Error Handling:**
   - Use error tracking service (Sentry)?
   - Recommendation: Yes, for production

4. **Performance Budget:**
   - What are acceptable bundle sizes?
   - Recommendation: <500KB initial, <1MB total

---

*Last Updated: 2025-01-XX*
*Audit Performed By: AI Code Review*

