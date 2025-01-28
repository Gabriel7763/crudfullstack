const { Router } = require("express");
const UserController = require("../controllers/UserController");
const { validateUser } = require("../middleware/validationMiddleware");

const router = Router();

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Retorna uma lista de usuários
 *     responses:
 *       200:
 *         description: Lista de usuários com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *       500:
 *        description: Erro ao buscar usuários
 *        content:
 *         application/json:
 *          schema:
 *           type: object
 *          properties:
 *          message:
 *          type: string
 */
router.get("/", UserController.listUsers);
/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Cria um novo usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *       400:
 *        description: Erro ao criar usuário
 */
router.post("/", validateUser, UserController.createUser);
router.get("/:id", UserController.getUser);
/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Atualiza um usuário existente pelo ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do usuário a ser atualizado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
 *       404:
 *         description: Usuário não encontrado
 */
router.put("/:id", validateUser, UserController.updateUser);
/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Remove um usuário pelo ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do usuário a ser removido
 *     responses:
 *       200:
 *         description: Usuário removido com sucesso
 *       404:
 *         description: Usuário não encontrado
 */
router.delete("/:id", UserController.deleteUser);

module.exports = router;
