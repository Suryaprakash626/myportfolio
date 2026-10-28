export const profile = {
  name: 'Suryaprakash B',
  email: 'suryaprakashbit089@gmail.com',
  linkedin: 'https://www.linkedin.com/in/surya-prakash-6828a5292/',
  github: 'https://github.com/Suryaprakash626',
  resume: '/Suryaprakash-Resume.docx',
}

export const projects = [
  {
    number: '01',
    name: 'EstateScope 3D',
    type: 'VIRTUAL REAL ESTATE EXPLORER',
    description:
      'A browser-based property exploration experience with orbit navigation, first-person walkthrough controls and Blender-modelled architectural assets.',
    details: ['Three-dimensional property exploration', 'Blender → GLB asset pipeline', 'Procedural room geometry with Python', 'Site-visit booking with MongoDB Atlas'],
    stack: ['3D Web', 'Blender', 'GLB', 'Python', 'MongoDB'],
    code: 'https://lnkd.in/dKp8vjay',
    live: '',
    visual: 'estate',
  },
  {
    number: '02',
    name: 'SpaceFit 3D',
    type: 'INTERACTIVE 2D / 3D ROOM PLANNER',
    description:
      'An interactive room-planning application for arranging furniture, comparing layouts and understanding how efficiently a space is used.',
    details: ['2D and 3D room planning', 'Furniture placement and layout comparison', 'Collision and accessibility checks', 'Walkway clearance and free-floor metrics'],
    stack: ['3D Web', 'Spatial Planning', 'React', 'Vercel'],
    code: 'https://github.com/Suryaprakash626/Spacefit-3D.git',
    live: 'https://scacefit-3d.vercel.app/',
    visual: 'space',
  },
  {
    number: '03',
    name: 'Zero-Knowledge File Share',
    type: 'CLIENT-SIDE ENCRYPTED FILE SHARING',
    description:
      'A file-sharing application built around client-side encryption, configurable link expiration and download limits.',
    details: ['Client-side encryption', 'Configurable link expiration', 'Download limits and access controls', 'FastAPI endpoints and file validation'],
    stack: ['FastAPI', 'REST API', 'Security', 'Encryption'],
    code: 'https://github.com/Suryaprakash626/zk-file-share',
    live: 'https://zk-file-share.onrender.com',
    visual: 'secure',
  },
]

export const capabilities = [
  { label: 'Three.js / WebGL', note: 'Current focus', group: '3D & CREATIVE' },
  { label: 'Blender 3D', note: 'Modelling & asset workflow', group: '3D & CREATIVE' },
  { label: 'React', note: 'Frontend development', group: 'WEB' },
  { label: 'JavaScript / TypeScript', note: 'Interactive interfaces', group: 'WEB' },
  { label: 'Python', note: 'Scripting & backend', group: 'BACKEND' },
  { label: 'FastAPI', note: 'REST APIs', group: 'BACKEND' },
  { label: 'MongoDB / MySQL', note: 'Database technologies', group: 'DATA' },
  { label: 'Java / C', note: 'Programming languages', group: 'FOUNDATIONS' },
  { label: 'Git & GitHub', note: 'Version control', group: 'TOOLS' },
]
