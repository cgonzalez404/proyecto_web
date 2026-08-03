import { Link } from 'react-router-dom';

const items = [
  { label: 'Dashboard', icon: 'bi-speedometer2', path: '/dashboard' },
  { label: 'Mis inversiones', icon: 'bi-pie-chart-fill', path: '/dashboard' },
  { label: 'Historial', icon: 'bi-clock-history', path: '/dashboard' },
  { label: 'Ajustes', icon: 'bi-gear-fill', path: '/dashboard' },
];

function Sidebar() {
  return (
    <aside className="col-lg-3 col-xl-2 d-none d-lg-block bg-body-tertiary border-end min-vh-100 px-3 py-4">
      <div className="d-flex flex-column gap-2">
        <div className="px-2 mb-3">
          <h5 className="fw-semibold mb-0">Panel</h5>
          <small className="text-muted">Operaciones</small>
        </div>

        {items.map((item) => (
          <Link
            key={item.label}
            to={item.path}
            className="d-flex align-items-center gap-2 text-decoration-none text-dark px-3 py-2 rounded-3 hover-bg"
          >
            <i className={`bi ${item.icon}`}></i>
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </aside>
  );
}

export default Sidebar;
