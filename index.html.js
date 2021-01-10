module.exports = {
    getIndexTemplate: (files) => {
        return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>All Sketches</title>
  <meta name="viewport" content="width=device-width, initial-scale=1"></head>
  <body>
    <style>
        body {
            font-size: 20px;
        }

        .container {
            margin: 40px;
        }

        a {
            display: block;
        }
    </style>

    <div class="container">
        <h1>Sketches</h1>

        <ul>
            ${files
                .map((name) => `<li><a href="/${name}.html">${name}</a></li>`)
                .join("\n")}
        </ul>
    </div>
  </body>
</html>`;
    },
};
