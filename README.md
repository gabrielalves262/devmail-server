# DevMail Server

A simple smtp server for development purposes.

## Installation

```bash
npm install -g devmail-server
```

## Usage

```bash
npx devmail-server
```

## Configuration

You can pass the following options to configure the SMTP server:

- `--smtp-host`: SMTP host server. (default: '0.0.0.0')
- `--smtp-port`: SMTP port server. (default: 587)
- `--host`, `-h`: Web server host. (default: '0.0.0.0')
- `--port`, `-p`: Web server port. (default: 3000)

Example:

```bash
npx devmail-server --smtp-host "127.0.0.1" --smtp-port 2525 -p 8080
```