import http from 'http';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';

const port = process.env.PORT || 8080;
const netdataUrl = process.env.NETDATAURL;

const app = express();
app.server = http.createServer(app);

// body parser and cors middlewares
app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(bodyParser.json());

app.get('/script.js', (req, res) => {
  const content = `var script = document.createElement("script");
script.src = "${netdataUrl}/dashboard.js";
document.head.appendChild(script);`;

  res.setHeader('Content-type', 'application/octet-stream');

  res.send(content);
});

app.use((req, res) => {
  switch (req.query.widget) {
    case 'cpu':
      return res.sendFile(path.resolve(__dirname, '../', 'dashboards/widgets/cpu.html'));
    case 'disk':
      return res.sendFile(path.resolve(__dirname, '../', 'dashboards/widgets/disk.html'));
    case 'ram':
      return res.sendFile(path.resolve(__dirname, '../', 'dashboards/widgets/ram.html'));
    case 'all':
      return res.sendFile(path.resolve(__dirname, '../', 'dashboards/widgets/all.html'));
    default:
      res.sendFile(path.resolve(__dirname, '../', 'dashboards/index.html'));
  }
});

// starting actual server
app.server.listen(port);

console.log(`Started on port ${app.server.address().port}`); // eslint-disable-line no-console
