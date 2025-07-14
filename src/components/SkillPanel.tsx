// src/components/SkillPanel.tsx
import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Tooltip,
	Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface SkillPanelProps {
	onClose: () => void;
}

const data = {
	labels: ['React', 'TypeScript', 'Node.js', 'AWS'],
	datasets: [
		{
			label: 'スキルレベル',
			data: [5, 5, 4, 3],
			backgroundColor: 'rgba(255, 255, 255, 0.8)',
			borderColor: 'white',
			borderWidth: 1,
		},
	],
};

const options = {
	responsive: true,
	scales: {
		y: {
			beginAtZero: true,
			ticks: {
				color: 'white',
				stepSize: 1,
				max: 5
			},
			grid: {
				color: 'rgba(255, 255, 255, 0.2)'
			}
		},
		x: {
			ticks: {
				color: 'white'
			},
			grid: {
				color: 'rgba(255, 255, 255, 0.2)'
			}
		}
	},
	plugins: {
		legend: {
			labels: {
				color: 'white'
			}
		}
	}
};

const SkillPanel: React.FC<SkillPanelProps> = ({ onClose }) => {
	return (
		<div className="popup">
			<h3>スキルパネル</h3>
			<Bar data={data} options={options} />
			<button onClick={onClose}>とじる</button>
		</div>
	);
};

export default SkillPanel;
