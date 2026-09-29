// GOOD PATTERN: pure function, no side effects, easy to unit test.
// BUG (medium): assumes item.price and item.qty are always valid numbers.
// Malformed input (missing field, string value) silently produces NaN
// instead of a clear validation error.
function calculateTotals(items) {
  return items.reduce((total, item) => {
    return total + item.price * item.qty;
  }, 0);
}

function applyDiscount(total, discountPercent) {
  return total - (total * discountPercent) / 100;
}

module.exports = { calculateTotals, applyDiscount };
