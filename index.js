const express = require("express");
const server = express();

server.use(express.json());

const projects = [
  { id: "1", title: "Novo projeto", tasks: ["Nova tarefa"] },
  { id: "2", title: "Novo projeto2", tasks: ["Nova tarefa2"] },
];

/*class projects {
  constructor(id, title, tasks) {
    this.id = id;
    this.title = title;
    this.tasks = tasks;
  }
}*/

function checkProjectExists(req, res, next) {
  const { id } = req.params;
  const project = projects.find((p) => p.id == id);
  if (!project) {
    return res.status(400).json({ error: "Project does not exist" });
  }
  req.project = project;

  return next();
}
function contagemReq(req, res, next) {
  const qntdReq = console.count("Request");
  console.log(qntdReq);
  return next();
}

server.get("/projects", contagemReq, (req, res) => {
  return res.json(projects);
});
server.get("/projects/:id", checkProjectExists, contagemReq, (req, res) => {
  const { id } = req.params;
  const project = projects.find((p) => p.id == id);
  return res.json(project);
});

server.post("/projects", contagemReq, (req, res) => {
  const { id, title } = req.body;
  const project = {
    id,
    title,
    tasks: [],
  };
  projects.push(project);
  return res.json(project);
});

server.put("/projects/:id", checkProjectExists, contagemReq, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find((p) => p.id == id);
  project.title = title;
  return res.json(project);
});

server.delete("/projects/:id", checkProjectExists, contagemReq, (req, res) => {
  const { id } = req.params;
  const projectIndex = projects.findIndex((p) => p.id == id);

  projects.splice(projectIndex, 1);
  return res.send();
});
server.post(
  "/projects/:id/tasks",
  checkProjectExists,
  contagemReq,
  (req, res) => {
    const { tasks } = req.body;
    const { id } = req.params;
    const project = projects.find((p) => p.id == id);
    project.tasks.push(tasks);
    return res.send(project);
  }
);

server.listen(4000);
