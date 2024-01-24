module.exports = {
  login: (req, res) => {
    const error = req.flash("error");
    console.log(error);
    res.render("auth/login", { layout: "auth/layout.ejs", error });
  },
};
// sao kmail
// tại vercel t đăng ky sbanwgf git
// login bằng email nhanh hơn
// h thoat skieuer gi nhictrl + c
