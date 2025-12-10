
import type { DialogueLine } from '../types';

export const parseScript = (text: string): { lines: DialogueLine[]; speakers: Set<string> } => {
    const lines: DialogueLine[] = [];
    const speakers = new Set<string>();
    
    if (!text.trim()) {
        return { lines, speakers };
    }

    const rawLines = text.split('\n');
    const regex = /^(?:\[([^\]:]+):|([^:]+):)\s*(.+)$/;

    rawLines.forEach((line, index) => {
        const trimmedLine = line.trim();
        if (!trimmedLine) return;

        const match = trimmedLine.match(regex);

        if (match) {
            const speaker = (match[1] || match[2]).trim();
            const dialogueText = match[3].trim();

            if (speaker && dialogueText) {
                lines.push({
                    id: `${index}-${speaker}`,
                    speaker,
                    text: dialogueText,
                });
                speakers.add(speaker);
            } else {
                 lines.push({
                    id: `${index}-error`,
                    speaker: 'Parse Error',
                    text: trimmedLine,
                    error: "Invalid format. Use '[Speaker: Text]' or 'Speaker: Text'.",
                });
            }
        } else {
             lines.push({
                id: `${index}-error`,
                speaker: 'Parse Error',
                text: trimmedLine,
                error: "Could not detect speaker. Ensure line starts with a speaker name followed by a colon.",
            });
        }
    });

    return { lines, speakers };
};
