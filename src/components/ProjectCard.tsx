import { ArrowUpRight, Github } from 'lucide-react'
import type { projects } from '../data/portfolio'

type Project = (typeof projects)[number]

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <article className={`project-card project-${project.visual}`}>
      <div className="project-visual">
        <div className="visual-frame">
          <span className="visual-index">PROJECT / {project.number}</span>
          {project.visual === 'estate' && (
            <div className="estate-visual" aria-hidden="true">
              <div className="estate-grid" />
              <div className="estate-building"><i /><i /><i /><b /></div>
              <span className="visual-axis axis-x">X — 08.4</span><span className="visual-axis axis-y">Z — 12.0</span>
            </div>
          )}
          {project.visual === 'space' && (
            <div className="space-visual" aria-hidden="true">
              <div className="room-floor"><span /><span /><span /><span /></div>
              <div className="room-label">SPACE / STUDY 02</div>
              <div className="measure measure-one">4.2 m</div><div className="measure measure-two">3.6 m</div>
            </div>
          )}
          {project.visual === 'secure' && (
            <div className="secure-visual" aria-hidden="true">
              <div className="secure-orbit orbit-one" /><div className="secure-orbit orbit-two" />
              <div className="secure-lock"><span /></div><div className="secure-node node-one" /><div className="secure-node node-two" /><div className="secure-node node-three" />
            </div>
          )}
          <span className="visual-corner">↗</span>
        </div>
      </div>
      <div className="project-copy">
        <div className="project-meta"><span>{project.type}</span><span>{project.number} / 03</span></div>
        <h3>{project.name}</h3>
        <p>{project.description}</p>
        <ul className="project-details">{project.details.map((detail) => <li key={detail}>{detail}</li>)}</ul>
        <div className="project-footer">
          <div className="tag-list">{project.stack.map((tag) => <span key={tag}>{tag}</span>)}</div>
          <div className="project-links">
            {project.live && <a href={project.live} target="_blank" rel="noreferrer" aria-label={`Open ${project.name} live demo`}><ArrowUpRight size={17} /></a>}
            <a href={project.code} target="_blank" rel="noreferrer" aria-label={`Open ${project.name} source code`}><Github size={17} /></a>
          </div>
        </div>
      </div>
    </article>
  )
}
