const User = require('../models/User');
const { generateToken } = require('../utils/jwt');

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ 
        error: 'Invalid credentials',
        message: 'Email or password is incorrect'
      });
    }

    // Check if user is active
    if (!user.is_active) {
      return res.status(401).json({ 
        error: 'Account disabled',
        message: 'Your account has been disabled. Please contact an administrator.'
      });
    }

    // Verify password
    const isValidPassword = await User.verifyPassword(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ 
        error: 'Invalid credentials',
        message: 'Email or password is incorrect'
      });
    }

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      organizationId: user.organization_id,
      role: user.role
    });

    // Return user data (without password)
    const userData = {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      role: user.role,
      department: user.department,
      jobTitle: user.job_title,
      organizationId: user.organization_id,
      entityId: user.entity_id,
      createdAt: user.created_at
    };

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: userData
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'An error occurred during login. Please try again.'
    });
  }
};

const register = async (req, res) => {
  try {
    const { 
      email, 
      password, 
      firstName, 
      lastName, 
      role, 
      organizationId, 
      entityId, 
      department, 
      jobTitle 
    } = req.body;

    // Check if email already exists
    const emailExists = await User.checkEmailExists(email);
    if (emailExists) {
      return res.status(400).json({ 
        error: 'Email already exists',
        message: 'An account with this email address already exists'
      });
    }

    // Create new user
    const userData = {
      organization_id: organizationId,
      entity_id: entityId,
      email,
      first_name: firstName,
      last_name: lastName,
      role,
      password,
      department,
      job_title: jobTitle
    };

    const newUser = await User.create(userData);

    // Generate JWT token for new user
    const token = generateToken({
      userId: newUser.id,
      email: newUser.email,
      organizationId: newUser.organization_id,
      role: newUser.role
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: newUser
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'An error occurred during registration. Please try again.'
    });
  }
};

const logout = async (req, res) => {
  try {
    // In a stateless JWT system, logout is handled client-side
    // by removing the token from storage
    res.json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'An error occurred during logout'
    });
  }
};

const getProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ 
        error: 'User not found',
        message: 'User profile not found'
      });
    }

    res.json({
      success: true,
      user
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'An error occurred while fetching profile'
    });
  }
};

module.exports = {
  login,
  register,
  logout,
  getProfile
};

