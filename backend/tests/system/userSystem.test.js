const request = require("supertest");
const app = require("../../src/app");
const { sequelize, User } = require("../../src/models");

beforeAll(async () => {
  await sequelize.sync({ force: true }); // Sincronizar os modelos com o banco de dados
});

afterAll(async () => {
  await sequelize.close(); // Fechar a conexão com o banco de dados
});

describe("Testes de Sistema de API de Usuário", () => {
  let userId;

  test("POST /users - Deve criar um novo usuário com sucesso", async () => {
    const response = await request(app)
      .post("/api/users")
      .send({ name: "John Doe", email: "john.doe@example.com" });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.name).toBe("John Doe");
    expect(response.body.email).toBe("john.doe@example.com");

    userId = response.body.id; // Armazena o ID para os próximos testes
  });

  test("GET /users - Deve retornar uma lista de usuários", async () => {
    const user = await User.create({
      name: "Alice",
      email: "alice@example.com",
    });
    const response = await request(app).get("/api/users");

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0]).toHaveProperty("id", userId);
  });

  test("GET /users/:id - Deve retornar um usuário por ID", async () => {
    const response = await request(app).get(`/api/users/${userId}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id", userId);
  });

  test("PUT /users/:id - Deve atualizar um usuário", async () => {
    const response = await request(app)
      .put(`/api/users/${userId}`)
      .send({ name: "Jane Doe", email: "jane.doe@example.com" });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("Jane Doe");
    expect(response.body.email).toBe("jane.doe@example.com");
  });

  test("DELETE /users/:id - Deve excluir um usuário", async () => {
    const response = await request(app).delete(`/api/users/${userId}`);

    expect(response.status).toBe(204);

    // Verifica se o usuário foi realmente deletado
    const getResponse = await request(app).get(`/api/users/${userId}`);
    expect(getResponse.status).toBe(404);
  });
});
