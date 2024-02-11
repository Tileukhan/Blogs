// index.js
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const faker = require('faker');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb+srv://tleukhan3:A1qEfXAFEuePgxeB@cluster0.qjvqnab.mongodb.net/Web', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(express.static(path.join(__dirname, 'public')));
// Define Blog Schema
const blogSchema = new mongoose.Schema({
  title: String,
  body: String,
  author: String,
  createdAt: { type: Date, default: Date.now },
});

const Blog = mongoose.model('Blog', blogSchema);

// Generate fake data
for (let i = 0; i < 20; i++) {
  const fakeBlog = {
    title: faker.lorem.sentence(),
    body: faker.lorem.paragraph(),
    author: faker.name.findName(),
  };
  Blog.create(fakeBlog);
}

// API Endpoints

// POST /blogs
app.post('/blogs', async (req, res) => {
  try {
    const newBlog = await Blog.create(req.body);
    res.status(201).json(newBlog);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET /blogs
app.get('/blogs', async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /blogs/:id
app.get('/blogs/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (blog) {
      res.json(blog);
    } else {
      res.status(404).json({ error: 'Blog not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /blogs/:id
app.put('/blogs/:id', async (req, res) => {
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (updatedBlog) {
      res.json(updatedBlog);
    } else {
      res.status(404).json({ error: 'Blog not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /blogs/:id
app.delete('/blogs/:id', async (req, res) => {
  try {
    const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
    if (deletedBlog) {
      res.json({ message: 'Blog deleted successfully' });
    } else {
      res.status(404).json({ error: 'Blog not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
