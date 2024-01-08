# Assessment

We've created a contemporary full-stack solution:

## Angular UI

An Angular application called ["assessment"](./assessment/README.md).

1. It gets ZIP codes from MongoDB documentation and allows filtering of them on screen.
3. We ask to unit-test `search(...)`, with mocking one injectible.
2. There are leaks designed into the main component we ask to solve.


## Nest Backend

1. It loads a giant set of ZIP codes into a mongo database on launch.
2. It can filter entries by ZIP, city, or state.

## Administer

1. Use your computer and run `code assesment`.
2. Create a branch with the _candidate's_ name.
    - Edit 📄 package.json in the 📁 assessment folder and change the `"start"` script's `--port` argument to a unique value for the applicant, _then commit on their branch_.
3. Run `npm start` and have them checkout the app-front page:
    - _Enter their name_ this will record their name and a "time of start" in local-storage on the browswer.
    - They can add their written answers inline on the page (also storing to local storage, and a stop time when "done" is clicked) or write these in their project README if that is more comfortable.
4. Test coverage by running `npm test` (`npm run coverage` in assessment) and [reviewing](./assessment/coverage/assessment/) that both branches of code in `search` are covered.

# Scoring Concepts

## Presume we have 180 points to distribute to 3 major attributes:

| Technical Knowledge | Vision & Strategy | Focus & Discipline |
|---------------------|---------------------|--------------------|
| <ul><li>Specific knowledge of tech frameworks and libraries</li><li>Specific knowlege of TDD principles and techniques</li></ul> |  <ul><li>Application of knowledge</li><li>Understanding of ends being worked toward.</li><li>Preparation of delivery and deployment.</li><li>Thoughtful testing plans</li></ul> | <ul><li>Ability to complete tasks with focus on requirments</li><li>Work-prioritization</li><li>Pattern-recognition and re-use</li></ul> |

> [📑 See the Candidates Overall Scores](https://nastng-my.sharepoint.com/:x:/r/personal/gus_crawford_tngoc_com/Documents/Phoenix%20Skills%20Breakdown.xlsx?d=w470969e7c6b24235b4787aeb4b6dff89&csf=1&web=1&e=RaYx4L)