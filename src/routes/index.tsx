import { lazy } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import MainLayout from "@/components/layout/mainLayout";
import ProtectedRoute from "@/components/auth/protectedRoute";
import { CartProvider } from "@/contexts/cart-context";
import { AuthProvider } from "@/contexts/auth-context";

const Home = lazy(() => import("@/components/pages/home"));
const Productos = lazy(() => import("@/components/pages/productos"));
const DetalleProducto = lazy(() => import("@/components/pages/detalle-producto"));
const Promociones = lazy(() => import("@/components/pages/promociones"));
const Acerca = lazy(() => import("@/components/pages/acerca"));
const Contacto = lazy(() => import("@/components/pages/contacto"));
const Perfil = lazy(() => import("@/components/pages/perfil"));
const AdminRoute = lazy(() => import("@/components/admin/admin-route"));

const routes = createBrowserRouter([
  {
    path: "/admin",
    element: (
      <AuthProvider>
        <AdminRoute />
      </AuthProvider>
    ),
  },
  {
    path: "/",
    element: (
      <AuthProvider>
        <CartProvider>
          <MainLayout />
        </CartProvider>
      </AuthProvider>
    ),
    children: [
      { path: "/", element: <Home /> },
      { path: "/productos", element: <Productos /> },
      { path: "/producto/:slug", element: <DetalleProducto /> },
      { path: "/productos/:slug", element: <DetalleProducto /> },
      { path: "/promociones", element: <Promociones /> },
      { path: "/acerca", element: <Acerca /> },
      { path: "/contacto", element: <Contacto /> },
      {
        path: "/perfil",
        element: (
          <ProtectedRoute>
            <Perfil />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

export function AppRoutes() {
  return <RouterProvider router={routes} />;
}
