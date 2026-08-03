function RegisterPage() {
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-7 col-lg-6">
          <div className="card border-0 shadow rounded-4">
            <div className="card-body p-4 p-lg-5">
              <h2 className="fw-bold mb-3">Crear cuenta</h2>
              <p className="text-muted">Únete a StockMarket Pro para gestionar tus inversiones.</p>

              <form className="row g-3">
                <div className="col-12">
                  <label className="form-label">Nombre completo</label>
                  <input type="text" className="form-control" placeholder="Tu nombre" />
                </div>
                <div className="col-12">
                  <label className="form-label">Correo electrónico</label>
                  <input type="email" className="form-control" placeholder="nombre@correo.com" />
                </div>
                <div className="col-12">
                  <label className="form-label">Contraseña</label>
                  <input type="password" className="form-control" placeholder="Mínimo 6 caracteres" />
                </div>
                <div className="col-12">
                  <button type="button" className="btn btn-success w-100">Registrarme</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
