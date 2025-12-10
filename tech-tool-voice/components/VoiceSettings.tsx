
import React from 'react';
import type { SpeakerConfig } from '../types';
import { DEFAULT_VOICES, EMOTIONS } from '../constants';

interface VoiceSettingsProps {
    speakers: string[];
    speakerConfigs: Record<string, SpeakerConfig>;
    setSpeakerConfigs: React.Dispatch<React.SetStateAction<Record<string, SpeakerConfig>>>;
}

export const VoiceSettings: React.FC<VoiceSettingsProps> = ({ speakers, speakerConfigs, setSpeakerConfigs }) => {
    
    const handleConfigChange = (speaker: string, field: keyof SpeakerConfig, value: string | number) => {
        setSpeakerConfigs(prev => ({
            ...prev,
            [speaker]: {
                ...prev[speaker],
                [field]: value
            }
        }));
    };

    return (
        <div className="bg-gray-800 rounded-lg shadow-2xl p-6">
            <h2 className="text-2xl font-semibold mb-4 text-cyan-300">2. Voice Mapping & Settings</h2>
            <div className="space-y-6">
                {speakers.length > 0 ? speakers.map(speaker => (
                    <div key={speaker} className="bg-gray-700/50 rounded-lg p-4">
                        <h3 className="text-lg font-bold text-cyan-400 mb-3">{speaker}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor={`voice-${speaker}`} className="block text-sm font-medium text-gray-400 mb-1">Voice</label>
                                <select
                                    id={`voice-${speaker}`}
                                    value={speakerConfigs[speaker]?.voice || ''}
                                    onChange={(e) => handleConfigChange(speaker, 'voice', e.target.value)}
                                    className="w-full bg-gray-900 border border-gray-600 rounded-md p-2 text-gray-300 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors duration-200"
                                >
                                    {DEFAULT_VOICES.map(voice => (
                                        <option key={voice.id} value={voice.id}>{voice.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label htmlFor={`emotion-${speaker}`} className="block text-sm font-medium text-gray-400 mb-1">Emotion/Style</label>
                                <select
                                    id={`emotion-${speaker}`}
                                    value={speakerConfigs[speaker]?.emotion || 'normal'}
                                    onChange={(e) => handleConfigChange(speaker, 'emotion', e.target.value)}
                                    className="w-full bg-gray-900 border border-gray-600 rounded-md p-2 text-gray-300 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors duration-200"
                                >
                                    {EMOTIONS.map(emotion => (
                                        <option key={emotion.value} value={emotion.value}>{emotion.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label htmlFor={`volume-${speaker}`} className="block text-sm font-medium text-gray-400 mb-1">
                                    Volume: {Math.round((speakerConfigs[speaker]?.volume || 1) * 100)}%
                                </label>
                                <input
                                    type="range"
                                    id={`volume-${speaker}`}
                                    min="0"
                                    max="1.5"
                                    step="0.01"
                                    value={speakerConfigs[speaker]?.volume || 1}
                                    onChange={(e) => handleConfigChange(speaker, 'volume', parseFloat(e.target.value))}
                                    className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                                />
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="text-center text-gray-500 py-10">
                        <p>Speakers will appear here once detected in your script.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
