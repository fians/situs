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

__Directory structure:__

```
/your-directory
  - index.html
  - page.html
  - situs.json
```

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

| Parameter | Value    | Description |
|-----------|----------|-------------|
| `source`  | _string_ | test        |

To be continued..
