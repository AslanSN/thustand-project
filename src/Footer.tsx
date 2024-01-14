import { Button } from '@mui/material'
import { useQuestionsData } from './hooks/useQuestionsData'
import { useQuestionsStore } from './store/questions'

export const Footer = () => {
	const { correct, incorrect, unanswered } = useQuestionsData()
	const reset = useQuestionsStore((state) => state.reset)

	return (
		<footer>
			<strong>{`✅ ${correct} correctas - ❌ ${incorrect} incorrectas - ❓ ${unanswered} sin responder`}</strong>
			<div style={{ marginTop: '1rem' }}>
				<Button onClick={reset}>Resetear juego</Button>
			</div>
		</footer>
	)
}
