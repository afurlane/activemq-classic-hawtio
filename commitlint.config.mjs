export default {
  extends: ["@commitlint/config-conventional"],
  ignores: [(message) => message.includes("dependabot[bot]")]
}
