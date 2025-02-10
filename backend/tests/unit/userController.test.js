const sinon = require("sinon");
const { sequelize, User } = require("../../src/models");
const userController = require("../../src/controllers/UserController");

/**
 * Testes Unitários do User Controller
 */
describe("Testes Unitários do User Controller", () => {
  /**
   * Restaurar o estado original dos stubs e spies
   * Restaura os mocks após cada teste.
   */
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterEach(async () => {
    sinon.restore();
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

    await userController.listUsers(req, res);

    expect(res.status.calledWith(200)).toBe(true);
    expect(res.json.calledWith(sinon.match.array)).toBe(true);
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
   * Testa a atualização de um usuário.
   */
  test("updateUser - Deve atualizar um usuário existente", async () => {
    const req = {
      params: { id: Number(1) },
      body: { name: "John Updated", email: "john.updated@example.com" },
    };

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    const userStub = {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      update: sinon.stub().callsFake(function (updatedFields) {
        Object.assign(this, updatedFields);
        return Promise.resolve(this);
      }),
    };

    sinon.stub(User, "findByPk").resolves(userStub);

    await userController.updateUser(req, res);
    console.log(
      "Satus chamado:",
      res.status.getCalls().map((call) => call.args[0])
    );

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
