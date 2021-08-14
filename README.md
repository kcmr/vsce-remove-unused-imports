# Remove Unused Imports

VS Code extension to remove unused ES6 imports inside JavaScript and TypeScript files (`.js`, `.jsx`, `.ts` and `.tsx` extensions) without changing the current order, as opposed to the built-in VS Code "Organize Imports" functionality.

![Remove Unused Imports screenshot](images/remove-unused-imports.gif)

## Usage

- **Open the Command Palette** (`Ctrl/Cmd + Shift + P`)
- Search for **Remove Unused Imports**

### Keybinding

This extension **does not provide any keybinding** for the command. You can assign your own custom keybinding for it by pressing the cog icon that appears to the right of the command name in the Command Palette.

## Known issues

The format of the document may change after running this command. For instance, final semicolons are added to the modified imports.

## Acknowledgments

This extension is inspired by [vsc-sort-imports](https://github.com/amatiasq/vsc-sort-imports).

## License

This project is licensed under the [MIT License](LICENSE).
