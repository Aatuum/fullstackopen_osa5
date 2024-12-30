import { useState } from 'react';

const BlogForm = ({
  blogs,
  setBlogs,
  setSuccessMessage,
  setErrorMessage,
  handleSubmit,
}) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  const onSubmit = (event) => {
    event.preventDefault();
    // Call the handleSubmit function from App.jsx
    handleSubmit(title, author, url);
    // Reset the form after submission
    setTitle('');
    setAuthor('');
    setUrl('');
  };

  return (
    <form onSubmit={onSubmit}>
      <div>
        <label htmlFor="title">title</label>
        <input
          id="title"
          type="text"
          value={title}
          name="Title"
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>
      <div>
        <label htmlFor="author">author</label>
        <input
          id="author"
          type="text"
          value={author}
          name="Author"
          onChange={({ target }) => setAuthor(target.value)}
        />
      </div>
      <div>
        <label htmlFor="url">url</label>
        <input
          id="url"
          type="text"
          value={url}
          name="Url"
          onChange={({ target }) => setUrl(target.value)}
        />
      </div>
      <button type="submit">create</button>
    </form>
  );
};

export default BlogForm;
