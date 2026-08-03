import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';

function AppLayout({ children }) {
  return (
    <div className="min-vh-100 d-flex flex-column bg-light">
      <Navbar />
      <div className="container-fluid flex-grow-1">
        <div className="row g-0">
          <Sidebar />
          <main className="col-12 col-lg-9 col-xl-10 px-3 px-md-4 py-4">{children}</main>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default AppLayout;
