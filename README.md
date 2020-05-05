# Situs

[![Circle CI](https://circleci.com/gh/fians/situs.png?style=badge)](https://circleci.com/gh/fians/situs)
[![NPM version](https://badge.fury.io/js/situs.svg)](http://badge.fury.io/js/situs)
![NPM version](http://img.shields.io/npm/dm/situs.svg)

Simple static site generator. Just it.

## Getting Started

Install Situs via npm.

```
~ $ npm install situs -g 
```

Go to your static site directory.

```
~ $ cd your-directory
```

Then fire the development server! Situs will watch your directory. So if you make change one of your files, Situs will rebuild your static site automatically.

```
~/your-directory $ situs server
```


## Usage

```
$ situs build
# Build your source directory and place it to destination. (default: ./situs)

$ situs server
# Start development server, watch for changes and rebuild source automatically.

$ situs help
# Print Situs command usage.

$ situs -v
$ situs --version
# Print Situs version.
```

## Configuration

By default, Situs is able run without any configuration. But, if you want something advance, you can store the configuration on situs.json.

__situs.json (default):__

```
{
  "source": "./",
  "destination": "./situs",
  "ignore": [
    "node_modules/**/*"
  ],
  "markdown": false,
  "permalink": false,
  "port": 4000,
  "global": {}
}
```

| Parameter     | Value     | Description                                                                |
|---------------|-----------|----------------------------------------------------------------------------|
| `source`      | _string_  | Source directory of static site                                            |
| `destination` | _string_  | Destination directory of static site for compiled source files             |
| `ignore`      | _array_   | List of glob pattern to prevent files or directory to be compiled by Situs |
| `markdown`    | _boolean_ | Render markdown to html. If it set `false`, markdown file will not converted to be html when you build source.|
| `permalink`   | _boolean_ | Enable permalink/pretty url                                                |
| `port`        | _integer_ | Port of development server                                                 |
| `global`      | _object_  | Global variable that will be rendered to source files                      |

You can also overide default configuration directly from command line. 

```
# Set local development port
$ situs build --port=4000

# Set source directory
$ situs build --source=./path/to/dir

# Set destination directory
$ situs build --destination=./path/to/dir

# Enable markdown parser
$ situs build --markdown

# Enable permalink (pretty-url)
$ situs build --permalink
```

## Built-in Function

### Handlebars template

Situs is using Handlebars to render data and also include some additional helpers function like,

__{{#escape}}__ : Used for escaping html string, especially in html file. Example:

```
{{#escape}}
<html>
</html>
{{#escape}}

# Will be rendered to
&lt;html&gt;
&lt;/html&gt;
```
__{{#code}}__ : Used for escaping code and also wrapping it inside `<pre>` and `<code>`. Example:

```
{{#code}}
<html>
</html>
{{#code}}

# Will be rendered to
<pre><code>&lt;html&gt;
&lt;/html&gt;
</code></pre>

# You can also add class in your <code> tag (usually for syntax highlighter)
{{#code class="lang-html"}}
<html>
</html>
{{#code}}

# Will be rendered to
<pre><code class="lang-html">&lt;html&gt;
&lt;/html&gt;
</code></pre>
```

For other Handlebars helper, please visit http://handlebarsjs.com/.

### `@situs-include(filePath)`

You can include other file inside a file, by passing relative path of the file to `@situs-include()`. This function is usefull when you needed to put same content in several source files. Situs will raise an error, if included file is not found.

__Example:__

_index.html_

```html
<html>
  @situs-include(./header.html)
  <body>
  </body>
</html>
```

_header.html_

```html
<head>
  <title>Sample situs page</title>
</head>
```

_Output:_

```html
<html>
  <head>
    <title>Sample situs page</title>
  </head>
  <body>
  </body>
</html>
```

### `@situs-data(jsonString)`

`@situs-data()` allows you to add local data directly on your file, same as Front Matter does in Jekyll. To use it, you have to insert JSON string as parameter.

__Example:__

_index.html_

```html
@situs-data({
  "title": "Sample situs page"
})
<html>
  <head>
    <title>{{ title }}</title>
  </head>
  <body>
  </body>
</html>
```
_Output:_

```html
<html>
  <head>
    <title>Sample situs page</title>
  </head>
  <body>
  </body>
</html>
```

If you included a file, `@situs-data()` also render the local data to include file.

__Example:__

_index.html_

```html
@situs-data({
  "title": "Sample situs page"
})
<html>
  @situs-include(./header.html)
  <body>
  </body>
</html>
```

_header.html_

```html
<head>
  <title>{{ title }}</title>
</head>
```

_Output:_

```html
<html>
  <head>
    <title>Sample situs page</title>
  </head>
  <body>
  </body>
</html>
```

### `@situs-ignore()`

Situs also provide `@situs-ignore()` if you want to ignore a file manually, without specifying the file in situs.json. Just place `@situs-ignore()` anywhere inside your file.

__Example:__

_Directory structure (before build)_

```
- \main-directory
    - \destination
      - (empty)
    - \source
      - index.html
      - page.html
```

_page.html_

```html
@situs-ignore()

<html>
  <head>
    <title>Sample page</title>
  </head>
  <body>
  </body>
</html>
```

_Build your source_

```
~\main-directory $ situs build
```

_Directory structure (after build)_

```
- \main-directory
    - \destination
      - index.html
    - \source
      - index.html
      - page.html
```

## License

Situs released under [MIT license](https://github.com/fians/situs/blob/master/LICENSE). 2014-2020 &copy; Alfiana Sibuea. All right reserved.
