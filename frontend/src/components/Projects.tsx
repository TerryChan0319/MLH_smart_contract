import type { Project } from '../types';
import { ProjectCard } from './ProjectCard';

const projects: Project[] = [
  {
    id: 'ai-ecommerce',
    title: 'AI E-commerce Platform',
    category: 'Retail and E-Commerce',
    imageUrl: 'https://placehold.co/640x360/png?text=AI+E-commerce+Platform',
    href: '#',
  },
  {
    id: 'esg-portal',
    title: 'ESG Data Collection Portal',
    category: 'Financial Service, Technology and Consulting',
    imageUrl: 'https://placehold.co/640x360/png?text=ESG+Portal',
    href: '#',
  },
  {
    id: 'logistics-dos',
    title: 'Logistic Dos System',
    category: 'Transportation and Logistics',
    imageUrl: 'https://placehold.co/640x360/png?text=Logistics+App',
    href: '#',
  },
  {
    id: 'youth-hostel',
    title: 'Youth Hostel Health Cafe Blending',
    category: 'NGO, Youth Service',
    imageUrl: 'https://placehold.co/640x360/png?text=Health+Cafe+Blending',
    href: '#',
  },
];

export function Projects() {
  return (
    <section id="projects" className="projects container">
      <div className="projects__grid">
        {projects.map((p) => (
          <ProjectCard key={p.id} project={p} />)
        )}
      </div>
    </section>
  );
}

export default Projects;

