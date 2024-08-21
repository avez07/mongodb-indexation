const express = require('express');
const mongoose = require('mongoose');
const app = express();

mongoose.connect('mongodb://localhost:27017/indexExample', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// Schema without Index
const userSchemaNoIndex = new mongoose.Schema({
  name: String,
  email: String,
  age: Number,
  createdAt: { type: Date, default: Date.now }
});

// Schema with Index
const userSchemaWithIndex = new mongoose.Schema({
  name: String,
  email: String,
  age: Number,
  createdAt: { type: Date, default: Date.now }
});

// Add an index on the email field
userSchemaWithIndex.index({ email: 1 });

const UserNoIndex = mongoose.model('UserNoIndex', userSchemaNoIndex);
const UserWithIndex = mongoose.model('UserWithIndex', userSchemaWithIndex);

app.get('/create-users', async (req, res) => {
  const users = [];
  for (let i = 0; i < 1000000; i++) {
    users.push({ name: `User${i}`, email: `user${i}@example.com`, age: Math.floor(Math.random() * 100) });
  }
  await UserNoIndex.insertMany(users);
  await UserWithIndex.insertMany(users);
  res.send('Users created');
});

app.get('/find-user-no-index', async (req, res) => {
  console.time('Find User Without Index');
  const user = await UserNoIndex.findOne({ email: 'user500000@example.com' });
  console.timeEnd('Find User Without Index');
  res.send(user);
});

app.get('/find-user-with-index', async (req, res) => {
  console.time('Find User With Index');
  const user = await UserWithIndex.findOne({ email: 'user200000@example.com' });
  console.timeEnd('Find User With Index');
  res.send(user);
});

app.get('/update-user-no-index', async (req, res) => {
  console.time('Update User Without Index');
  await UserNoIndex.updateOne({ email: 'user500000@example.com' }, { age: 30 });
  console.timeEnd('Update User Without Index');
  res.send('User updated');
});

app.get('/update-user-with-index', async (req, res) => {
  console.time('Update User With Index');
  await UserWithIndex.updateOne({ email: 'user500000@example.com' }, { age: 30 });
  console.timeEnd('Update User With Index');
  res.send('User updated');
});

app.get('/delete-user-no-index', async (req, res) => {
  console.time('Delete User Without Index');
  await UserNoIndex.deleteOne({ email: 'user500000@example.com' });
  console.timeEnd('Delete User Without Index');
  res.send('User deleted');
});

app.get('/delete-user-with-index', async (req, res) => {
  console.time('Delete User With Index');
  await UserWithIndex.de({ email: 'user100000@example.com' });
  console.timeEnd('Delete User With Index');
  res.send('User deleted');
});

app.listen(3000, () => console.log('Server is running on port 3000'));
