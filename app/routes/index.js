exports.login = function(req, res) {
    if (req.session.user) {
        res.redirect('/index');
    } else {
        res.render('login');
    }
};

exports.index = function(req, res) {
    res.render('index');
};

exports.partials = function(req, res) {
    var name = req.params.name;
    res.render('partials/' + name);
};