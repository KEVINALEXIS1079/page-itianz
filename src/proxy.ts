export { default as proxy } from "next-auth/middleware";

export const config = {
  matcher: ["/portal-secreto-itianz", "/portal-secreto-itianz/productos", "/portal-secreto-itianz/proyectos"]
};
