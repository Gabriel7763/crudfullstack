import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";

function Read() {
  const [data, setData] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/users/${id}`)
      .then((res) => {
        const users = Array.isArray(res.data) ? res.data : [res.data];
        setData(users);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  return (
    <div className="container-fluid vh-100 vw-100 bg-primary">
      <h1>Usuário {id}</h1>
      <Link to="/" className="btn btn-success">
        Voltar
      </Link>
      {Array.isArray(data) &&
        data.map((user) => {
          return (
            <ul key={user.id} className="list-group">
              <li className="list-group-item">
                <b>ID: </b>
                {user["id"]}
              </li>
              <li className="list-group-item">
                <b>Nome: </b>
                {user["name"]}
              </li>
              <li className="list-group-item">
                <b>Email: </b>
                {user["email"]}
              </li>
            </ul>
          );
        })}
    </div>
  );
}

export default Read;
