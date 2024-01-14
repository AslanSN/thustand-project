import { useQuestionsStore } from "../store/questions"
import { QuestionsStatus } from "../types"

export const useQuestionsData = () => {
  const questions = useQuestionsStore((state) => state.questions)
	const questionsStatus: QuestionsStatus = {
		correct: 0,
		incorrect: 0,
		unanswered: 0,
	}

	questions.forEach((question) => {
		const { userSelectedAnswer, correctAnswer } = question
		switch (true) {
			case userSelectedAnswer == null:
				questionsStatus.unanswered++
				return
			case userSelectedAnswer === correctAnswer:
				questionsStatus.correct++
				return
			default:
				questionsStatus.incorrect++
				return
		}
	})

  return questionsStatus
}