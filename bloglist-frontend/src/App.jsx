import { useState, useEffect } from 'react';
import Blog from './components/Blog';
import blogService from './services/blogs';
import loginService from './services/login';
import BlogForm from './components/BlogForm';
import Toggleable from './components/Togglable';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    if (user) {
      blogService
        .getAll()
        .then((blogs) => {
          // Sort blogs by likes in descending order
          const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes);
          setBlogs(sortedBlogs); // Set the sorted blogs
        })
        .catch((error) => {
          console.error('Error fetching blogs:', error);
        });
    }
  }, [user]); // Effect runs whenever `user` changes

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLike = async (blog) => {
    try {
      // Luo päivitetty blogi, jossa tykkäysmäärä kasvaa yhdellä
      const updatedBlog = {
        ...blog,
        likes: blog.likes + 1,
      };

      // Päivitä blogi backendissä
      const updated = await blogService.update(blog._id, updatedBlog);

      // Päivitä blogit Reactin tilassa ja lajittele ne tykkäysmäärän mukaan
      setBlogs((prevBlogs) => {
        const updatedBlogs = prevBlogs.map((b) =>
          b._id === blog._id ? updated : b
        );

        return updatedBlogs.sort((a, b) => b.likes - a.likes);
      });
    } catch (error) {
      console.error('Error', error);
    }
  };

  const handleDelete = async (blog) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete the blog: "${blog.title}" by ${blog.author}?`
    );
    if (confirmed) {
      try {
        await blogService.remove(blog._id);
        setBlogs((prevBlogs) => prevBlogs.filter((b) => b._id !== blog._id));
      } catch (error) {
        console.error('Error when deleting:', error);
        alert('Error deleting blog');
      }
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    console.log('logging in with', username, password);
    try {
      const user = await loginService.login({
        username,
        password,
      });
      // Token localstorageen
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user));
      setUser(user);
      blogService.setToken(user.token);
      setUsername('');
      setPassword('');
    } catch (exception) {
      setErrorMessage('wrong credentials');
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const handleSubmit = async (title, author, url) => {
    try {
      const newBlog = { title, author, url, user: user.id };
      const savedBlog = await blogService.create(newBlog);

      setBlogs((prevBlogs) => [...prevBlogs, savedBlog]);
      setSuccessMessage(
        `A new blog "${savedBlog.title}" by ${savedBlog.author} added.`
      );
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
    } catch (exception) {
      setErrorMessage('Failed to create blog');
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };
  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser'); // Clear token
    setUser(null); // Clear user state
    setBlogs([]); // Optional: Clear blogs to prevent viewing blogs while logged out
  };

  // const createBlog = async (newBlog) => {
  //   const createdBlog = await blogService.create(newBlog);
  //   setBlogs(blogs.concat(createdBlog));
  // };

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  );

  return (
    <div>
      <h1>Blogs</h1>
      {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
      {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}
      {/* <Notification message={errorMessage} /> */}
      {!user && loginForm()}
      {user && (
        <div>
          <p>{user.name} logged in</p>
          <button onClick={handleLogout}>logout</button>
          <Toggleable buttonLabel="New Blog">
            <BlogForm
              blogs={blogs}
              setBlogs={setBlogs}
              setSuccessMessage={setSuccessMessage}
              setErrorMessage={setErrorMessage}
              handleSubmit={handleSubmit}
            />
          </Toggleable>
        </div>
      )}
      <h2>Blogs</h2> {/* Use a list to display blogs */}
      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          setBlogs={setBlogs}
          blogs={blogs}
          user={user}
          handleDelete={() => handleDelete(blog)}
          handleLike={() => handleLike(blog)}
        />
      ))}
    </div>
  );
};

export default App;
