# Assessment

We've created a contemporary Angular application called ["assessment"](./assessment/README.md).

1. It gets ZIP codes from MongoDB documentation and allows filtering of them on screen.
3. We ask to unit-test search, with mocking one injectible.
2. There are leaks designed into the main component we ask to solve.

## Administer

1. Use your computer and run `code assesment`.
2. Create a branch with the _candidate's_ name.
    - Edit 📄 package.json in the 📁 assessment folder and change the `"start"` script's `--port` argument to a unique value for the applicant, _then commit on their branch_.
3. Run `npm start` and have them checkout the app-front page:
    - _Enter their name_ this will record their name and a "time of start" in local-storage on the browswer.
    - They can add their written answers inline on the page (also storing to local storage, and a stop time when "done" is clicked) or write these in their project README if that is more comfortable.
    