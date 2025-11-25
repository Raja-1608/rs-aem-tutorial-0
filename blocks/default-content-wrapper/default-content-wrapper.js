/**
 * Default Content Wrapper Block
 * This block currently does nothing — it only exists to satisfy AEM runtime loading.
 * This prevents "failed to load module" errors.
 */

export default function decorate(block) {
  // Use the parameter so ESLint doesn't complain, but do nothing else.
  if (!block) return;
}