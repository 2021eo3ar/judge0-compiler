const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');






const app = express();
app.use(express.json()); // Parse JSON bodies

app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/Judge0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
console.log("connected to  mongodb ")
let success = false;

const userSchema = new mongoose.Schema({
  username: {type: String, unique: true },
  email: { type: String, unique: true },
  password: String,
});

const User = mongoose.model('User', userSchema);
app.get("/", (req, res) => {
  res.send("Hello world");
})
// Signup route
// Signup route
app.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      success = false
      return res.status(409).json({ success,message: 'Email already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    // Generate a JWT
    const token = jwt.sign({ userId: newUser._id }, 'your_secret_key');
    success = true;
    res.status(201).json({success, message: 'User created successfully', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Login route
// Login route
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ username });
    if (!user) {
      success = false
      return res.status(401).json({ message: 'please try to login with correct credentials',success });
    }

    // Compare the password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      success = false;
      return res.status(401).json({ success, message: 'please try to login with correct credentials ' });
    }
    
    // Generate a JWT
    const token = jwt.sign({ userId: user._id }, 'your_secret_key');
     success = true;
    res.status(200).json({success,  message: 'Login successful', token});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Middleware function to verify the JWT
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, 'your_secret_key', (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Failed to authenticate token' });
    }

    req.userId = decoded.userId;
    next();
  });
};

// Protected route
app.get('/getuser', verifyToken, async (req, res) => {
  try {
    const userId = req.userId;

    // Find the user by ID
    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // The user object is available with the password field excluded
    return res.status(200).json({ user });
  } catch (error) {
    console.error(error.message);
    return res.status(500).send('Internal server error');
  }
});

// Submission schema and model
const submissionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  sourceCode: {
    type: String,
    required: true,
  },
  languageId: {
    type: Number,
    required: true,
  },
  stdin: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Accepted', 'Compilation Error', 'Runtime Error', 'Timeout'],
    default: 'Pending',
  },
  output: {
    type: String,
    default: null,
  },
  error: {
    type: String,
    default: null,
  },
});

const Submission = mongoose.model('Submission', submissionSchema);

// Route for creating a submission
app.post('/submissions', (req, res) => {
  const submission = new Submission({
    userId: req.body.userId,
    sourceCode: req.body.sourceCode,
    languageId: req.body.languageId,
    stdin: req.body.stdin,
  });

  submission.save()
    .then(savedSubmission => {
      // The submission was successfully saved to the database
      res.status(201).json(savedSubmission);
    })
    .catch(error => {
      // Handle the error
      console.error(error);
      res.status(500).send('Internal server error');
    });
});

// Route for retrieving all submissions
app.get('/submissions', (req, res) => {
  Submission.find()
    .then(submissions => {
      // Process the submissions
      res.status(200).json(submissions);
    })
    .catch(error => {
      // Handle the error
      console.error(error);
      res.status(500).send('Internal server error');
    });
});

// Route for retrieving the output of a specific submission
app.get('/submissions/:id/output', (req, res) => {
  const submissionId = req.params.id;

  Submission.findById(submissionId)
    .then(submission => {
      if (!submission) {
        return res.status(404).json({ message: 'Submission not found' });
      }

      const output = submission.output;
      res.status(200).json({ output });
    })
    .catch(error => {
      // Handle the error
      console.error(error);
      res.status(500).send('Internal server error');
    });
});







const port = 5000;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

