# Paint

Draw on canvas with any colour and different brush sizes. Undo/redo and zoom in/out as well as grab and move in case canvas protrudes the viewport. Save projects either locally as a `.jpg` or create an account, login and save to the database. Authentication using JWT and saving to MongoDB. Share the unique link to your project with anyone, but only if your privacy settings allows it.

## Setup

Rename the `.env.example` to `.env` and provide a MongoDB Connection String URI as well as any token secret you would like.

```bash
# Install dependencies
$ yarn install

# Terminal 1: Run frontend development server
$ yarn dev

# Terminal 2: Run backend server
$ yarn server
```

## Screenshot

![](https://user-images.githubusercontent.com/72305598/147144482-bd245f9f-bb78-413c-ade9-f0e548aeb76a.png)
