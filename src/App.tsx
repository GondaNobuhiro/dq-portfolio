import React, { useState } from 'react';
import './App.css';
import GameScreen from './components/GameScreen';
import MessageWindow from './components/MessageWindow';
import CommandList from './components/CommandList';
import Status from './components/Status';
import SubMenu from './components/SubMenu';
import type { MessageWithChoices } from './types';

const App: React.FC = () => {
	const [message, setMessage] = useState<string | React.JSX.Element | MessageWithChoices | null>(null);
	const [showSkillPopup, setShowSkillPopup] = useState(false);

	const handleSetMessage = (msg: string | React.JSX.Element | MessageWithChoices) => {
		if (typeof msg === 'string') {
			setMessage(<p>{msg}</p>);
		} else if (React.isValidElement(msg)) {
			setMessage(msg);
		} else {
			setMessage(msg);
		}
	};

	const handleClearMessage = () => {
		setMessage(null);
	};

	return (
		<div className="dq-grid">
			<div className="grid-item status">
				<Status />
			</div>
			<div className="grid-item game">
				<GameScreen
					setMessage={handleSetMessage}
					clearMessage={handleClearMessage}
					showSkillPopup={showSkillPopup}
					setShowSkillPopup={setShowSkillPopup}
				/>
			</div>
			<div className="grid-item command">
				<CommandList
					setMessage={handleSetMessage}
					clearMessage={handleClearMessage}
				/>
			</div>
			<div className="grid-item message">
				<MessageWindow
					message={message}
					clearMessage={handleClearMessage}
				/>
			</div>
			<div className="grid-item submenu">
				<SubMenu />
			</div>
		</div>
	);
};

export default App;