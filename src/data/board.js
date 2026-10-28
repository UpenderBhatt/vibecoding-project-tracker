import { createAnchors, parseAnchors } from './anchors.js'
import { createTask, seedTasks } from './taskModel.js'
import { createMember, parseTeam } from './team.js'

/*
  Everything one account owns (FR29):

  Board = {
    tasks:   Task[],
    team:    TeamMember[],
    anchors: Anchor[],
  }
*/

// A brand-new account starts with the user on the team and a few example tasks.
export function createBoard(ownerName) {
  return {
    tasks: seedTasks(ownerName),
    team: [createMember(ownerName)],
    anchors: createAnchors(),
  }
}

// Clean up a saved board so the app can always rely on its shape.
export function parseBoard(saved) {
  return {
    tasks: Array.isArray(saved?.tasks) ? saved.tasks.map(createTask) : [],
    team: parseTeam(saved?.team),
    anchors: parseAnchors(saved?.anchors),
  }
}
