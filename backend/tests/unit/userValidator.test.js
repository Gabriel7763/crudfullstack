const { validateUser } = require("../../src/middleware/validationMiddleware");

// Suite de testes para validar a função validateUser
// Testa se a função corretamente valida os dados de entrada e chama next() ou retorna erro

describe("User Validator Unit Tests", () => {
  test("validateUser - Deve passar com dados válidos", () => {
    // Simula um objeto de requisição com um nome e um email válidos
    const req = { body: { name: "John Doe", email: "john.doe@example.com" } };

    // Simula a função next(), que deve ser chamada se os dados forem válidos
    const next = jest.fn();

    // Simula o objeto de resposta, com métodos status() e json() mockados
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    // Chama a função validateUser para validar os dados
    validateUser(req, res, next);

    // Verifica se next() foi chamado, indicando que a validação passou
    expect(next).toHaveBeenCalled();

    // Garante que status() não foi chamado, pois não deve haver erro
    expect(res.status).not.toHaveBeenCalled();
  });

  test("validateUser - Deve falhar com dados inválidos", () => {
    // Simula um objeto de requisição com um nome muito curto e um email inválido
    const req = { body: { name: "Jo", email: "invalid-email" } };

    // Simula a função next(), que não deve ser chamada em caso de erro
    const next = jest.fn();

    // Simula o objeto de resposta, com métodos status() e json() mockados
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    // Chama a função validateUser para validar os dados inválidos
    validateUser(req, res, next);

    // Verifica que next() não foi chamado, pois a validação falhou
    expect(next).not.toHaveBeenCalled();

    // Garante que o status da resposta foi definido como 400 (Bad Request)
    expect(res.status).toHaveBeenCalledWith(400);

    // Verifica se json() foi chamado com um objeto contendo a chave "error"
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: expect.any(String) })
    );
  });
});
