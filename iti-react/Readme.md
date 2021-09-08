A collection of utilities and React components covering:

-   Form validation
-   Form inputs for time, date, and phone number
-   DataUpdater classes that handle querying for data when the query parameters (e.g. filters and page number) change
-   Commonly-used components: Bootstrap modal dialog, confirmation dialog, pager, submit button with loading indicator

## Usage

_WARNING: Does not follow semver!_ Review Changelog.md before updating.

1.  `yarn add --exact @interface-technologies/iti-react`
2.  Install the required peer dependency: `yarn add react-datepicker`
3.  Add `@import '~@interface-technologies/iti-react/index';` to your top-level SCSS file.
4.  Add

        declare module 'input-format'
        declare module 'input-format/react'

    to your top-level `.d.ts` file.

## Developing iti-react

### Prequisites

1.  Visual Studio node.js workflow (from Visual Studio Installer)
2.  TypeWriter VS extension

### How to publish

Steps to do a new release are pretty standard:

1.  Document changes in Changelog.md.
2.  Commit all of your changes.
3.  `yarn npm publish --access public` while in the iti-react directory and bump the version number in the iteractive prompt. Yarn will create a git commit with the bumped version number and a git tag.
4.  `git push --tags` to push the tag to origin.

### Development tips

-   iti-react needs to compile when using Jest. Since Jest brings in @types/node, you must put `window` in front of setTimeout, setInterval, clearTimeout, and clearInterval. E.g. use `window.setTimeout` instead of `setTimeout`.
-   The solution uses yarn workspaces to link all the packages together. `yarn install` only needs to be run in the repository's root directory.
