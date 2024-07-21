import { Nav, NavLink } from "@/components/Nav";

export const dynamic = 'force-dynamic';
// not cache any data

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <>
      <Nav>
        <NavLink href="/admin">dashboard</NavLink>
        <NavLink href="/admin/products">Products</NavLink>
        <NavLink href="/admin/users">Users</NavLink>
        <NavLink href="/admin/orders">Sales</NavLink>
      </Nav>
      {children}
    </>
  );
};

export default AdminLayout;
