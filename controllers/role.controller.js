const model = require("../models/index");
const Role = model.Role;
const Permission = model.Permission;
const permissionUtil = require("../utils/permission.utils");
const moment = require("moment");
// thêm object toán tử của sequelize
const { Op } = require("sequelize");

module.exports = {
  index: async (req, res) => {
    const { keyword } = req.query;
    const filter = {};
    if (keyword) {
      filter[Op.or] = [
        {
          name: {
            [Op.iLike]: `%${keyword}%`,
          },
        },
      ];
    }

    const limit = 3; // sau này đưa limit vào file config
    const { page = 1 } = req.query;
    const offset = (page - 1) * limit;
    const { rows: roles, count } = await Role.findAndCountAll({
      // 1. sắp xếp id theo chiều tăng dần
      order: [["id", "desc"]],
      where: filter,
      limit,
      offset,
    });
    // console.log(count);
    // console.log("users", users);
    const totalPage = Math.ceil(count / limit);
    res.render("roles/index", { roles, moment, totalPage, page, req });
  },

  // get add form
  add: async (req, res) => {
    const permissions = await Permission.findAll({
      order: [["value", "asc"]],
    });
    res.render("roles/add", { permissions });
  },

  handleAdd: async (req, res, next) => {
    const body = req.body;
    const permissions = !Array.isArray(body.permissions)
      ? [body.permissions]
      : body.permissions;
    try {
      const role = await Role.create({
        name: body.name,
      });
      // console.log(user);

      if (role) {
        if (permissions.length) {
          for (let i = 0; i < permissions.length; i++) {
            const permission = await Permission.findByPk(permissions[i]);
            await role.addPermission(permission);
          }
        }
        return res.redirect("/roles");
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
      const role = await Role.findOne({
        where: { id },
        include: {
          model: Permission,
          as: "permissions",
        },
      });
      const permissions = await Permission.findAll({
        order: [["value", "asc"]],
      });
      // console.log(user);

      if (!role) {
        throw new Error("Role not found");
      }

      res.render("roles/edit", { role, permissions, permissionUtil });
    } catch (e) {
      return next(e);
    }
  },

  // handle edit form
  handleEdit: async (req, res) => {
    const { id } = req.params;
    const body = req.body;
    const permissions = !Array.isArray(body.permissions)
      ? [body.permissions]
      : body.permissions;
    try {
      const role = await Role.findOne({
        where: { id },
      });

      if (!role) {
        throw new Error("Role not found");
      }

      // Update role information
      const updatedRole = await role.update({
        name: body.name,
      });

      if (updatedRole && permissions.length) {
        // console.log(permission);

        const permissionsRequest = await Promise.all(
          permissions.map((permissionId) => Permission.findByPk(permissionId))
        );
        // console.log(permissionRequest);

        const role = await Role.findByPk(id);
        await role.setPermissions(permissionsRequest);
      }

      return res.redirect("/roles");
    } catch (e) {
      return next(e);
    }
  },

  // delete a user
  delete: async (req, res) => {
    const { id } = req.params;
    await Role.destroy({
      where: { id },
      force: true, // xóa vĩnh viễn
    });
    return res.redirect("/roles");
    // res.send(id);
  },
};
