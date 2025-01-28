import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams, useNavigate } from "react-router-dom";

function Edit() {
  const [user, setUser] = useState({ name: "", email: "" });
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/users/${id}`)
      .then((res) => setUser(res.data))
      .catch((err) => console.log(err));
  }, [id]);

  function handleSubmit(e) {
    e.preventDefault();
    const { name, email } = user;

    if (!user.name || !user.email) {
      console.error("Erro: Dados de atualização ausentes");
      return;
    }

    axios
      .put(
        `http://localhost:3000/api/users/${id}`,
        { name, email },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        navigate("/");
        console.log("Resposta do servidor: ", res);
      })
      .catch((err) => {
        console.log("Erro na requisição: ", err.response?.data || err.message);
      });
  }

  return (
    <div className="container-fluid vh-100 vw-100 bg-primary">
      <h1>Usuário {id}</h1>
      <Link to="/" className="btn btn-success">
        Voltar
      </Link>
      <form onSubmit={handleSubmit}>
        <div className="form-group my-3">
          <label htmlFor="name">Nome</label>
          <input
            value={user.name}
            type="text"
            name="name"
            onChange={(e) => setUser({ ...user, name: e.target.value })}
          />
        </div>
        <div className="form-group my-3">
          <label htmlFor="email">Email</label>
          <input
            value={user.email}
            type="email"
            name="email"
            onChange={(e) => setUser({ ...user, email: e.target.value })}
          />
        </div>
        <div className="form-group my-3">
          <button type="submit" className="btn btn-success">
            Salvar
          </button>
        </div>
      </form>
    </div>
  );
}

export default Edit;
