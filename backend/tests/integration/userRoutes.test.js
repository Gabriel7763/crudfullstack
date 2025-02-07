const request = require("supertest");
const app = require("../../src/app");
const { sequelize, User } = require("../../src/models");

/**
 * Configuração inicial dos testes.
 * - Antes de todos os testes: sincroniza os modelos com o banco de dados.
 * - Após todos os testes: fecha a conexão com o banco de dados.
 */
beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

/**
 * Suite de testes de integração para a API de Usuário.
 */
describe("Testes de Integração de API de Usuário", () => {
  /**
   * Testa a criação de um novo usuário via API.
   */
  test("POST /api/users - Deve criar um novo usuário", async () => {
    const newUser = { name: "John Doe", email: "john.doe@example.com" };
    const response = await request(app).post("/api/users").send(newUser);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.name).toBe(newUser.name);
    expect(response.body.email).toBe(newUser.email);
  });

  /**
   * Testa a recuperação de todos os usuários cadastrados.
   */
  test("GET /api/users - Deve retornar todos os usuários", async () => {
    await User.create({ name: "Alice", email: "alice@example.com" });
    await User.create({ name: "Bob", email: "bob@example.com" });

    const response = await request(app).get("/api/users");

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  /**
   * Testa a obtenção de um usuário específico pelo ID.
   */
  test("GET /api/users/:id - Deve retornar um usuário por ID", async () => {
    const user = await User.create({
      name: "Jane Doe",
      email: "jane.doe@example.com",
    });
    const response = await request(app).get(`/api/users/${user.id}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id", user.id);
  });

  /**
   * Testa a atualização dos dados de um usuário específico.
   */
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

  /**
   * Testa a exclusão de um usuário pelo ID.
   */
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

  /**
   * Testa a validação de dados ao criar um usuário com informações inválidas.
   */
  test("POST /api/users - Deve retornar erro de validação por dado inválido", async () => {
    const invalidUser = { name: "Jo", email: "invalid.mail" };
    const response = await request(app).post("/api/users").send(invalidUser);

    expect(response.status).toBe(400);
    expect(response.body.error).toBeDefined();
  });
});
