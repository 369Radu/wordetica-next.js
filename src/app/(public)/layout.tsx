import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ScrollToTop } from "@/components/shared/ScrollToTop";
import "@/components/layout/public-shell.scss";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main id="main" className="site-main" tabIndex={-1} role="main">
        {children}
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
