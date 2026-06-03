/**
 * Не используется Husky. Только вручную: npx lint-staged
 * @see docs/HUSKY.md
 */
export default {
  '*.{ts,tsx,js,jsx}': ['eslint --fix --max-warnings 0'],
  '*.{css,scss,less,styled.ts,styled.tsx}': ['stylelint --fix'],
};
