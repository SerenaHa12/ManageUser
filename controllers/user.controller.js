const moment = require("moment");
const model = require("../models/index");
const User = model.User;
const Role = model.Role;
const roleUtil = require("../utils/role.utils");
const bcrypt = require("bcrypt");

// thêm object toán tử của sequelize
const { Op } = require("sequelize");

module.exports = {
  index: async (req, res) => {
    const { status, keyword } = req.query;
    const filter = {};
    if (status === "active" || status === "inactive") {
      filter.status = status === "active" ? true : false;
    }
    if (keyword) {
      // cách làm đơn từng thuộc tính
      // filter.email = { [Op.like]: `%${keyword.toLowerCase()}%` };

      // gộp
      // iLike là một toán tử trong postgres không phân biệt chữ hoa chữ thường
      filter[Op.or] = [
        {
          name: {
            [Op.iLike]: `%${keyword}%`,
          },
        },
        {
          email: {
            [Op.iLike]: `%${keyword}%`,
          },
        },
      ];
    }
    //   test xem có nhận model không
    // findAll là phương thức của sequelize dùng để lấy tất cả các dữ liệu

    /**
     * Sử dụng phương thức: find and Count all -> trả về tổng số bản ghi và limit
     */
    const limit = 3; // sau này đưa limit vào file config
    const { page = 1 } = req.query;
    const offset = (page - 1) * limit;
    const { rows: users, count } = await User.findAndCountAll({
      // 1. sắp xếp id theo chiều tăng dần
      order: [["id", "desc"]],
      where: filter,
      limit,
      offset,
      include: {
        model: model.Role,
        through: "user_role",
        as: "roles",
      },
    });

    // console.log(count);
    console.log("users", users);
    const totalPage = Math.ceil(count / limit);

    // const getRole = async (user) => {
    //   // console.log(user);
    //   const roles = await user.getRole();

    //   return roles.getRole();
    // };

    res.render("users/index", { users, moment, totalPage, page, req });
  },

  // get add form
  add: async (req, res) => {
    const roles = await Role.findAll({
      order: [["name", "asc"]],
    });
    res.render("users/add", { roles });
  },

  // handle add form
  handleAdd: async (req, res, next) => {
    const body = req.body;
    const hashedPassword = bcrypt.hashSync(body.password, 10);
    const roles = !Array.isArray(body.roles) ? [body.roles] : body.roles;
    try {
      const user = await User.create({
        name: body.name,
        email: body.email,
        password: hashedPassword,
        status: +body.status === 1,
      });
      // console.log(user);

      if (user) {
        if (roles.length) {
          for (let i = 0; i < roles.length; i++) {
            const role = await Role.findByPk(roles[i]);
            await user.addRole(role);
          }
        }
        return res.redirect("/users");
      }
    } catch (e) {
      return next(e); // gọi error handler
    }
  },

  // get edit form
  edit: async (req, res, next) => {
    // muốn có dữ liệu phải truy vấn
    // bước 1: lấy ra id
    const { id } = req.params;
    try {
      const user = await User.findOne({
        where: { id },
        include: {
          model: Role,
          as: "roles",
        },
      });
      const roles = await Role.findAll({
        order: [["name", "asc"]],
      });

      // console.log(user);

      if (!user) {
        throw new Error("User not found");
      }

      res.render("users/edit", { user, roles, roleUtil });
    } catch (e) {
      return next(e);
    }
  },

  // handle edit form
  handleEdit: async (req, res) => {
    const { id } = req.params;
    const body = req.body;
    const roles = !Array.isArray(body.roles) ? [body.roles] : body.roles;

    // const hashedPassword = bcrypt.hashSync(body.password, 10);
    try {
      const user = await User.findOne({
        where: { id },
      });

      if (!user) {
        throw new Error("User not found");
      }

      // Update user information, excluding the password
      const status = await User.update(
        {
          name: body.name,
          email: body.email,
          status: +body.status === 1,
        },
        {
          where: { id },
        }
      );

      if (status && roles.length) {
        // console.log(permission);

        const rolesRequest = await Promise.all(
          roles.map((roleId) => Role.findByPk(roleId))
        );
        // console.log(permissionRequest);

        const user = await User.findByPk(id);
        await user.setRoles(rolesRequest);
      }

      return res.redirect("/users");
    } catch (e) {
      return next(e);
    }
  },

  // delete a user
  delete: async (req, res) => {
    const { id } = req.params;
    await User.destroy({
      where: { id },
      force: true, // xóa vĩnh viễn
    });
    return res.redirect("/users");
    // res.send(id);
  },
};
