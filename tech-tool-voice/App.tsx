
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ScriptInput } from './components/ScriptInput';
import { VoiceSettings } from './components/VoiceSettings';
import { AudioControls } from './components/AudioControls';
import type { DialogueLine, SpeakerConfig, GeneratedAudio } from './types';
import { parseScript } from './utils/scriptParser';
import { generateSpeech } from './services/geminiService';
import { decodeBase64Audio, decodePcmToAudioBuffer, audioBufferToWav, concatenateAudioBuffers } from './utils/audioUtils';
import { DEFAULT_VOICES } from './constants';

const App: React.FC = () => {
    const [scriptText, setScriptText] = useState<string>('');
    const [dialogueLines, setDialogueLines] = useState<DialogueLine[]>([]);
    const [speakerConfigs, setSpeakerConfigs] = useState<Record<string, SpeakerConfig>>({});
    const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});
    const [generatedAudio, setGeneratedAudio] = useState<GeneratedAudio>({});
    const [backgroundMusic, setBackgroundMusic] = useState<{ buffer: AudioBuffer | null, volume: number, loop: boolean, element: HTMLAudioElement | null }>({ buffer: null, volume: 0.2, loop: true, element: null });
    const [isGeneratingAll, setIsGeneratingAll] = useState(false);

    const audioContext = useMemo(() => new (window.AudioContext || (window as any).webkitAudioContext)(), []);

    useEffect(() => {
        const savedState = localStorage.getItem('techToolVoiceState');
        if (savedState) {
            const { scriptText, speakerConfigs } = JSON.parse(savedState);
            setScriptText(scriptText);
            setSpeakerConfigs(speakerConfigs);
        }
    }, []);

    useEffect(() => {
        const stateToSave = JSON.stringify({ scriptText, speakerConfigs });
        localStorage.setItem('techToolVoiceState', stateToSave);
    }, [scriptText, speakerConfigs]);

    useEffect(() => {
        const { lines, speakers } = parseScript(scriptText);
        setDialogueLines(lines);

        setSpeakerConfigs(prevConfigs => {
            const newConfigs = { ...prevConfigs };
            let voiceIndex = Object.keys(prevConfigs).length % DEFAULT_VOICES.length;
            speakers.forEach(speaker => {
                if (!newConfigs[speaker]) {
                    newConfigs[speaker] = {
                        voice: DEFAULT_VOICES[voiceIndex].id,
                        emotion: 'normal',
                        volume: 1,
                    };
                    voiceIndex = (voiceIndex + 1) % DEFAULT_VOICES.length;
                }
            });
            return newConfigs;
        });
    }, [scriptText]);

    const handlePreview = useCallback(async (line: DialogueLine) => {
        const { id, speaker, text } = line;
        if (!speaker || !text) return;

        setIsLoading(prev => ({ ...prev, [id]: true }));
        try {
            const config = speakerConfigs[speaker];
            const prompt = config.emotion === 'normal' ? text : `Say this ${config.emotion}ly: ${text}`;
            const base64Audio = await generateSpeech(prompt, config.voice);
            const pcmData = decodeBase64Audio(base64Audio);
            const audioBuffer = await decodePcmToAudioBuffer(pcmData, audioContext);
            
            setGeneratedAudio(prev => ({ ...prev, [id]: { buffer: audioBuffer, url: '' } }));

            const source = audioContext.createBufferSource();
            source.buffer = audioBuffer;
            const gainNode = audioContext.createGain();
            gainNode.gain.value = config.volume;
            source.connect(gainNode).connect(audioContext.destination);
            source.start();

        } catch (error) {
            console.error('Error generating speech:', error);
            alert('Failed to generate audio. Please check your API key and network connection.');
        } finally {
            setIsLoading(prev => ({ ...prev, [id]: false }));
        }
    }, [audioContext, speakerConfigs]);

    const handleGenerateAll = useCallback(async () => {
        setIsGeneratingAll(true);
        const allAudio: GeneratedAudio = {};
        for (const line of dialogueLines) {
            const { id, speaker, text } = line;
            if (!speaker || !text) continue;
            setIsLoading(prev => ({...prev, [id]: true}));
            try {
                const config = speakerConfigs[speaker];
                const prompt = config.emotion === 'normal' ? text : `Say this ${config.emotion}ly: ${text}`;
                const base64Audio = await generateSpeech(prompt, config.voice);
                const pcmData = decodeBase64Audio(base64Audio);
                const audioBuffer = await decodePcmToAudioBuffer(pcmData, audioContext);
                const wavBlob = audioBufferToWav(audioBuffer);
                const url = URL.createObjectURL(wavBlob);
                allAudio[id] = { buffer: audioBuffer, url };
            } catch (error) {
                console.error(`Error generating audio for line ${id}:`, error);
                 alert(`Failed to generate audio for line: "${text}". Stopping generation.`);
                 break;
            } finally {
                 setIsLoading(prev => ({...prev, [id]: false}));
            }
        }
        setGeneratedAudio(allAudio);
        setIsGeneratingAll(false);
    }, [dialogueLines, speakerConfigs, audioContext]);

    const handleDownloadAll = useCallback(() => {
        const buffersToCombine = dialogueLines
            .map(line => generatedAudio[line.id]?.buffer)
            .filter((b): b is AudioBuffer => !!b);

        if (buffersToCombine.length === 0) {
            alert("No audio generated to download.");
            return;
        }

        const combinedBuffer = concatenateAudioBuffers(buffersToCombine, audioContext);
        const wavBlob = audioBufferToWav(combinedBuffer);
        const url = URL.createObjectURL(wavBlob);
        const a = document.createElement('a');
        a.href = url;
        const date = new Date().toLocaleDateString('en-CA', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '');
        a.download = `Story_${date}.mp3`; // Use mp3 extension as requested
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, [generatedAudio, dialogueLines, audioContext]);

    const handleBackgroundMusicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = async (event) => {
                const arrayBuffer = event.target?.result as ArrayBuffer;
                const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
                
                if (backgroundMusic.element) {
                    backgroundMusic.element.pause();
                }

                const audioElement = new Audio(URL.createObjectURL(file));
                audioElement.loop = backgroundMusic.loop;
                audioElement.volume = backgroundMusic.volume;

                setBackgroundMusic(prev => ({ ...prev, buffer: audioBuffer, element: audioElement }));
            };
            reader.readAsArrayBuffer(file);
        }
    };
    
    const toggleBackgroundMusic = (play: boolean) => {
        if (backgroundMusic.element) {
            if (play) {
                backgroundMusic.element.play();
            } else {
                backgroundMusic.element.pause();
            }
        }
    }

    const uniqueSpeakers = useMemo(() => Array.from(new Set(dialogueLines.map(line => line.speaker).filter(Boolean))), [dialogueLines]);

    return (
        <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
            <header className="bg-gray-800/50 backdrop-blur-sm shadow-lg p-4 sticky top-0 z-10">
                <h1 className="text-3xl font-bold text-center text-cyan-400 tracking-wider">
                    Monstah Tech Tool Voice
                </h1>
                <p className="text-center text-gray-400 mt-1">
                    Convert your story scripts into natural-sounding audio with AI.
                </p>
            </header>

            <main className="p-4 sm:p-6 lg:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
                    <ScriptInput
                        scriptText={scriptText}
                        setScriptText={setScriptText}
                        dialogueLines={dialogueLines}
                        isLoading={isLoading}
                        onPreview={handlePreview}
                    />
                    <div className="flex flex-col gap-8">
                        <VoiceSettings
                            speakers={uniqueSpeakers}
                            speakerConfigs={speakerConfigs}
                            setSpeakerConfigs={setSpeakerConfigs}
                        />
                         <AudioControls
                            onGenerateAll={handleGenerateAll}
                            onDownloadAll={handleDownloadAll}
                            isGeneratingAll={isGeneratingAll}
                            generatedAudioCount={Object.keys(generatedAudio).length}
                            dialogueLineCount={dialogueLines.length}
                            backgroundMusic={backgroundMusic}
                            setBackgroundMusic={setBackgroundMusic}
                            onBackgroundMusicChange={handleBackgroundMusicChange}
                            toggleBackgroundMusic={toggleBackgroundMusic}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default App;
