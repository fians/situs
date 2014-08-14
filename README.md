# Situs

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

By default, Situs is able run without any configuration. But, if you want something advance, you can store the configuration on situs.json right on your source directory.

__situs.json (default):__

```
{
  "source': "./",
  "destination": "./situs",
  "ignore": [
    "node_modules/**/*"
  ],
  "port": 4000,
  "global": {}
}
```

| Parameter     | Value     | Description                                                                |
|---------------|-----------|----------------------------------------------------------------------------|
| `source`      | _string_  | Source directory of static site                                            |
| `destination` | _string_  | Destination directory of static site for compiled source files             |
| `ignore`      | _array_   | List of glob pattern to prevent files or directory to be compiled by Situs |
| `port`        | _integer_ | Port of development server                                                 |
| `global`      | _object_  | Global variable that will be rendered to source files                      |

## Built-in Function

### Handlebars template

Situs is using Handlebars to render data. So you can use any default template utility of Handlebars on your source files. Visit http://handlebarsjs.com/ for more information.

### `@situs-include()`

You can include other file inside a file, by passing relative path of the file to `@situs-include()`. This function is usefull when you needed to put same content in several source files. Situs will raise an error, if included file is not found.

__Example:__

_Directory structure:_

```
- /your-directory
  - index.html
  - header.html
```

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
  <title>Sample site</title>
</head>
```

_Result_

```html
<html>
  <head>
    <title>Sample site</title>
  </head>
  <body>
  </body>
</html>
```

### @situs-data()

### @situs-ignore()

To be continued..
