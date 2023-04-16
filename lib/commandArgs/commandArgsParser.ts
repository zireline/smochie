import { blueLogger } from '../core/util/blueLogger.js';

export class CommandArgsParser {
  parse(args: string[]) {
    const [command, ...commandArgs] = args;

    switch (command) {
      case 'clone':
        return this.handleCloneCommand(commandArgs);
      case 'create':
        return this.handleCreateCommand(commandArgs);
      default:
        throw new Error(`Invalid command: ${command}`);
    }
  }

  private handleCloneCommand(commandArgs: string[]) {
    const outputPath = this.getOutputPath(commandArgs);

    if (!outputPath) {
      throw new Error(`Output path is missing for 'clone' command`);
    }

    return { command: 'clone', outputPath };
  }

  private handleCreateCommand(commandArgs: string[]) {
    const subCommand = commandArgs[0];
    switch (subCommand) {
      case 'project':
        return { command: 'create-project' };
      case 'workspace':
        return { command: 'create-workspace' };
      default:
        throw new Error(`Invalid 'create' sub-command: ${subCommand}`);
    }
  }

  private getOutputPath(args: string[]) {
    let outputPath;

    if (args.length === 0) {
      // If no arguments are passed, use the current working directory as the output path
      outputPath = process.cwd();
    } else {
      // Look for the --path or -p flags
      for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        if (arg === '--path' || arg === '-p') {
          if (i + 1 >= args.length) {
            throw new Error(`Output path is missing after '${arg}' flag`);
          }
          outputPath = args[i + 1];
          break;
        }
      }
    }

    return outputPath;
  }
}