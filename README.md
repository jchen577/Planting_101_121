# Devlog Entry - [11/13/2024]

## Intro: The Team
- **Tools Lead**: Jacky and Kenny
- **Engine Lead**: Ethan and Jasmine
- **Design Lead**: Ethan

## Tools and Materials
We have selected the following tools and materials for our project:

- **Game Engine**: **Phaser**  
  We chose Phaser as our game engine because it is an open-source, 2D game framework built with JavaScript and TypeScript. Phaser has many built-in functions and libraries that can help create games that may rely on a lot of visual effects and physics-based interactions. Our team is already familiar with Phaser from previous projects, and its extensive documentation and active community made it an obvious choice for the engine. We also have a good amount of experience in prototyping in Phaser, which will allow us to iterate on ideas quickly and effectively.

- **Libraries**: **Noise Library**  
  In order to implement some sort of procedural generation into our game, we will be using a Noise Library in order to gain access to things such as Perlin and Simplex noise.

- **Programming Languages**: **TypeScript & JSON**  
  For programming languages, we will primarily use TypeScript, as it provides type safety and is highly compatible with Phaser. It is also very compatible with the object-oriented programming used in games. As for data languages, we will use JSON to store and manage game data. JSON will be used as a way to store level data and player data.

- **Tools**: **Visual Studio Code & Tiled**
  We will be using Visual Studio Code as our IDE because it is simply what we all use and are comfortable with. Additionally, VS Code has many useful plugins and features that will help streamline our development process. For map design, we will use Tiled, a versatile map editor that integrates well with Phaser. We have used Tiled in the past and find it effective for creating tiled-based game maps.

- **Alternate Platform**: **Javascript**
  For our alternate platform, we will be transitioning from TypeScript to JavaScript.

## Outlook
Our team is hoping to accomplish integrating some form of procedural content generation in our game in order to make it feel fresh and unpredictable. We aim to create a game world that dynamically responds to player actions, ensuring that no two playthroughs feel the same. By utilizing tools like the Noise Library and Phaser, we expect to develop a game environment that evolves and surprises the player.

We anticipate that implementing procedural generation and ensuring that it integrates smoothly with our game’s mechanics will be the most challenging aspect of the project. Balancing randomness and creating a compelling yet consistent experience will require careful tuning. Unpredictable player actions may also lead to unforseen challenges and bugs. Additionally, transitioning from TypeScript to JavaScript may introduce some technical hurdles as we adapt our codebase to the new environment.

## F0 Software Requirements: 
[F0.a] You control a character moving over a 2D grid.
[F0.b] You advance time manually in the turn-based simulation.
[F0.c] You can reap or sow plants on grid cells only when you are near them.
[F0.d] Grid cells have sun and water levels. The incoming sun and water for each cell is somehow randomly generated each turn. Sun energy cannot be stored in a cell (it is used immediately or lost) while water moisture can be slowly accumulated over several turns.
[F0.e] Each plant on the grid has a distinct type (e.g. one of 3 species) and a growth level (e.g. “level 1”, “level 2”, “level 3”).
[F0.f] Simple spatial rules govern plant growth based on sun, water, and nearby plants (growth is unlocked by satisfying conditions).
[F0.g] A play scenario is completed when some condition is satisfied (e.g. at least X plants at growth level Y or above).