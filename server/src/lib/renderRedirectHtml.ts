import type { LinkMetadata, LinkStatus } from "../types/link";

const renderMetadata = ({
    shortUrl,
    destinationUrl,
    metadata,
    status,
}: {
    shortUrl: string;
    destinationUrl: string;
    metadata?: LinkMetadata;
    status?: LinkStatus;
}) => {
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
      ${
          destinationUrl &&
          `<meta http-equiv="refresh" content="1;url=${destinationUrl}" />
        <script>window.location.href = "${destinationUrl}";</script>`
      }
    </head>
    <body>
      <p>${destinationUrl ? "Redirecting..." : "Ahoy! Something went wrong"}</p>
    </body>
    </html>`;
};

export default renderMetadata;
