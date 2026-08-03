function HomePage() {
  return (
    <div className="container py-4">
      <section className="row align-items-center g-4 rounded-4 bg-gradient text-dark p-4 p-lg-5 shadow-sm">
        <div className="col-lg-7">
          <span className="badge bg-success-subtle text-success-emphasis mb-3">Nueva plataforma</span>
          <h1 className="display-5 fw-bold">Tu centro profesional para seguir el mercado.</h1>
          <p className="lead text-secondary">
            StockMarket Pro centraliza análisis, cotizaciones y gestión de inversiones en una sola experiencia moderna.
          </p>
          <div className="d-flex gap-2 flex-wrap">
            <a className="btn btn-success" href="/register">Crear cuenta</a>
            <a className="btn btn-outline-dark" href="/login">Ingresar</a>
          </div>
        </div>
        <div className="col-lg-5">
          <div className="card border-0 shadow-lg rounded-4">
            <div className="card-body p-4">
              <div className="row g-3 text-center">
                <div className="col-6">
                  <div className="bg-body-tertiary rounded-3 p-3">
                    <div className="text-success fw-bold fs-4">+18%</div>
                    <div className="small text-muted">Rendimiento</div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="bg-body-tertiary rounded-3 p-3">
                    <div className="text-primary fw-bold fs-4">$2.8M</div>
                    <div className="small text-muted">Volúmen</div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="bg-dark text-white rounded-3 p-3">
                    <div className="small text-secondary">Mercado actual</div>
                    <div className="fw-bold">AAPL · MSFT · NVDA · TSLA</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="row mt-4 g-3">
        <div className="col-md-4">
          <div className="card h-100 shadow-sm border-0 rounded-4">
            <div className="card-body">
              <h5>Monitoreo</h5>
              <p className="text-muted">Seguimiento visual de empresas con información esencial del mercado.</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100 shadow-sm border-0 rounded-4">
            <div className="card-body">
              <h5>Autenticación</h5>
              <p className="text-muted">Control de acceso con perfiles seguros y rutas protegidas.</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100 shadow-sm border-0 rounded-4">
            <div className="card-body">
              <h5>Historial</h5>
              <p className="text-muted">Consulta de operaciones y evolución del rendimiento personal.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
