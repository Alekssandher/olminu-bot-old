> ⚠ **Warning:** This repository is no longer maintained.  
> Please check out the new version of Olminu Bot at:  
> [https://github.com/Alekssandher/olminu-bot/](https://github.com/Alekssandher/olminu-bot/)

<div align="center">
    
# Olminu Bot  
![olminu](https://github.com/user-attachments/assets/8f32c400-78f9-4a52-b657-65e6e6b87cbf)


**Olminu Bot** is a Discord bot developed using Eris.js.


![GitHub package.json version](https://img.shields.io/github/package-json/v/Alekssandher/Olminu-Bot?style=flat-square)
![GitHub License](https://img.shields.io/github/license/Alekssandher/Olminu-Bot?style=flat-square)
![Contributors](https://img.shields.io/github/contributors/Alekssandher/Olminu-Bot?style=flat-square)
![Last Commit](https://img.shields.io/github/last-commit/Alekssandher/Olminu-Bot?style=flat-square)

</div>

---

### Why Olminu?
The bot is named after Olminu, a character from the manga *Drifters*. As a fan of the character, I chose to name the bot in her honor.

## Table of Contents
- [Inviting Bot](#inviting-bot)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Setting Up](#setting-up)
- [Running the Project](#running-the-project)
- [Registering Slash Commands](#registering-slash-commands)
- [Contribution](#contribution)
- [Terms of Use](#terms)
- [License](#license)

## Inviting Bot
You can add Olminu to your Discord server by following this [link](https://discord.com/oauth2/authorize?client_id=1303531869878358036) and inviting her.

## Prerequisites
- [Node.js](https://nodejs.org/) (version 20.18 or higher)

## Installation

1. Clone this repository:
    ```bash
    git clone https://github.com/Alekssandher/Olminu-Bot.git
    ```
2. Navigate to the project directory:
    ```bash
    cd Olminu-Bot
    ```
3. Install the dependencies:
    ```bash
    npm install
    ```

## Setting Up

1. Log in to the [Discord Developer Portal](https://discord.com/developers) and create a new application.
> **Note**: Make sure to configure it properly.
3. Create a `.env` file in the root folder.
    - Check the `.env.example` file for the required variables.
4. Replace the placeholder values with your bot's credentials.

> **Note**: For testing, create a dedicated Discord server. Use the `GUILD_ID` environment variable to restrict commands to that server.

## Running the Project

Run the main file using one of the commands below.  

```bash
npm run dev:nodemon   # Runs the project with nodemon
ts-node main.ts       # Executes the TypeScript file directly
``` 

## Registering Slash Commands
Registering commands is simple. Use the `register-commands.ts` script provided in the repository.
Commands can be registered globally or restricted to a specific guild.

```
// To register guild commands
ts-node utils/register-commands.ts guild
```
```
// To register global commands
ts-node utils/register-commands.ts global
```
> Note: Global command registration might take up to an hour to propagate across all servers. Guild commands are updated instantly.
## Contribution
If you want to contribute to the project, feel free to open an issue or submit a pull request. All contributions are welcome!

## Terms
Make sure to be a good guy and follow or [terms of use](TERMS.md) when using our bot in your Discord server.
## License
This project is licensed under the GNU General Public License (GPL) version 3. You are free to use, modify, and distribute this software, provided that all copies and derivatives are also licensed under GPL v3.

For more details, see the [LICENSE](https://github.com/Alekssandher/Olminu-Bot?tab=GPL-3.0-1-ov-file#) file included in this repository.
