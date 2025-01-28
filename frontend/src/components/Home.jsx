import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Home() {
  const [data, setData] = useState([]);
  const [deleted, setDeleted] = useState(true);
  useEffect(() => {
    if (deleted) {
      setDeleted(false);
    }
    axios
      .get("http://localhost:3000/api/users")
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [deleted]);

  function handleDelete(id) {
    axios
      .delete(`http://localhost:3000/api/users/${id}`)
      .then((res) => {
        setDeleted(true);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  return (
    <div className="container-fluid vh-100 vw-100 bg-primary">
      <h3>Usuários</h3>
      <div className="d-flex justify-content-end">
        <Link className="btn btn-success" to="/create">
          Adicionar Usuário
        </Link>
      </div>
      <table className="bg-white">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {data.map((user) => {
            return (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <Link
                    className="btn mx-2 btn-success"
                    to={`/read/${user.id}`}
                  >
                    Detalhes
                  </Link>
                  <Link
                    className="btn mx-2 btn-success"
                    to={`/edit/${user.id}`}
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="btn mx-2 btn-danger"
                  >
                    Deletar
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Home;
