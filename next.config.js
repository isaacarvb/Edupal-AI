/** @type {import('next').NextConfig} */
const nextConfig = {
  // The curriculum APIs read the study-note files at runtime. Make sure the
  // supported note formats are included in the serverless bundle on Netlify.
  // Only include formats the loader can read: the original RTF-based ".doc"
  // files are huge (344 MB) and would push the function over Netlify's 250 MB
  // limit, so they are deliberately excluded.
  outputFileTracingIncludes: {
    "/api/curriculum": ["./docs/**/*.md", "./docs/**/*.markdown", "./docs/**/*.txt", "./docs/**/*.docx"],
    "/api/school/curriculum": ["./docs/**/*.md", "./docs/**/*.markdown", "./docs/**/*.txt", "./docs/**/*.docx"],
    "/api/admin/notes-access": ["./docs/**/*.md", "./docs/**/*.markdown", "./docs/**/*.txt", "./docs/**/*.docx"]
  },
  // The tracer walks the whole docs folder because the loader reads it at
  // runtime, which pulls in the huge RTF-based ".doc" originals. Exclude them
  // for every route so the Netlify function stays under the 250 MB limit.
  outputFileTracingExcludes: {
    "*": ["./docs/**/*.doc"]
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
