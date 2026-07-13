const STRAPI_BASE_URL = (
  process.env.NEXT_PUBLIC_STRAPI_URL || "https://amescaobackend.onrender.com"
).replace(/\/$/, "");
function getMediaUrl(media) {
  if (!media || !media.url) return "";
  const url = media.url;
  if (url.startsWith("http") || url.startsWith("//")) return url;
  const path = url.startsWith("/") ? url : `/${url}`;
  return `${STRAPI_BASE_URL}${path}`;
}

const samples = [
  {
    desc: "absolute http",
    media: { url: "https://cdn.example.com/uploads/photo.png" },
  },
  {
    desc: "protocol-relative",
    media: { url: "//cdn.example.com/uploads/photo.png" },
  },
  { desc: "relative with leading slash", media: { url: "/uploads/photo.png" } },
  { desc: "relative without slash", media: { url: "uploads/photo.png" } },
  { desc: "empty", media: {} },
];

samples.forEach((s) => {
  console.log(`${s.desc} -> ${getMediaUrl(s.media)}`);
});
