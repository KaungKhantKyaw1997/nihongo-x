# NihongoX

**NihongoX** is a fun app designed to help you learn Japanese characters: **Hiragana** and **Katakana**. Test your skills by guessing the correct pronunciation of random characters in both basic and advanced levels.

## Getting Started

### Prerequisites

- Node.js

### Installation

1. Clone the Repository:

   ```bash
   git clone https://github.com/KaungKhantKyaw1997/nihongo-x.git
   cd nihongo-x
   ```

2. Install Dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file with your Node environment.

### Running the Application

To start the server, run:

```bash
npm start
```

### API Documentation

The API is documented using **Swagger**. You can access the documentation at:

```bash
http://localhost:3000/api-docs
```

## API Endpoint

- **Get a Random Character (Japanese)**:

  - `GET /api/jpn-random-character/{type}?level={level}&count={count}`

- **Get a Random Character (English)**:

  - `GET /api/eng-random-character/{type}?level={level}&count={count}`
