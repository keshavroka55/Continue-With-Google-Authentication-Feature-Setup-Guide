# Contributing

Thank you for your interest in contributing to this project! Contributions, improvements, bug fixes, and new ideas are welcome.

## How to Contribute

### 1. Fork the Repository

Create your own fork of the repository on GitHub.

### 2. Clone Your Fork

```bash
git clone <your-fork-url>
cd auth
```

### 3. Create a Branch

Create a separate branch for your changes.

```bash
git checkout -b feature/your-feature
```

Use meaningful branch names, for example:

```text
feature/google-auth
fix/login-validation
docs/update-readme
refactor/auth-service
```

### 4. Make Your Changes

Implement your changes while following the existing project structure and coding style.

### 5. Test Your Changes

Make sure your changes work correctly and do not break existing functionality.

```bash
npm install
```

Run the appropriate development and test commands for the part of the project you changed.

### 6. Commit Your Changes

Use a clear commit message.

```bash
git add .
git commit -m "feat: add Google authentication"
```

Examples:

```text
feat: add password reset
fix: resolve login validation error
docs: update setup instructions
refactor: simplify auth middleware
```

### 7. Push Your Branch

```bash
git push origin feature/your-feature
```

### 8. Create a Pull Request

Open a Pull Request from your branch to the main repository.

In your Pull Request, briefly explain:

* What you changed
* Why you changed it
* How you tested it
* Any important considerations

## Contribution Guidelines

Please:

* Keep the code clean and readable.
* Follow the existing project structure.
* Avoid unnecessary dependencies.
* Keep changes focused on the purpose of the Pull Request.
* Test your changes before submitting.
* Update documentation when necessary.
* Write clear commit messages.
* Be respectful and constructive when discussing changes.

## Security

**Never commit sensitive information**, including:

* `.env` files
* Passwords
* API keys
* JWT secrets
* Database credentials
* OAuth client secrets
* Private keys

Use `.env.example` to document required environment variables.

## Reporting Bugs

When reporting a bug, provide:

1. A clear description of the problem.
2. Steps to reproduce it.
3. Expected behavior.
4. Actual behavior.
5. Relevant error messages or logs.
6. Environment information when relevant.

## Suggesting Improvements

Suggestions and new ideas are welcome.

Before implementing a major change, consider opening an issue or discussing the idea first so that the proposed direction can be reviewed.

## Pull Request Checklist

Before submitting a Pull Request, make sure:

* [ ] The code works as expected.
* [ ] Existing functionality is not unnecessarily broken.
* [ ] No secrets or `.env` files are included.
* [ ] The code follows the existing style.
* [ ] Documentation has been updated if necessary.
* [ ] The Pull Request clearly explains the changes.

Thank you for contributing! ❤️
