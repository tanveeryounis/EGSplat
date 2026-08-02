import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ??
    requestHeaders.get("host") ??
    "localhost:3000";
  const protocol =
    requestHeaders.get("x-forwarded-proto") ??
    (host.startsWith("localhost") ? "http" : "https");
  const socialImage = `${protocol}://${host}/og.png`;

  return {
    title: {
      default:
        "Evidence-Gated Stabilization for Sparse-View 3D Gaussian Splatting",
      template: "%s | Evidence-Gated Stabilization",
    },
    description:
      "Academic project page for Evidence-Gated Stabilization for Sparse-View 3D Gaussian Splatting.",
    openGraph: {
      type: "website",
      title:
        "Evidence-Gated Stabilization for Sparse-View 3D Gaussian Splatting",
      description:
        "Academic project page for Evidence-Gated Stabilization for Sparse-View 3D Gaussian Splatting.",
      images: [{ url: socialImage }],
    },
    twitter: {
      card: "summary_large_image",
      title:
        "Evidence-Gated Stabilization for Sparse-View 3D Gaussian Splatting",
      description:
        "Academic project page for Evidence-Gated Stabilization for Sparse-View 3D Gaussian Splatting.",
      images: [socialImage],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
