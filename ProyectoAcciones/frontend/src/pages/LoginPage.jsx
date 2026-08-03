function LoginPage() {
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card border-0 shadow rounded-4">
            <div className="card-body p-4 p-lg-5">
              <h2 className="fw-bold mb-3">Iniciar sesión</h2>
              <p className="text-muted">Accede a tu panel de operaciones.</p>

              <form className="row g-3">
                <div className="col-12">
                  <label className="form-label">Correo electrónico</label>
                  <input type="email" className="form-control" placeholder="nombre@correo.com" />
                </div>
                <div className="col-12">
                  <label className="form-label">Contraseña</label>
                  <input type="password" className="form-control" placeholder="••••••••" />
                </div>
                <div className="col-12">
                  <button type="button" className="btn btn-success w-100">Entrar</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
