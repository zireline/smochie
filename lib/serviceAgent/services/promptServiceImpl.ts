import inquirer from 'inquirer';
import { Project } from '../../core/project/project.js';
import { validateRepositories } from '../../core/util/validateRepositories.js';
import path from 'path';

export class PromptServiceImpl {
  async selectProjects(projects: Project[]): Promise<Project[]> {
    const choices = projects.map((project) => ({
      name: project.name,
      value: project,
    }));

    const { selectedProjects } = await inquirer.prompt([
      {
        type: 'checkbox',
        message: 'Select projects to clone:',
        name: 'selectedProjects',
        choices,
      },
    ]);

    return selectedProjects;
  }

  async confirmSelection(message: string): Promise<boolean> {
    const { confirmed } = await inquirer.prompt([
      {
        type: 'confirm',
        message,
        name: 'confirmed',
      },
    ]);
    return confirmed;
  }

  async createProject(): Promise<Project> {
    const name = await this.requestName();
    const repositories = await this.requestRepositories();

    await validateRepositories(repositories);

    return new Project(name, repositories);
  }

  private async requestName(): Promise<string> {
    const { name } = await inquirer.prompt([
      {
        type: 'input',
        message: 'Enter the name of the project:',
        name: 'name',
      },
    ]);
    return name;
  }

  private async requestRepositories(
    repositories: string[] = []
  ): Promise<string[]> {
    const { repository } = await inquirer.prompt<{ repository: string }>([
      {
        type: 'input',
        message: 'Enter repository URL (submit an empty string to exit):',
        name: 'repository',
      },
    ]);

    if (repository === '') {
      return repositories;
    }

    return this.requestRepositories([...repositories, repository]);
  }

  async promptWorkspaceName(): Promise<string> {
    const { name } = await inquirer.prompt([
      {
        type: 'input',
        message: 'Enter the name of the workspace:',
        name: 'name',
      },
    ]);
    return name;
  }

  async promptExcludedFolders(folders: string[]): Promise<string[]> {
    const choices = folders.map((folder) => ({
      name: path.basename(folder),
      value: folder,
    }));

    const { excludedFolders } = await inquirer.prompt([
      {
        type: 'checkbox',
        message: 'Select folders to exclude:',
        name: 'excludedFolders',
        choices: choices,
      },
    ]);

    return excludedFolders;
  }

  async promptIncludedFolders(folders: string[]): Promise<string[]> {
    const choices = folders.map((folder) => ({
      name: path.basename(folder),
      value: folder,
    }));

    const { includedFolders } = await inquirer.prompt([
      {
        type: 'checkbox',
        message: 'Select folders to include:',
        name: 'includedFolders',
        choices: choices,
      },
    ]);

    return includedFolders;
  }
}
