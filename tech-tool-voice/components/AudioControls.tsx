
import React from 'react';
import { GenerateIcon, DownloadIcon, MusicIcon, PlayIcon, PauseIcon } from './Icons';

interface AudioControlsProps {
    onGenerateAll: () => void;
    onDownloadAll: () => void;
    isGeneratingAll: boolean;
    generatedAudioCount: number;
    dialogueLineCount: number;
    backgroundMusic: { buffer: AudioBuffer | null, volume: number, loop: boolean, element: HTMLAudioElement | null };
    setBackgroundMusic: React.Dispatch<React.SetStateAction<{ buffer: AudioBuffer | null, volume: number, loop: boolean, element: HTMLAudioElement | null }>>;
    onBackgroundMusicChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    toggleBackgroundMusic: (play: boolean) => void;
}


export const AudioControls: React.FC<AudioControlsProps> = ({
    onGenerateAll, onDownloadAll, isGeneratingAll, generatedAudioCount, dialogueLineCount,
    backgroundMusic, setBackgroundMusic, onBackgroundMusicChange, toggleBackgroundMusic
}) => {
    
    const allAudioGenerated = dialogueLineCount > 0 && generatedAudioCount === dialogueLineCount;

    return (
        <div className="bg-gray-800 rounded-lg shadow-2xl p-6">
            <h2 className="text-2xl font-semibold mb-4 text-cyan-300">3. Final Output</h2>
            
            <div className="bg-gray-700/50 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-bold text-cyan-400 mb-3 flex items-center"><MusicIcon className="w-6 h-6 mr-2" /> Background Music</h3>
                <input
                    type="file"
                    accept="audio/mp3,audio/wav,audio/ogg"
                    onChange={onBackgroundMusicChange}
                    className="text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-800 file:text-cyan-200 hover:file:bg-cyan-700"
                />
                 {backgroundMusic.buffer && (
                    <div className="mt-4 flex items-center gap-4">
                         <button onClick={() => toggleBackgroundMusic(true)} className="p-2 bg-cyan-600 rounded-full hover:bg-cyan-500 transition-colors"><PlayIcon className="w-5 h-5"/></button>
                         <button onClick={() => toggleBackgroundMusic(false)} className="p-2 bg-cyan-600 rounded-full hover:bg-cyan-500 transition-colors"><PauseIcon className="w-5 h-5"/></button>

                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={backgroundMusic.volume}
                            onChange={(e) => {
                                const newVolume = parseFloat(e.target.value);
                                setBackgroundMusic(prev => {
                                    if(prev.element) prev.element.volume = newVolume;
                                    return {...prev, volume: newVolume};
                                });
                            }}
                            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                        />
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="loop-music"
                                checked={backgroundMusic.loop}
                                onChange={(e) => {
                                    const newLoop = e.target.checked;
                                    setBackgroundMusic(prev => {
                                        if (prev.element) prev.element.loop = newLoop;
                                        return { ...prev, loop: newLoop };
                                    });
                                }}
                                className="h-4 w-4 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
                            />
                            <label htmlFor="loop-music" className="ml-2 text-sm text-gray-300">Loop</label>
                        </div>
                    </div>
                 )}
            </div>

            <div className="space-y-4">
                <button
                    onClick={onGenerateAll}
                    disabled={isGeneratingAll || dialogueLineCount === 0}
                    className="w-full flex items-center justify-center gap-3 bg-red-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-red-700 disabled:bg-red-800 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                    {isGeneratingAll ? (
                         <>
                            <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                            Generating... ({generatedAudioCount}/{dialogueLineCount})
                        </>
                    ) : (
                        <>
                            <GenerateIcon className="w-6 h-6" />
                            Generate Full Audio
                        </>
                    )}
                </button>

                <button
                    onClick={onDownloadAll}
                    disabled={!allAudioGenerated || isGeneratingAll}
                    className="w-full flex items-center justify-center gap-3 bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                    <DownloadIcon className="w-6 h-6" />
                    Download Full Story
                </button>
            </div>
        </div>
    );
};
