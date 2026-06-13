function ErrorMessage({ message, id }) {
  if (!message) {
    return null;
  }

  return (
    <p id={id} role="alert" className="text-caption text-error">
      {message}
    </p>
  );
}

export default ErrorMessage;
