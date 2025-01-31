# Laravel Pint Auto Formatter

A simple formatter for Laravel Pint, which automatically runs `./vendor/bin/pint {filepath}` to format your code. There’s no magic here, so you must install Laravel Pint on your project first.

## Features

- **Automatic formatting**: The extension runs Laravel Pint on the file whenever you save or format code.
- **Simple setup**: Just install Laravel Pint, and you're good to go!

> **Tip**: You can view a demonstration of the formatter in action by adding an animated GIF or screenshot of your code being auto-formatted.

## Requirements

Before using this extension, you need to install Laravel Pint in your project:

1. Install Laravel Pint via Composer:

```bash
composer require laravel/pint --dev
```

2. Make sure ./vendor/bin/pint is available in your project.

## Extension Settings

This extension does not contribute any new VS Code settings.

## Known Issues

- If Laravel Pint is not installed, the formatter will not work.
- Ensure that your project's directory contains a composer.json file with Laravel Pint as a dependency.
