const jwt = require('jsonwebtoken');
const User = require('../user/user.model');

exports.protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }

    if (!token) {
        return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({ success: false, message: 'User not found' });
        }
        if (!user.isActive) {
            return res.status(401).json({ success: false, message: 'Account is deactivated' });
        }

        // Attach plain object (without methods) for downstream use
        req.user = {
            id: user.id,
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            department: user.department,
            batch: user.batch,
            semester: user.semester,
            isActive: user.isActive,
        };

        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
};

exports.optionalProtect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }

    if (!token) return next();

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (user && user.isActive) {
            req.user = {
                id: user.id,
                _id: user.id,
                name: user.name,
                role: user.role,
                department: user.department,
                batch: user.batch,
                semester: user.semester,
                isActive: user.isActive,
            };
        }
        next();
    } catch (error) {
        next();
    }
};

exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Role '${req.user.role}' is not authorized to access this route`,
            });
        }
        next();
    };
};
