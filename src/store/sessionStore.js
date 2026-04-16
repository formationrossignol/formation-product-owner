import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { scoreTask } from '../engine/scoreEngine'

const useSessionStore = create(
  persist(
    (set) => ({
      currentCase: null,
      completedModuleIds: [],
      answers: {},
      taskScores: {},
      eventAnswers: {},
      eventScores: {},
      decisions: [],
      sessionComplete: false,

      setCase: (caseData) => set({
        currentCase: caseData,
        completedModuleIds: [],
        answers: {},
        taskScores: {},
        eventAnswers: {},
        eventScores: {},
        decisions: [],
        sessionComplete: false,
      }),

      submitAnswer: (task, answer) => set((state) => {
        const points = scoreTask(task, answer)
        return {
          answers: { ...state.answers, [task.id]: answer },
          taskScores: { ...state.taskScores, [task.id]: points },
          decisions: [...state.decisions, {
            type: 'task',
            taskId: task.id,
            moduleId: task.moduleId,
            answer,
            points,
            maxPoints: task.points,
            rationale: task.rationale,
            timestamp: Date.now(),
          }],
        }
      }),

      completeModule: (moduleId) => set((state) => ({
        completedModuleIds: [...state.completedModuleIds, moduleId],
      })),

      submitEventChoice: (event, choiceId) => set((state) => {
        const choice = event.choices.find(c => c.id === choiceId)
        return {
          eventAnswers: { ...state.eventAnswers, [event.id]: choiceId },
          eventScores: { ...state.eventScores, [event.id]: choice?.points ?? 0 },
          decisions: [...state.decisions, {
            type: 'event',
            eventId: event.id,
            choiceId,
            points: choice?.points ?? 0,
            maxPoints: Math.max(...event.choices.map(c => c.points)),
            rationale: choice?.rationale ?? '',
            timestamp: Date.now(),
          }],
        }
      }),

      completeSession: () => set({ sessionComplete: true }),

      resetSession: () => set({
        currentCase: null,
        completedModuleIds: [],
        answers: {},
        taskScores: {},
        eventAnswers: {},
        eventScores: {},
        decisions: [],
        sessionComplete: false,
      }),
    }),
    {
      name: 'tp-po-session',
    }
  )
)

export default useSessionStore
