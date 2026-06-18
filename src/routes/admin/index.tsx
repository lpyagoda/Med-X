import { redirect } from "react-router";

export function loader() {
  return redirect("/admin/products");
}

export default function AdminIndexRoute() {
  return null;
}
