// middleware/validateEmail.js
const allowedDomains = ['gmail.com', 'yahoo.com', 'outlook.com'];

exports.validateEmailDomain = (req, res, next) => {
  const email = req.body.email;
  
  if (!email) {
    return next();
  }
  
  const domain = email.split('@')[1]?.toLowerCase();
  
  if (!allowedDomains.includes(domain)) {
    return res.status(400).json({
      success: false,
      message: 'Only Gmail, Yahoo, and Outlook email addresses are allowed'
    });
  }
  
  next();
};

exports.validateAdminEmailDomain = (req, res, next) => {
  const email = req.body.email;
  
  if (!email) {
    return next();
  }
  
  const domain = email.split('@')[1]?.toLowerCase();
  
  if (!allowedDomains.includes(domain)) {
    return res.status(400).json({
      success: false,
      message: 'Admin access only allowed with Gmail, Yahoo, or Outlook email addresses'
    });
  }
  
  next();
};