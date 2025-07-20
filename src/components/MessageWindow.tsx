import React from 'react';
import type { MessageWithChoices } from '../types';
import '../App.css';

interface MessageWindowProps {
	message: string | React.JSX.Element | MessageWithChoices | null;
	clearMessage: () => void;
}

// 型ガード関数
function isMessageWithChoices(
	msg: string | React.JSX.Element | MessageWithChoices
): msg is MessageWithChoices {
	return typeof msg === 'object' && msg !== null && 'text' in msg && 'choices' in msg;
}

const MessageWindow: React.FC<MessageWindowProps> = ({ message, clearMessage }) => {
	if (!message) return null;

	if (typeof message === 'string' || React.isValidElement(message)) {
		return <div className="message-window">{message}</div>;
	}

	if (isMessageWithChoices(message)) {
		return (
			<div className="message-window">
				<p>{message.text}</p>
				<div className="choices">
					{message.choices.map((choice, index) => (
						<button key={index} onClick={choice.onSelect}>
							{choice.label}
						</button>
					))}
				</div>
			</div>
		);
	}

	return null;
};

export default MessageWindow;
