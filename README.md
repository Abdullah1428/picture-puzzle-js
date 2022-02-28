# Picture Puzzle Game

A simple picture puzzle game built with plain JS, HTML, CSS and HTML Drag and Drop API

### Some Points about the Game
  
1) Level of Difficulty is based on the number of puzzle pieces. For Easy level the puzzle pieces will be 9, for Medium Level it will be 16 and for Hard Level it is 25.
2) Timer starts when the window is loaded.
3) Dragging and Dropping a image block is counted as a step.
4) Change Image button reloads the window and game is restarted with new image from unsplsah api.


### Future improvments

This is a very basic version of the game working for now.
There is alot of room for improvments, some of the improvments can be

```
Having a Score board (history of high scores)
Responsivness (working on different devices)
Better code structure and reuseability
Giving option to users to insert their own images for the puzzle
Showing better messages for User experience.
Better Image API to support puzzle pictures
```

### HOW TO SETUP

## Prerequisites

- [Node.js](https://nodejs.org/) (version 14.x or newer)

## Development

First install dependencies:

```sh
npm install
```

### Running in development mode

To start the project in development mode:

```sh
npm start
```

### Testing

To run unit tests:

```sh
npm test
```

## Deployment

To create a production build:

```sh
npm run build
```

Preview the production build locally:

```sh
npx http-serve dist
```
