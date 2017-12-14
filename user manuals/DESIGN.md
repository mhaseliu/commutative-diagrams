

- used html, css, javascript, python, tikz, mimetex

Our project's files are located in a folder called "project." Under the main folder, we have three subfolders: cgi-bin, static,
templates, and user manuals. We also have our application, named application.py. Cgi-bin contains a file necessary for MimeTeX,
the LaTeX converter that we are using. Static contains our Javascript files and our CSS file. Templates contains our HTML file,
and finally user manuals includes documentation on the design and use of this project.

The websites's layout is written with HTML, as it allowed us to create a simple layout with buttons and the canvas on which
the user could draw. We used CSS to simplify some of the stylization of the HTML elements. For example, some of the initial
sizes, margins, and colors for various elements are placed into the CSS file to avoid cluttering the HTML file.

The website's main functionalities are all packed away in Javascript files. Javascript is essential to our project because the
canvas needs to be dynamically drawn and changed without the website reloading every time. In the "static" folder, arrow.js and
block.js respectively contain the code for our Javascript objects for arrows and blocks. In addition, export.js contains code
allowing the commutative diagram to be exported as LaTeX. Finally, scripts.js

Finally, the actual file running the program, application.py, is a short and simple Python file that loads up the website using
Flask. This allows us to easily compile and run the project on the CS50 IDE.