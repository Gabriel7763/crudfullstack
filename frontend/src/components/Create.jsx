import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Create() {
  const [values, setValues] = useState({
    name: "",
    email: "",
  });

  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();

    axios
      .post("http://localhost:3000/api/users", values)
      .then((res) => {
        navigate("/");
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <div className="container vh-100 vw-100 bg-primary">
      <div className="row">
        <h3>Adicionar Usuário</h3>
        <div className="d-flex justify-content-end">
          <Link to="/" className="btn btn-success">
            Home
          </Link>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group my-3">
            <label htmlFor="name">Nome</label>
            <input
              type="text"
              name="name"
              onChange={(e) => setValues({ ...values, name: e.target.value })}
            />
          </div>
          <div className="form-group my-3">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              onChange={(e) => setValues({ ...values, email: e.target.value })}
            />
          </div>
          <div className="form-group my-3">
            <button type="submit" className="btn btn-success">
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Create;
