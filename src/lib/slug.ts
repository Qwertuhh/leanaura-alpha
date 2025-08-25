/**
 * Slugify a string.
 *
 * @example
 * slugify("Some Example Title") // "some-example-title"
 * @example
 * slugify("   This  is   a   Test   ") // "this-is-a-test"
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default slugify;