![Built With Stencil](https://img.shields.io/badge/-Built%20With%20Stencil-16161d.svg?logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjIuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MTIgNTEyOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI%2BCjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI%2BCgkuc3Qwe2ZpbGw6I0ZGRkZGRjt9Cjwvc3R5bGU%2BCjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00MjQuNywzNzMuOWMwLDM3LjYtNTUuMSw2OC42LTkyLjcsNjguNkgxODAuNGMtMzcuOSwwLTkyLjctMzAuNy05Mi43LTY4LjZ2LTMuNmgzMzYuOVYzNzMuOXoiLz4KPHBhdGggY2xhc3M9InN0MCIgZD0iTTQyNC43LDI5Mi4xSDE4MC40Yy0zNy42LDAtOTIuNy0zMS05Mi43LTY4LjZ2LTMuNkgzMzJjMzcuNiwwLDkyLjcsMzEsOTIuNyw2OC42VjI5Mi4xeiIvPgo8cGF0aCBjbGFzcz0ic3QwIiBkPSJNNDI0LjcsMTQxLjdIODcuN3YtMy42YzAtMzcuNiw1NC44LTY4LjYsOTIuNy02OC42SDMzMmMzNy45LDAsOTIuNywzMC43LDkyLjcsNjguNlYxNDEuN3oiLz4KPC9zdmc%2BCg%3D%3D&colorA=16161d&style=flat-square)

# UNLV Online Education Components

This is a library of custom web components built by UNLV Online Education using <a href="https://github.com/ionic-team/stencil" target="_blank">Stencil</a>. These components are 100% standards compliant (Custom Elements v1 spec) and will work in any major framework or with no framework at all.

## Getting Started

### Using the library *with* a framework

1. Install:
   ```bash
   npm install @unlv-oe/components --save
   ```

2. See the Stencil docs on how to integrate our library with your favorite framework:
   * <a href="https://stenciljs.com/docs/angular" target="_blank">Angular</a>
   * <a href="https://stenciljs.com/docs/react" target="_blank">React</a>
   * <a href="https://stenciljs.com/docs/vue" target="_blank">Vue</a>
   * <a href="https://stenciljs.com/docs/ember" target="_blank">Ember</a>

### Using the library *without* a framework

1. If you're using a simple HTML page, you can add our library via a script tag and start using our components:
   ```html
   <script src="https://unpkg.com/@unlv-oe/components@latest/dist/unlv-oe-components/unlv-oe-components.js"></script>
   ```
   See the <a href="https://stenciljs.com/docs/javascript" target="_blank">Stencil docs</a> for more information.

## Available Components

### Feedback Button

```html
<unlv-oe-feedback-button src="YOUR_QUALTRICS_URL"></unlv-oe-feedback-button>
```

[Feedback Button Properties](src/components/feedback-button/readme.md)
