import { useState } from 'react';
import {useHistory, useParams} from 'react-router-dom';
import Modal from 'react-modal';

import logoImg from '../assets/images/logo.svg';
import deleteImg from '../assets/images/delete.svg';
import checkImg from '../assets/images/check.svg';
import answerImg from '../assets/images/answer.svg';
import excluideImg from '../assets/images/exclude.svg';
import deleteRedImg from '../assets/images/delete-red.svg';

import {Button} from "../components/Button";
import {RoomCode} from "../components/RoomCode";
import {Question} from '../components/Question';

import { useRoom } from '../hooks/useRoom';
import { database } from '../services/firebase';

import "../styles/room.scss";
import "../styles/modal.scss";

type RoomParams = {
	id: string;
}

export function AdminRoom() {
	// const {user} = useAuth();
	const history = useHistory();
	const params = useParams<RoomParams>();
	const roomId = params.id;

	const {title, questions} = useRoom(roomId);
	const [modalIsOpen, setModalIsOpen] = useState(false);
	const [questionId, setQuestionId] = useState<string | undefined>('');

	function openModal(deleteQuestionId?: string) {
		setModalIsOpen(true);
		setQuestionId(deleteQuestionId);
	}

	function closeModal() {
		setModalIsOpen(false);
	}

	async function handleEndRoom() {
		database.ref(`rooms/${roomId}`).update({
			endedAt: new Date(),
		})

		history.push('/');
	}

	async function handleDeleteQuestion(questionId?: string) {
		await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
		closeModal();
	}

	async function handleCheckQuestionAsAnswered(questionId: string) {
		await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
			isAnswered: true,
		});
	}

	async function handleHighlightQuestion(questionId: string) {
		await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
			isHighlighted: true,
		})
	}

	return (
		<div id="page-room">
			<header>
				<div className="content">
					<img src={logoImg} alt="Letmeask" />
					<div>
						<RoomCode code={roomId}/>
						<Button isOutlined onClick={() => openModal()}>Encerrar sala</Button>
					</div>
				</div>
			</header>

			<main>
				<div className="room-title">
					<h1>Sala {title}</h1>
					{ questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
				</div>

				<Modal
					isOpen={modalIsOpen}
					contentLabel="end room"
					onRequestClose={closeModal}
					ariaHideApp={false}
				>
					{!questionId ? (
						<>
							<img src={excluideImg} alt="exclude room alert" />
							<h2>Encerrar sala</h2>
							<p>Tem certeza que você deseja encerrar esta sala ?</p>
							<div>
								<Button 
									onClick={closeModal} 
									style={{backgroundColor: '#DBDCDD', color: '#737380'}}
								>
									Cancelar
								</Button>
								<Button isExclud onClick={() => handleEndRoom()}>Sim, encerrar</Button>
							</div>
						</>
					) : (
						<>
							<img src={deleteRedImg} alt="delete question alert" />
							<h2>Excluir pergunta</h2>
							<p>Tem certeza que você deseja excluir esta pergunta ?</p>
							<div>
								<Button 
									onClick={closeModal} 
									style={{backgroundColor: '#DBDCDD', color: '#737380'}}
								>
									Cancelar
								</Button>
								<Button isExclud onClick={() => handleDeleteQuestion(questionId)}>Sim, excluir</Button>
							</div>
						</>
					)}
				</Modal>
				<div className="question-list">
					{questions.map(question => {
						return (
							<Question 
								key={question.id}
								content={question.content}
								author={question.author}
								isAnswered={question.isAnswered}
								isHighlighted={question.isHighlighted}
							>
								{!question.isAnswered && (
									<>
										<button
											type="button"
											onClick={() => handleCheckQuestionAsAnswered(question.id)}
										>
											<img src={checkImg} alt="Marcar pergunta como respondida" />
										</button>
										<button
											type="button"
											onClick={() => handleHighlightQuestion(question.id)}
										>
											<img src={answerImg} alt="Dar destaque a pergunta" />
										</button>
									</>
								)}
								<button
									type="button"
									onClick={() => openModal(question.id)}
								>
									<img src={deleteImg} alt="remover pergunta" />
								</button>
							</Question>
						)
					})}
				</div>
			</main>
		</div>
	)
}