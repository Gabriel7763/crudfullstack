const { User } = require("../models");

module.exports = {
  async listUsers(req, res) {
    try {
      const users = await User.findAll();
      return res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar usuários" });
      console.log("Erro:", error);
    }
  },
  async createUser(req, res) {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: "name e email obrigatórios" });
    }

    try {
      const userAlreadyExists = await User.findOne({ where: { email } });

      if (userAlreadyExists) {
        return res.status(400).json({ message: "Esse usuário já existe" });
      }

      const createdUser = await User.create({ name, email });
      return res.status(201).json(createdUser);
    } catch (error) {
      return res.status(400).json({ message: "Erro ao criar usuário" });
    }
  },
  async getUser(req, res) {
    const { id } = req.params;
    try {
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }
      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({ message: "Erro ao buscar usuário" });
    }
  },
  async updateUser(req, res) {
    const id = Number(req.params.id);
    const { name, email } = req.body;

    if (isNaN(id)) {
      return res.status(415).json({ message: "ID inválido" });
    }

    if (!name || !email) {
      return res.status(406).json({ message: "name e email obrigatórios" });
    }

    try {
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }

      const updatedFields = {};
      if (name) updatedFields.name = name;
      if (email) updatedFields.email = email;

      await user.update(updatedFields);
      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({ message: "Erro ao atualizar usuário" });
    }
  },
  async deleteUser(req, res) {
    const { id } = req.params;
    try {
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }
      await user.destroy();
      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ message: "Erro ao deletar usuário" });
    }
  },
};
