const request = require("supertest");
const app = require("../../src/app");
const { sequelize, User } = require("../../src/models");

beforeAll(async () => {
  await sequelize.sync({ force: true }); // Sincronizar os modelos com o banco de dados
});

afterAll(async () => {
  await sequelize.close(); // Fechar a conexão com o banco de dados
});

describe("Testes de Integração de API de Usuário", () => {
  test("POST /api/users - Deve criar um novo usuário", async () => {
    const newUser = { name: "John Doe", email: "john.doe@example.com" };
    const response = await request(app).post("/api/users").send(newUser);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.name).toBe(newUser.name);
    expect(response.body.email).toBe(newUser.email);
  });

  test("GET /api/users - Deve retornar todos os usuários", async () => {
    await User.create({ name: "Alice", email: "alice@example.com" });
    await User.create({ name: "Bob", email: "bob@example.com" });

    const response = await request(app).get("/api/users");

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  test("GET /api/users/:id - Deve retornar um usuário por ID", async () => {
    const user = await User.create({
      name: "Jane Doe",
      email: "jane.doe@example.com",
    });
    const response = await request(app).get(`/api/users/${user.id}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id", user.id);
  });

  test("PUT /api/users/:id - Deve atualizar um usuário", async () => {
    const user = await User.create({
      name: "Update Me",
      email: "update.me@example.com",
    });
    const updatedData = {
      name: "Updated Name",
      email: "updated.email@example.com",
    };
    const response = await request(app)
      .put(`/api/users/${user.id}`)
      .send(updatedData);

    expect(response.status).toBe(200);
    expect(response.body.name).toBe(updatedData.name);
    expect(response.body.email).toBe(updatedData.email);
  });

  test("DELETE /api/users/:id - Deve excluir um usuário", async () => {
    const user = await User.create({
      name: "Me Delete",
      email: "delete.me@example.com",
    });
    const res = await request(app).delete(`/api/users/${user.id}`);

    expect(res.status).toBe(204);

    const deletedUser = await User.findByPk(user.id);
    expect(deletedUser).toBeNull();
  });

  test("Post /api/user - Deve retornar erro de validação por dado inválido", async () => {
    const invalidUser = { name: "Jo", email: "invalid.mail" };
    const response = (await request(app).post("/api/users")).setEncoding(
      invalidUser
    );

    expect(response.status).toBe(400);
    expect(response.body.error).toBeDfined();
  });
});
