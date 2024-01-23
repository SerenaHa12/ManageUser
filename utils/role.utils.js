module.exports = {
  isRole: (user, userId) => {
    // user: instace
    // courseId: khóa học cần kiểm tra
    const result = user.role.find((item) => +item.id === +userId);
    return result ? true : false;
  },
};
