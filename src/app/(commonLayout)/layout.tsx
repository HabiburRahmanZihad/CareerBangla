import AIChatbot from "@/components/shared/AIChatbot";
import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";
import { getUserInfo } from "@/services/auth.services";

export default async function CommonLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUserInfo();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar user={user} />
      <main className="flex-1">{children}</main>
      <Footer />
      <AIChatbot />
    </div>
  );
}
