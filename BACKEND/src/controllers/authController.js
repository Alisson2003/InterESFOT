export const loginSuccess = (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Login con Google exitoso',
        user: req.user
    });
    };

    export const loginFailed = (req, res) => {
    res.status(401).json({
        success: false,
        message: 'Fallo el login con Google'
    });
};
