import { useState } from 'react';
import blogService from '../services/blogs'; // Adjust the path if needed

const Blog = ({ blog, setBlogs, user, handleDelete, handleLike }) => {
  const [showDetails, setShowDetails] = useState(false);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  };

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };
  return (
    <div className="blog" style={blogStyle}>
      <div>
        {blog.title} {blog.author}
      </div>

      <button onClick={toggleDetails}>{showDetails ? 'Hide' : 'View'}</button>

      {showDetails && (
        <div>
          <p>URL: {blog.url}</p>
          <p>
            Likes: {blog.likes} <button onClick={handleLike}>Like</button>{' '}
            {/* Like nappi */}
          </p>
          <p>Author: {blog.user.name}</p>
          <p>Title: {blog.title}</p>
          {user && blog.user.username === user.username && (
            <button onClick={() => handleDelete(blog)}>Delete</button>
          )}
        </div>
      )}
    </div>
  );
};

export default Blog;
