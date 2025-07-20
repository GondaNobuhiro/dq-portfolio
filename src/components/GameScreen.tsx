import React, { useEffect, useState, type JSX } from 'react';
import '../App.css';
import playerImg from '../assets/player.png';
import npcImg from '../assets/npc.png';
import groundImg from '../assets/tiles/ground.png';
import treeImg from '../assets/tiles/tree.png';
import SkillPanel from './SkillPanel';

interface GameScreenProps {
	setMessage: (msg: string | JSX.Element | MessageWithChoices) => void;
	clearMessage: () => void;
	showSkillPopup: boolean;
	setShowSkillPopup: (show: boolean) => void;
}

interface MessageWithChoices {
	text: string;
	choices: { label: string; onSelect: () => void }[];
}

const TILE_SIZE = 32;
const MAP_WIDTH = 23;
const MAP_HEIGHT = 20;

// 0 = ground, 1 = tree
const mapData = [
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

const GameScreen: React.FC<GameScreenProps> = ({ setMessage, clearMessage }) => {
	const [playerPos, setPlayerPos] = useState({ x: 1, y: 1 });
	const [showSkillPanel, setShowSkillPanel] = useState(false);
	const [scale, setScale] = useState(1);

	// NPC定義
	const npcs = [
		{ id: 'teacher', x: 3, y: 2, type: 'text', message: 'NPC：わしは React + TypeScript の　せんせいじゃ。' },
		{ id: 'warrior', x: 5, y: 3, type: 'text', message: 'NPC：つよさを　みがくには　バグとの　たたかいじゃ。' },
		{
			id: 'skill_npc', x: 6, y: 4, type: 'choice', message: {
				text: 'スキルアップを確認しますか？',
				choices: [
					{ label: 'はい', onSelect: () => setShowSkillPanel(true) },
					{ label: 'いいえ', onSelect: () => clearMessage() },
				]
			}
		},
	];

	// 通行判定
	const isBlocked = (x: number, y: number) => {
		if (x < 0 || x >= MAP_WIDTH || y < 0 || y >= MAP_HEIGHT) return true;
		if (mapData[y][x] === 1) return true;
		if (npcs.some(npc => npc.x === x && npc.y === y)) return true;
		return false;
	};

	// キー操作
	const handleKeyDown = (e: KeyboardEvent) => {
		setPlayerPos((prev) => {
			let { x, y } = prev;
			if (e.key === 'ArrowUp') y--;
			if (e.key === 'ArrowDown') y++;
			if (e.key === 'ArrowLeft') x--;
			if (e.key === 'ArrowRight') x++;
			if (isBlocked(x, y)) return prev;
			clearMessage();
			return { x, y };
		});
	};

	// キーイベント・NPC会話設定
	useEffect(() => {
		window.addEventListener('keydown', handleKeyDown);
		(window as any).talkToNpc = () => {
			const targetNpc = npcs.find(
				(npc) => Math.abs(playerPos.x - npc.x) + Math.abs(playerPos.y - npc.y) === 1
			);
			if (!targetNpc) {
				setMessage('（はなす）　まわりには　だれも　おらぬぞ。');
				return;
			}

			if (targetNpc.type === 'text') {
				setMessage(targetNpc.message);
			} else if (targetNpc.type === 'choice') {
				setMessage(targetNpc.message);
			}
		};

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, [playerPos, setMessage, clearMessage]);

	// スケーリング計算
	useEffect(() => {
		const updateScale = () => {
			const availableWidth = window.innerWidth;
			const availableHeight = window.innerHeight - 200; // ステータス・コマンド欄分の高さを考慮
			const scaleX = availableWidth / (MAP_WIDTH * TILE_SIZE);
			const scaleY = availableHeight / (MAP_HEIGHT * TILE_SIZE);
			setScale(Math.min(scaleX, scaleY, 1));
		};

		updateScale();
		window.addEventListener('resize', updateScale);
		return () => window.removeEventListener('resize', updateScale);
	}, []);

	// マップ描画
	const renderMap = () => {
		return mapData.map((row, y) =>
			row.map((tile, x) => {
				const tileImg = tile === 0 ? groundImg : treeImg;
				return (
					<img
						key={`tile-${x}-${y}`}
						src={tileImg}
						className="tile"
						alt={`tile-${tile}`}
						style={{
							position: 'absolute',
							width: `${TILE_SIZE}px`,
							height: `${TILE_SIZE}px`,
							left: `${x * TILE_SIZE}px`,
							top: `${y * TILE_SIZE}px`,
							zIndex: 0
						}}
					/>
				);
			})
		);
	};

	return (
		<div
			className="game-wrapper"
			style={{
				width: `${MAP_WIDTH * TILE_SIZE * scale * 0.9}px`,
				height: `${MAP_HEIGHT * TILE_SIZE * scale}px`,
				transform: `scale(${scale})`,
				transformOrigin: 'top left',
			}}
		>
			<div
				className="game-container"
				style={{
					position: 'relative',
				}}
			>
				{renderMap()}

				{npcs.map((npc) => (
					<img
						key={npc.id}
						src={npcImg}
						className="character"
						alt={`npc-${npc.id}`}
						style={{
							left: `${npc.x * TILE_SIZE}px`,
							top: `${npc.y * TILE_SIZE}px`,
							position: 'absolute',
							zIndex: 1
						}}
					/>
				))}

				<img
					src={playerImg}
					className="character"
					alt="player"
					style={{
						left: `${playerPos.x * TILE_SIZE}px`,
						top: `${playerPos.y * TILE_SIZE}px`,
						position: 'absolute',
						zIndex: 2
					}}
				/>

				{showSkillPanel && (
					<div className="popup">
						<SkillPanel onClose={() => setShowSkillPanel(false)} />
					</div>
				)}
			</div>
		</div>
	);
};

export default GameScreen;