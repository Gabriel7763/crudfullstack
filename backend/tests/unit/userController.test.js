const sinon = require("sinon");
const { User } = require("../../src/models");
const userController = require("../../src/controllers/UserController");

/**
 * Testes Unitários do User Controller
 */
describe("Testes Unitários do User Controller", () => {
  /**
   * Restaura os mocks após cada teste.
   */
  afterEach(() => {
    sinon.restore();
  });

  /**
   * Testa a criação de um novo usuário.
   */
  test("createUser - Deve criar um novo usuário", async () => {
    const req = { body: { name: "John Doe", email: "john.doe@example.com" } };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    sinon.stub(User, "create").resolves({ id: 1, ...req.body });

    await userController.createUser(req, res);

    expect(res.status.calledWith(201)).toBe(true);
    expect(
      res.json.calledWith(
        sinon.match({ id: 1, name: "John Doe", email: "john.doe@example.com" })
      )
    ).toBe(true);
  });

  /**
   * Testa a obtenção de um usuário por ID.
   */
  test("getUser - Deve retornar um usuário por ID", async () => {
    const req = { params: { id: 1 } };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    sinon
      .stub(User, "findByPk")
      .resolves({ id: 1, name: "John Doe", email: "john.doe@example.com" });

    await userController.getUser(req, res);

    expect(res.status.calledWith(200)).toBe(true);
    expect(res.json.calledWith(sinon.match({ id: 1 }))).toBe(true);
  });

  /**
   * Testa a resposta ao tentar obter um usuário inexistente.
   */
  test("getUser - Deve retornar 404 se usuário não for encontrado", async () => {
    const req = { params: { id: 1 } };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    sinon.stub(User, "findByPk").resolves(null);

    await userController.getUser(req, res);

    expect(res.status.calledWith(404)).toBe(true);
    expect(res.json.calledWith(sinon.match({ error: "User not found" }))).toBe(
      true
    );
  });

  /**
   * Testa a listagem de todos os usuários.
   */
  test("getUsers - Deve retornar uma lista de usuários", async () => {
    const req = {};
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    sinon.stub(User, "findAll").resolves([
      { id: 1, name: "John Doe", email: "john.doe@example.com" },
      { id: 2, name: "Jane Doe", email: "jane.doe@example.com" },
    ]);

    await userController.getUsers(req, res);

    expect(res.status.calledWith(200)).toBe(true);
    expect(res.json.calledWith(sinon.match.array)).toBe(true);
  });

  /**
   * Testa a atualização de um usuário.
   */
  test("updateUser - Deve atualizar um usuário existente", async () => {
    const req = { params: { id: 1 }, body: { name: "John Updated" } };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    sinon
      .stub(User, "findByPk")
      .resolves({
        id: 1,
        name: "John Doe",
        email: "john.doe@example.com",
        update: sinon.stub().resolves(),
      });

    await userController.updateUser(req, res);

    expect(res.status.calledWith(200)).toBe(true);
    expect(
      res.json.calledWith(sinon.match({ id: 1, name: "John Updated" }))
    ).toBe(true);
  });

  /**
   * Testa a remoção de um usuário.
   */
  test("deleteUser - Deve deletar um usuário existente", async () => {
    const req = { params: { id: 1 } };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    sinon
      .stub(User, "findByPk")
      .resolves({ id: 1, destroy: sinon.stub().resolves() });

    await userController.deleteUser(req, res);

    expect(res.status.calledWith(204)).toBe(true);
  });
});
