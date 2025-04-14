import type { LinkMetadata } from "../types/link";

const renderMetadata = ({
    shortUrl,
    destinationUrl,
    metadata,
}: {
    shortUrl: string;
    destinationUrl: string;
    metadata?: LinkMetadata;
}) => {
  console.log(metadata, shortUrl);
  
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      ${
          metadata &&
          `<title>${metadata.title}</title>
        <meta name="description" content="${metadata.description}" />
        <meta property="og:title" content="${metadata.title}" />
        <meta property="og:description" content="${metadata.description}" />
        <meta property="og:image" content="${metadata.previewImg}" />`
      }
      <meta property="og:url" content="${shortUrl}" />
      <meta http-equiv="refresh" content="1;url=${destinationUrl}" />
      <script>window.location.href = "${destinationUrl}";</script>
    </head>
    <body>
      <p>Redirecting...</p>
    </body>
    </html>`;
};

export default renderMetadata;
