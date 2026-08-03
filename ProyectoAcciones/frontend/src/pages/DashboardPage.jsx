function DashboardPage() {
  return (
    <div className="row g-4">
      <div className="col-md-6 col-xl-3">
        <div className="card shadow-sm border-0 rounded-4 h-100">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center">
              <span className="text-muted">Balance</span>
              <i className="bi bi-wallet2 text-success fs-5"></i>
            </div>
            <h3 className="mt-3 mb-0">$14,250</h3>
          </div>
        </div>
      </div>
      <div className="col-md-6 col-xl-3">
        <div className="card shadow-sm border-0 rounded-4 h-100">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center">
              <span className="text-muted">Activos</span>
              <i className="bi bi-graph-up-arrow text-primary fs-5"></i>
            </div>
            <h3 className="mt-3 mb-0">12</h3>
          </div>
        </div>
      </div>
      <div className="col-md-6 col-xl-3">
        <div className="card shadow-sm border-0 rounded-4 h-100">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center">
              <span className="text-muted">Rentabilidad</span>
              <i className="bi bi-bar-chart-line-fill text-warning fs-5"></i>
            </div>
            <h3 className="mt-3 mb-0">+8.4%</h3>
          </div>
        </div>
      </div>
      <div className="col-md-6 col-xl-3">
        <div className="card shadow-sm border-0 rounded-4 h-100">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center">
              <span className="text-muted">Operaciones</span>
              <i className="bi bi-currency-exchange text-info fs-5"></i>
            </div>
            <h3 className="mt-3 mb-0">24</h3>
          </div>
        </div>
      </div>

      <div className="col-12">
        <div className="card shadow-sm border-0 rounded-4">
          <div className="card-body">
            <h4 className="mb-3">Resumen del mercado</h4>
            <div className="table-responsive">
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th>Empresa</th>
                    <th>Último precio</th>
                    <th>Cambio</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>AAPL</td>
                    <td>$214.75</td>
                    <td className="text-success">+2.31%</td>
                    <td><span className="badge text-bg-success">Al alza</span></td>
                  </tr>
                  <tr>
                    <td>MSFT</td>
                    <td>$428.60</td>
                    <td className="text-success">+1.10%</td>
                    <td><span className="badge text-bg-success">Al alza</span></td>
                  </tr>
                  <tr>
                    <td>NVDA</td>
                    <td>$124.40</td>
                    <td className="text-danger">-0.92%</td>
                    <td><span className="badge text-bg-danger">Bajo presión</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
