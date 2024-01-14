import { create } from 'zustand'
import { Question } from '../types'
import confetti from 'canvas-confetti'
import { persist, devtools } from 'zustand/middleware'

interface State {
	questions: Question[]
	currentQuestion: number
	fetchQuestions: (limit: number) => Promise<void>
	selectAnswer: (questionId: number, answerIndex: number) => void
  goNextQuestion: () => void
  goPreviousQuestion: () => void
  reset: () => void
}

const loggerMiddleware = (config) => (set, get, api) => {
  return config(
    (...args) => {
      console.log('applying', args)
      set(...args) // original
      console.log('new state')
    },
    get,
    api
  )
}


export const useQuestionsStore = create<State>()(devtools(persist((set, get) => ({ // estos son middlewares
	questions: [],
	currentQuestion: 0,

	fetchQuestions: async (limit: number) => {
		const response = await fetch('http://localhost:5173/data.json')
		const json = await response.json()

		const questions = json.sort(() => Math.random() - .5).slice(0, limit)
		set({ questions }, false, 'FETCH_QUESTIONS')
	},

	selectAnswer: (questionId: number, answerIndex: number) => {
		const { questions } = get()
		// usar el structuredClone para clonar el objeto
		const newQuestions = structuredClone(questions)
		// encontramos el índice de la pregunta
		const questionIndex = newQuestions.findIndex(
			(question) => question.id === questionId
		)
		// obtenemos la información de la pregunta
		const questionInfo = newQuestions[questionIndex]
		// averiguamos si el usuario ha seleccionado la respuesta correcta
		const isCorrectUserAnswer = questionInfo.correctAnswer === answerIndex
		// cambiar esta información en la copia de la pregunta

		if (isCorrectUserAnswer) confetti()

		newQuestions[questionIndex] = {
			...questionInfo,
			isCorrectUserAnswer,
			userSelectedAnswer: answerIndex,
		}

		set({ questions: newQuestions }, false, 'SELECT_ANSWER')
	},

	goNextQuestion: () => {
		const { currentQuestion, questions } = get()
		const nextQuestion = currentQuestion + 1

		if (nextQuestion < questions.length) {
			set({ currentQuestion: nextQuestion }, false, 'NEXT_QUESTION')
		}
	},
	goPreviousQuestion: () => {
		const { currentQuestion} = get()
		const previousQuestion = currentQuestion - 1

		if (previousQuestion >= 0) {
			set({ currentQuestion: previousQuestion }, false, 'PREVIOUS_QUESTION')
		}
	},
  reset: () => {
    set({currentQuestion: 0, questions: []},false, 'RESET_QUESTIONS')
  }
}), {
  name: 'questions', 
  getStorage: () => localStorage // por defecto
})))
