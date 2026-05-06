import "./globals.css";
import { getCms } from "@/lib/cms";
import { resolveAdminNav } from "@/lib/resolveAdminNav";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cms = getCms();
  const site = await cms.getSiteSettings();
  const adminNav = resolveAdminNav();

  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-neutral-900">
        <SiteHeader site={site} adminNav={adminNav} />
        <main className="pt-16">{children}</main>
        <SiteFooter site={site} />
      </body>
    </html>
  );
}