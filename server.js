const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cheerio = require('cheerio');

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

const removeUnwantedElements = (html) => {
  const $ = cheerio.load(html);
  $('.ytp-chrome-top').remove(); // Remove ytp-chrome-top and its sub-elements
  $('.ytp-watermark').remove();  // Remove ytp-watermark and its sub-elements
  return $.html();
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
          src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&controls=0&showinfo=0&disablekb=1&fs=0&modestbranding=0&playsinline=1&loop=1&playlist=dQw4w9WgXcQ&controls=0&enablejsapi=1" 
          allow="autoplay" 
          allowfullscreen 
          style="width: 50vw; height: 50vh; border: none; display: block; margin: 0 auto; pointer-events: none;"
        ></iframe>
      </body>
    `,
    [process.env.CODE2]: `
        <body style="margin: 0; padding: 0; overflow: hidden;">
        <iframe 
        src="https://www.youtube-nocookie.com/embed/de1L1iRIcqU?autoplay=1&controls=0&showinfo=0&disablekb=1&fs=0&modestbranding=0&playsinline=1&loop=1&playlist=de1L1iRIcqU&controls=0&enablejsapi=1" 
        allow="autoplay" 
        allowfullscreen 
        style="width: 50vw; height: 50vh; border: none; display: block; margin: 0 auto; pointer-events: none;"
        ></iframe>
    </body>
    `,
    [process.env.CODE3]: `
    <body style="margin: 0; padding: 0; overflow: hidden;">
    <iframe 
    src="https://www.youtube-nocookie.com/embed/XDMAO7sHMz0?autoplay=1&controls=0&showinfo=0&disablekb=1&fs=0&modestbranding=0&playsinline=1&loop=1&playlist=XDMAO7sHMz0&controls=0&enablejsapi=1" 
    allow="autoplay" 
    allowfullscreen 
    style="width: 50vw; height: 50vh; border: none; display: block; margin: 0 auto; pointer-events: none;"
    ></iframe>
    </body>
    `,
    [process.env.CODE4]: `
    <body style="margin: 0; padding: 0; overflow: hidden;">
    <iframe 
    src="https://www.youtube-nocookie.com/embed/lpPwLKWcHX0?autoplay=1&controls=0&showinfo=0&disablekb=1&fs=0&modestbranding=0&playsinline=1&loop=1&playlist=lpPwLKWcHX0&controls=0&enablejsapi=1" 
    allow="autoplay" 
    allowfullscreen 
    style="width: 50vw; height: 50vh; border: none; display: block; margin: 0 auto; pointer-events: none;"
    ></iframe>
    </body>
    `,
    [process.env.CODE5]: `
    <style>
    .container {
      position: relative;
      width: 50vw;
      height: 50vh;
      padding: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .background-image {
      position: absolute;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .overlay-image {
      position: absolute;
      width: 50%;
      height: 50%;
      top: 25%;
      left: 25%;
      object-fit: cover;
    }
    .timer {
      position: absolute;
      bottom: 10px;
      font-size: 2rem;
      background: rgba(0, 0, 0, 0.5);
      color: white;
      padding: 5px;
      border-radius: 5px;
    }
  </style>
</head>
<body>
  <div class="container">
    <img src="path/to/first-image.jpg" alt="Background" class="background-image">
    <img src="path/to/second-image.png" alt="Overlay" class="overlay-image">
    <div id="timer" class="timer"></div>
  </div>

  <script>
    const endTime = new Date("2024-08-10T00:00:00").getTime(); // Set your end time here

    function updateCountdown() {
      const now = new Date().getTime();
      const distance = endTime - now;
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      // Pad values with leading zeros if needed
      const formattedDays = days < 10 ? \`0\${days}\` : days;
      const formattedHours = hours < 10 ? \`0\${hours}\` : hours;
      const formattedMinutes = minutes < 10 ? \`0\${minutes}\` : minutes;
      const formattedSeconds = seconds < 10 ? \`0\${seconds}\` : seconds;

      // Update timer HTML
      document.getElementById('timer').innerHTML = distance < 0
        ? "NOW<br/><small>(REFRESH)</small>"
        : \`\${formattedDays}:\${formattedHours}:\${formattedMinutes}:\${formattedSeconds}\`;
    }

    setInterval(updateCountdown, 1000);
    updateCountdown(); // Initial call
  </script>
</body>
    `,
    [process.env.CODE6]: `
      <div style="width: 50vw; height: 50vh; padding: 10px;">
        <p>Content for CODE6</p>
      </div>
    `,
    [process.env.CODE7]: `
      <div style="width: 50vw; height: 50vh; padding: 10px;">
        <p>Content for CODE7</p>
      </div>
    `,
    [process.env.CODE8]: `
      <div style="width: 50vw; height: 50vh; padding: 10px;">
        <p>Content for CODE8</p>
      </div>
    `,
    [process.env.CODE9]: `
      <div style="width: 50vw; height: 50vh; padding: 10px;">
        <p>Content for CODE9</p>
      </div>
    `,
    [process.env.CODE10]: `
      <div style="width: 50vw; height: 50vh; padding: 10px;">
        <p>Content for CODE10</p>
      </div>
    `,
    [process.env.CODE11]: `
      <div style="width: 50vw; height: 50vh; padding: 10px;">
        <p>Content for CODE11</p>
      </div>
    `,
    [process.env.CODE12]: `
      <div style="width: 50vw; height: 50vh; padding: 10px;">
        <p>Content for CODE12</p>
      </div>
    `,
    [process.env.CODE13]: `
      <div style="width: 50vw; height: 50vh; padding: 10px;">
        <p>Content for CODE13</p>
      </div>
    `,
    [process.env.CODE14]: `
      <div style="width: 50vw; height: 50vh; padding: 10px;">
        <p>Content for CODE14</p>
      </div>
    `,
    [process.env.CODE15]: `
      <div style="width: 50vw; height: 50vh; padding: 10px;">
        <p>Content for CODE15</p>
      </div>
    `,
    [process.env.CODE16]: `
      <div style="width: 50vw; height: 50vh; padding: 10px;">
        <p>Content for CODE16</p>
      </div>
    `,
    [process.env.CODE17]: `
      <div style="width: 50vw; height: 50vh; padding: 10px;">
        <p>Content for CODE17</p>
      </div>
    `,
    [process.env.CODE18]: `
      <div style="width: 50vw; height: 50vh; padding: 10px;">
        <p>Content for CODE18</p>
      </div>
    `,
    [process.env.CODE19]: `
      <div style="width: 50vw; height: 50vh; padding: 10px;">
        <p>Content for CODE19</p>
      </div>
    `,
    [process.env.CODE20]: `
      <div style="width: 50vw; height: 50vh; padding: 10px;">
        <p>Content for CODE20</p>
      </div>
    `,
  };

  if (validCodes[normalizedCode]) {
    const html = validCodes[normalizedCode];
    const cleanedHtml = removeUnwantedElements(html);
    res.status(200).send(cleanedHtml);
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
