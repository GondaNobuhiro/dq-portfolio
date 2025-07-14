export interface Choice {
	label: string;
	onSelect: () => void;
}

export interface MessageWithChoices {
	text: string;
	choices: Choice[];
}