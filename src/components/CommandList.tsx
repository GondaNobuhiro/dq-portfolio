import React from 'react';
import './CommandList.css';

interface CommandListProps {
	setMessage: (msg: string) => void;
	clearMessage: () => void;
}

const CommandList: React.FC<CommandListProps> = () => {
	// 例：話すコマンド
	const handleTalk = () => {
		(window as any).talkToNpc();
	};

	return (
		<div className="command">
			<p onClick={handleTalk}>はなす</p>
			<p>しらべる</p>
			<p>つよさ</p>
			<p>さくせん</p>
		</div>
	);
};

export default CommandList;