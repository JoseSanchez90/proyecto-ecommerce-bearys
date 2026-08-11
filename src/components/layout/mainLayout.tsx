import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "./footer";
import Navbar from "./navbar";

function MainLayout() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname, search]);

  return (
    <div className="flex min-h-screen min-w-0 flex-col">
      <Navbar />
      <main className="min-w-0 flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default MainLayout;
