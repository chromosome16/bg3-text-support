# bg3-text-support
Language support for BG3 text files.

Didnt realise there were a few up on github already for vscode, and in the extension market, but this one is for the one here: https://www.nexusmods.com/baldursgate3/mods/2594?tab=description, and will allow me to add functionality not found in those, like showing handle english text (and potentially in the future, uuids) on hover.

# Features
- Syntax highlighting
- Snippets
- Handles shown on hover (both txt and xml, but xml requires you first open a txt to activate the extension, to be addressed)
- Facufierro's document formatter (Thanks!)

# Commands
Format Document: Shift+Alt+F  

Build Handle References: Ctrl+Shift+P (Command Pallete) - search 'BG3: Build Handle References'

The handle references take up a few hundred MB of memory, so to avoid that when working with other text files in vscode you will need to run this command to generate the handles on hover, or if you add any new ones. 

