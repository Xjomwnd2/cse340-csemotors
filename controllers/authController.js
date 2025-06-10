const bcrypt = require('bcrypt');
const pool = require('../database'); // Your Postgres DB connection

async function login(req, res) {
  const { email, password } = req.body; // From the login form

  try {
    // 1. Look up the user by email
    const result = await pool.query(
      'SELECT * FROM account WHERE account_email = $1',
      [email]
    );

    const user = result.rows[0];

    // 2. If user not found
    if (!user) {
      return res.status(401).send('User not found.');
    }

    // 3. Compare plain password with hashed one
    const isMatch = await bcrypt.compare(password, user.account_password);

    if (!isMatch) {
      return res.status(401).send('Incorrect password.');
    }

    // 4. Save user in session and redirect
    req.session.user = {
      id: user.account_id,
      name: user.account_firstname,
      email: user.account_email,
      type: user.account_type,
    };

    // 5. Redirect based on user type
    if (user.account_type === 'Client') {
      return res.redirect('/client/dashboard');
    } else if (user.account_type === 'Employee') {
      return res.redirect('/employee/dashboard');
    } else if (user.account_type === 'Admin') {
      return res.redirect('/admin/dashboard');
    }

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).send('Something went wrong.');
  }
}

module.exports = { login };
