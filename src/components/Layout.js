import Navbar from './Navbar';
import Sidebar from './Sidebar';
import '../styles/Layout.css';

/**
 * Layout Component
 * Main layout wrapper with navigation and sidebar
 */
const Layout = ({ children }) => {
  return (
    <div className="layout">
      <Navbar />
      <div className="layout-body">
        <Sidebar />
        <main className="layout-main">{children}</main>
      </div>
    </div>
  );
};

export default Layout;