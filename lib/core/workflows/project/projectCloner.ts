import { ProjectRepository } from '../../repositories/projectRepository.js';
import { GitService } from '../../services/gitService.js';
import { PromptService } from '../../services/promptService.js';

export class ProjectCloner {
  constructor(
    private readonly projectRepository: ProjectRepository,
    private readonly gitService: GitService,
    private readonly promptService: PromptService
  ) {}

  async cloneSelectedProjects(outputDirectory: string): Promise<void> {
    const projects = await this.projectRepository.getAllProjects();
    const selectedProjects = await this.promptService.selectProjects(projects);

    const confirmed = await this.promptService.confirmSelection(
      `Are you sure you want to clone ${selectedProjects.length} projects?`
    );

    if (confirmed) {
      console.log('Cloning selected projects...');
      try {
        await this.gitService.cloneProjects(selectedProjects, outputDirectory);
      } catch (error) {
        console.warn(`Failed to clone projects using isomorphic-git: ${error}`);
        console.log('Trying to clone projects using the CLI...');
        this.gitService.cloneProjectsUsingCli(
          selectedProjects,
          outputDirectory
        );
      }
      console.log('Cloning completed.');
    } else {
      console.log('Aborting cloning process.');
    }
  }
}