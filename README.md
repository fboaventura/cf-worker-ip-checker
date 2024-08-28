# IP Checker Worker

This project is a [Cloudflare Worker](https://developers.cloudflare.com/workers/) that checks the IP address of incoming requests and responds with different content based on the request path and headers.  I use this for internal projects, to identify the connecting IP address when using internet connection without fixed IP address.

## Features

- Responds with HTML content for the root path.
- Responds with the IP address in plain text for text browsers.
- Responds with JSON content for `/json` path.
- Responds with 404 for non-existent paths.

## Technologies Used

- TypeScript
- Cloudflare Workers
- Vitest for testing
- `ua-parser-js` for user-agent parsing

## Setup

### Prerequisites

- Node.js
- Yarn or npm

### Installation

1. Clone the repository:
    ```sh
    git clone <repository-url>
    cd <repository-directory>
    ```

2. Install dependencies:
    ```sh
    yarn install
    # or
    npm install
    ```

## Running Tests

To run the tests, use the following command:
```sh
yarn test
# or
npm test
```

## Usage

To deploy the worker, follow the Cloudflare Workers documentation for deployment.

## License
This project is licensed under the MIT License.
