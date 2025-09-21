import type { Project } from '../types';

type Props = {
  project: Project;
};

export function ProjectCard({ project }: Props) {
  return (
    <a className="card" href={project.href} target="_blank" rel="noreferrer">
      <div className="card__media">
        <img src={project.imageUrl} alt="Project preview" />
      </div>
      <div className="card__body">
        <div>
          <h3 className="card__title">{project.title}</h3>
          <p className="card__meta">{project.category}</p>
        </div>
        <button className="card__button" aria-label={`View ${project.title}`}>View</button>
      </div>
    </a>
  );
}

export default ProjectCard;

