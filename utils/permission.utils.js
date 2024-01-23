module.exports = {
  isPermission: (role, roleId) => {
    // user: instace
    // courseId: khóa học cần kiểm tra
    const result = role.permissions.find((item) => +item.id === +roleId);
    return result ? true : false;
  },
};
