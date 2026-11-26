/**
 * Counter demo - can be removed or kept for testing
 */
export function setupCounter(element) {
  let count = 0;
  const add = () => count += 1;
  const reset = () => count = 0;
  
  element.innerHTML = `count: ${count}`;
  
  return { add, reset, element };
}