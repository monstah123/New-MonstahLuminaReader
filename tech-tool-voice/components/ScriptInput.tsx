
import React from 'react';
import type { DialogueLine } from '../types';
import { PlayIcon, DownloadIcon } from './Icons';

interface ScriptInputProps {
    scriptText: string;
    setScriptText: (text: string) => void;
    dialogueLines: DialogueLine[];
    isLoading: Record<string, boolean>;
    onPreview: (line: DialogueLine) => void;
}

export const ScriptInput: React.FC<ScriptInputProps> = ({ scriptText, setScriptText, dialogueLines, isLoading, onPreview }) => {
    return (
        <div className="bg-gray-800 rounded-lg shadow-2xl p-6 flex flex-col h-full">
            <h2 className="text-2xl font-semibold mb-4 text-cyan-300">1. Script Input</h2>
            <textarea
                className="w-full h-48 bg-gray-900 border border-gray-700 rounded-md p-3 text-gray-300 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors duration-200 resize-y"
                placeholder={`[Speaker 1: Hello, how are you?]\nSpeaker 2: I'm good, thanks!`}
                value={scriptText}
                onChange={(e) => setScriptText(e.target.value)}
            ></textarea>

            <div className="mt-6 flex-grow">
                <h3 className="text-xl font-semibold mb-3 text-cyan-300">Detected Dialogue</h3>
                <div className="space-y-3 h-[calc(100vh-28rem)] overflow-y-auto pr-2">
                    {dialogueLines.length > 0 ? (
                        dialogueLines.map((line) => (
                            <div key={line.id} className="bg-gray-700/50 rounded-lg p-3 flex items-center justify-between">
                                <div className="flex-1">
                                    <span className="font-bold text-cyan-400">{line.speaker}:</span>
                                    <p className="text-gray-300 ml-2 inline">{line.text}</p>
                                    {line.error && <p className="text-red-400 text-sm mt-1">{line.error}</p>}
                                </div>
                                <button
                                    onClick={() => onPreview(line)}
                                    disabled={isLoading[line.id] || !!line.error}
                                    className="ml-4 p-2 bg-cyan-600 rounded-full hover:bg-cyan-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-cyan-500"
                                    aria-label={`Preview ${line.speaker}'s line`}
                                >
                                    {isLoading[line.id] ? (
                                        <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                                    ) : (
                                        <PlayIcon className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="text-center text-gray-500 py-10">
                            <p>Your script's dialogue will appear here.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
