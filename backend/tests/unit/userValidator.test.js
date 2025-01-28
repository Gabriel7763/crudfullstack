const { validateUser } = require("../../src/middleware/validationMiddleware");

describe("User Validator Unit Tests", () => {
  test("validateUser - Deve passar com dados válidos", () => {
    const req = { body: { name: "John Doe", email: "john.doe@example.com" } };
    const next = jest.fn();
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    validateUser(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  test("validateUser - Deve falhar com dados inválidos", () => {
    const req = { body: { name: "Jo", email: "invalid-email" } };
    const next = jest.fn();
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    validateUser(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: expect.any(String) })
    );
  });
});
