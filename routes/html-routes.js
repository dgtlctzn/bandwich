module.exports = function (app) {
    app.get("/", (req, res)=> {
        res.render("index");
    });

    app.get("/workstation", (req, res)=> {
        res.render("workstation");
    });


}