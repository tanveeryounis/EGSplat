import type { Metadata } from "next";
import "./globals.css";

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/$/, "");
const socialImage = `${siteUrl}/og.png`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default:
      "EGSplat: Multiview Evidence-Guided Optimization for Sparse-View 3D Gaussian Splatting",
    template: "%s | EGSplat",
  },
  description:
    "Academic project page for EGSplat: Multiview Evidence-Guided Optimization for Sparse-View 3D Gaussian Splatting.",
  openGraph: {
    type: "website",
    url: siteUrl,
    title:
      "EGSplat: Multiview Evidence-Guided Optimization for Sparse-View 3D Gaussian Splatting",
    description:
      "Academic project page for EGSplat: Multiview Evidence-Guided Optimization for Sparse-View 3D Gaussian Splatting.",
    images: [{ url: socialImage }],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "EGSplat: Multiview Evidence-Guided Optimization for Sparse-View 3D Gaussian Splatting",
    description:
      "Academic project page for EGSplat: Multiview Evidence-Guided Optimization for Sparse-View 3D Gaussian Splatting.",
    images: [socialImage],
  },
};

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
