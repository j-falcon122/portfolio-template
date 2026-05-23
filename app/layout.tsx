import "./globals.css";
import { getCms } from "@/lib/cms";
import { resolveAdminNav } from "@/lib/resolveAdminNav";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SinglePageHashScroll from "@/components/SinglePageHashScroll";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cms = getCms();
  const site = await cms.getSiteSettings();
  const adminNav = resolveAdminNav();

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className="min-h-screen bg-white text-neutral-900"
        suppressHydrationWarning
      >
        <SiteHeader site={site} adminNav={adminNav} />
        <SinglePageHashScroll />
        <main>{children}</main>
        <SiteFooter site={site} />
      </body>
    </html>
  );
}
