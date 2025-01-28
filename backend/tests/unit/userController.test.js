const sinon = require("sinon");
const { User } = require("../../src/models");
const userController = require("../../src/controllers/UserController");
const { json } = require("sequelize");

describe("Testes Unitários do User Controller", () => {
  afterEach(() => {
    sinon.restore();
  });

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

  test("getUser - Deve retornar 404 se usuário usuário não for encontrado", async () => {
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
});
