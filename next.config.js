/** @type {import('next').NextConfig} */
const nextConfig = {
  // The curriculum APIs read the study-note files at runtime. Make sure the
  // docs folder is included in the serverless bundle on Netlify.
  outputFileTracingIncludes: {
    "/api/curriculum": ["./docs/**/*"],
    "/api/school/curriculum": ["./docs/**/*"],
    "/api/admin/notes-access": ["./docs/**/*"]
  },
  async headers() {
    return [
      {
        source: "/sw.js",
        headers: [{ key: "Cache-Control", value: "no-cache" }]
      },
      {
        source: "/manifest.webmanifest",
        headers: [{ key: "Content-Type", value: "application/manifest+json" }]
      }
    ];
  }
};
module.exports = nextConfig;
