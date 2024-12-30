import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BlogForm from '../components/BlogForm';
import { expect, vi } from 'vitest';

vi.mock('../services/blogs');

test('calls handleSubmit with correct data when a new blog is created', async () => {
  const setBlogs = vi.fn();
  const setSuccessMessage = vi.fn();
  const setErrorMessage = vi.fn();

  const handleSubmit = vi.fn();

  render(
    <BlogForm
      blogs={[]}
      setBlogs={setBlogs}
      setSuccessMessage={setSuccessMessage}
      setErrorMessage={setErrorMessage}
      handleSubmit={handleSubmit}
    />
  );

  const user = userEvent.setup();

  const inputTitle = screen.getByLabelText('title');
  const inputAuthor = screen.getByLabelText('author');
  const inputUrl = screen.getByLabelText('url');
  const submit = screen.getByText('create');

  await user.type(inputTitle, 'Testi Blogi');
  await user.type(inputAuthor, 'Joku ukko');
  await user.type(inputUrl, 'https://testiosoite.com');

  await user.click(submit);

  expect(handleSubmit).toHaveBeenCalledWith(
    'Testi Blogi',
    'Joku ukko',
    'https://testiosoite.com'
  );
});
