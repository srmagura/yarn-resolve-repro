\*\*\* = breaking change

# 2.0.3

- \*\*\* LOTS of core changes
- \*\*\* Remove `DataUpdater`, `IDataUpdater`, and `AutoRefreshDataUpdater`.  
    - They can now be found in `@interface-technologies/iti-react-v1-legacy`
- \*\*\* Remove `childValidChange` and `onChildReady`
    - They can now be found in `@interface-technologies/iti-react-v1-legacy`
    - Instead, use `useFieldValidity` or `useReadiness` respectively
- \*\*\* Remove `withValidation`. Converted `PersonNameInput`, `TimeInput`, `DateInput`, and `PhoneInput` to `useValidation`.
- \*\*\* `PersonNameInput`: `disabled` is no longer allowed in `inputAttributes`. Use the `enabledInputs` prop instead.
- \*\*\* Move source code into `src` directory - deep imports will need to be changed.
- \*\*\* Remove `CustomLoadable` - use `React.lazy` instead. Recommended migration:   
    1. Use `export default` for all `Page` components
    2. Replace all calls to `CustomLoadable` with `React.lazy`
    3. Wrap the React Router `<Switch />` with `<Suspense fallback={null} />`
- \*\*\* Remove export `formToObject`
- \*\*\* `SubmitButton`: change `disabled-link` class to `disabled`. Add CSS rule to set `pointer-events: none` on links with the class `disabled`.  
- `EasyFormDialog`: using `formData` in `onSubmit` has been deprecated.
- Add function `getGenericEasyFormDialog<TResponseData>()`
- Add `TestHelpers` module that exports a function called `waitForReactUpdates`
- LOTS of small changes to fix eslint errors

## v2 Migration Plan
See `iti-react-core` migration plan too.  

These changes can be made gradually:  
1. Change all imports of `DataUpdater`, `IDataUpdater`, `AutoRefreshDataUpdater`, `childValidChange`, and `onChildReady` to be from `@interface-technologies/iti-react-v1-legacy`
2. Use `React.lazy` to import pages instead of `CustomLoadable`. Update the page modules to default export the page.
3. If `formToObject` is used, copy it into your codebase and update the imports.

Then:
4. Update `iti-react` to `2.0.0`.
5. Fix any deep imports that where broken by moving the `iti-react` code into a `src` folder.
6. Update usages of `PersonNameInput` where `disabled` is passed in `inputAttributes`. Use the `enabledInputs` prop instead.
7. Update any styles or JSX that refers to the old `disabled-link` class.

# 2.0.4

- \*\*\* Rename query hooks:  
    - `useParameterizedQuery` -> `useQuery`
    - `useParameterizedAutoRefreshQuery` -> `useAutoRefreshQuery`
    - `useQuery` -> `useParameterlessQuery`
    - `useAutoRefreshQuery` -> `useParameterlessQuery`
- `useAsyncValidator`: don't asynchronously update the component if `asyncValidator` is `undefined`.  

# 2.0.5

- CSS fix: prevent disabled links that have a text color class (e.g. `text-danger`) from
  retaining their original color when disabled (red in the case of `text-danger`)

# 2.0.6

- Core changes only

# 2.0.7

- Update packages

# 2.0.8

- \*\*\* Remove `easyFormDialog` key from `ItiReactContextData`. `ItiReactCoreContextData.onError` is used instead.
- Core changes

# 2.0.9

- `Dialog`: don't add multiple event listeners if `onClose` changes

# 2.0.10

- Core changes only

# 2.0.11

- Core changes only

# 2.0.12

- `Select` components: only search the `label` when filtering

# 2.0.13

- CSS fix: Disabled link color was incorrectly being applied to disabled buttons
- Core changes

# 2.1.0

- Update dependencies. You now need to add `declare module 'input-format/react'` to your `.d.ts` file.

# 2.1.1

- Fix providing the same prop twice in a few places to prevent TS 3.9 compile error

# 2.1.3

- Core changes only

# 2.1.4

- Core changes
- \*\*\* `Dialog`: rename `modalClassName` prop to `modalClass`

# 2.1.5

- `AddressInput`: Add `<div className="state-select">` around state Select to support Cypress tests

# 2.1.6

- `Pager`: use `React.memo`
- `ValidatedAsyncSelect`: allow `loadOptions` to return `GroupType<SelectOption>[]`

# 2.1.7

- `confirm`, `alert`: Add `modalClass` option

# 2.1.8

- `ValidatedSelect`, `ValidatedAsyncSelect`: fix uncontrolled->controlled warning that occurred when the value of a disabled select was changed

# 2.1.9

- `Dialog`, `ActionDialog`: add optional prop `onOpen`

# 2.2.0

- Remove dependency `@types/moment-timezone`
- Update dependencies

# 2.2.1

- \*\*\* Make the standalone `ConfirmDialog` component actually work in a useful way

# 2.2.2

- Remove line of code where `Dialog` called `modal('hide')` as it was unmounting

# 2.2.3

- Added `cancelButtonText?: string` prop to `EasyFormDialog`

# 2.2.5

- Make `AddressDisplay` tolerant to null/undefined address properties

# 2.2.6

- \*\*\* `TestHelpers`: export `waitForReactUpdatesFactory` instead of the "magic" thing it did before

# 2.3.1

- Add `FormGroup`, `MoneyInputContainer`, `UnitInputContainer`, and `Breadcrumbs`

# 2.3.2

- Add `FileInput`

# 2.3.3

- \*\*\* `dateInputValueFromMoment`:  
    - Don't do time zone conversion if `includesTime` is false
    - Restrict type of `options` argument accordingly
- Memoize `DateInput`

# 2.3.4

- Core changes only

# 2.3.5

- \*\*\* Go back to using `@use-it/event-listener` instead of my fork  
- Bring in `usePopoverClickListener`  
- Core changes  

# 2.3.6

- Core changes only

# 2.3.9

- Core changes only

# 2.3.10

- Update to latest `@types/react-select` - required code changes  

# 2.4.10

- Package updates
- Upgrade to Bootstrap 5
- DateInput fix
- Add form-group style
- Upgrade Dialog component to Bootstrap 5

# 2.4.11

- Fix confirm dialog focusing the close button by default  
- Add `cleanupImproperlyClosedDialog`

# 2.4.12

- Make form-group labels have `display: block`  
- Change select placeholder color  

# 2.4.13

- Bring in `form-group-horizontal-with-checkbox` and `form-group-stacked-with-checkbox` styles

# 2.4.15

- Fix weird issue with `usePopoverClickListener`

# 2.4.16

- Core changes only

# 2.5.0

- Bring in `.tab-content` and `.tab-content-loading` styles

# 2.5.1

- Core changes only

# 2.5.2

- Add `.form-group.optional` styles

# 2.5.3

- `TabLayout`, `TabManager`: add `className` prop

# 2.5.4

- \*\*\* Remove `dialog` key from `ItiReactContextData`
- Fix some color variables in CSS

# 2.5.5

- Implement debouncing in `ValidatedAsyncSelect`

# 2.5.6

- New `TimeZoneInput`

# 2.5.7

- `TimeZoneInput` fixes

# 2.5.8

- Turn off autocomplete for DateInput

# 2.5.9

- `TimeZoneInput` enabled prop

# 2.5.11

- Core changes only

# 2.5.12

- `TimeZoneInput` formControlSize prop

# 2.5.13

- Call `cleanupImproperlyClosedDialog` on ready to enable dialogs with links
- Remove `CustomBreadcrumbs`
- Replace `copyToClipboard` implementation with `copy-to-clipboard` from npm

# 2.6.0

- `DateInput`: remove `onBlur` handler to prevent unnecessary `onChange` calls
- Update packages

# 2.6.1

- `ValidatedSelect`: add `menuPlacement` prop
- Sass: `math.div`

# 2.6.2

- Use Font Awesome React component

# 2.6.3

- `ValidatedInput`: `form-select` class when type="select"

# 2.6.4

- `DateInput`: add `filterDate` prop

# 2.6.5

- `TabManager`: add `mountAllTabs` prop

# 2.6.6

- `TimeInput`: use `React.memo`

# 2.6.7

- Move `@popperjs/core` and `bootstrap` to peerDependencies