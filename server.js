const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const helmet = require('helmet');

dotenv.config();

const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(helmet());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

const normalizeCode = (code) => {
  return code
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
};

app.post('/', (req, res) => {
  const code = req.body.code;

  if (typeof code !== 'string') {
    return res.status(400).json({ success: false, message: 'Invalid code format' });
  }

  const normalizedCode = normalizeCode(code);

  const validCodes = {
    [process.env.CODE1]: `
      <body style="margin: 0; padding: 0; overflow: hidden;">
        <iframe 
          src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&controls=0&disablekb=1&fs=0&modestbranding=1&playsinline=1&loop=1&playlist=dQw4w9WgXcQ" 
          allow="autoplay" 
          allowfullscreen 
          style="width: 50vw; height: 50vh; border: none; display: block; margin: 0 auto;"
        ></iframe>
      </body>
    `,
    [process.env.CODE2]: `
      <div style="width: 50vw; height: 50vh; overflow: auto; padding: 10px;">
        <p>Example Content 2</p>
      </div>
    `,
  };
  
  if (validCodes[normalizedCode]) {
    res.status(200).send(validCodes[normalizedCode]);
  } else {
    res.status(404).json({ success: false, message: 'Invalid code' });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
