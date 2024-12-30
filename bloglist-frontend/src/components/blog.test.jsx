import { render, screen } from '@testing-library/react';
import Blog from './Blog';
import { expect } from 'vitest';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

//TESTI RENDERÖINNILLE
test('renders blog title', () => {
  const blog = {
    title: 'Test Blog Title',
    author: 'Test Author',
    likes: 0,
    user: { username: 'testuser', name: 'Test User' },
  };

  render(
    <Blog blog={blog} setBlogs={() => {}} user={{ username: 'testuser' }} />
  );

  const element = screen.getByText(/Test Blog Title/);
  expect(element).toBeInTheDocument();
});

// TESTI NAPPIEN KLIKKAUKSELLE
test('renders blog details after clicking the View button', async () => {
  const blog = {
    title: 'Title',
    author: 'Test Author',
    url: 'moroe',
    likes: 10,
    user: { username: 'testuseri', name: 'Test Useri' },
  };

  render(
    <Blog blog={blog} setBlogs={() => {}} user={{ username: 'testuseri' }} />
  );

  //klikkaus View napista
  const user = userEvent.setup();
  const button = screen.getByText('View');
  await user.click(button);

  //URL tykkäykset ja käyttäjä tulee näkyviin
  expect(screen.getByText(/URL: moroe/)).toBeInTheDocument();
  expect(screen.getByText(/Likes: 10/)).toBeInTheDocument();
  expect(screen.getByText(/Author: Test User/)).toBeInTheDocument();
});

//TESTI NAPPIEN KLIKKAUKSELLE JOS NIITÄ CLIKATAAN KAHDESTI
test('calls event handler twice when likeS button is clicked atleast two times', async () => {
  const blog = {
    title: 'Blog title',
    author: 'Blog Author',
    likes: 0,
    user: { username: 'aatum', name: 'Aatu Maenpaa' },
  };

  const handleLike = vi.fn();
  const handleDelete = vi.fn();

  render(
    <Blog
      blog={blog}
      setBlogs={() => {}}
      user={{ username: 'aatum' }}
      handleLike={handleLike}
      handleDelete={handleDelete}
    />
  );

  // Simuloidaan "View"-napin painaminen, jotta näkyviin tulee "Like"-nappi
  const viewButton = screen.getByText('View');
  const user = userEvent.setup();
  await user.click(viewButton);

  // Haetaan Like
  const button = screen.getByText('Like');

  // Kaksi klikkausta napille

  await user.click(button);
  await user.click(button);

  // Katsotaan että tapahtumankäsittelijä on kutsuttu kaksi kertaa
  expect(handleLike).toHaveBeenCalledTimes(2);
});
