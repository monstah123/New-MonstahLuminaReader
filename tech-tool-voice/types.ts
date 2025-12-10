
export interface DialogueLine {
    id: string;
    speaker: string;
    text: string;
    error?: string;
}

export interface SpeakerConfig {
    voice: string;
    emotion: 'normal' | 'happy' | 'sad' | 'angry' | 'surprised' | 'calm';
    volume: number;
}

export interface GeneratedAudio {
    [key: string]: {
        buffer: AudioBuffer;
        url: string;
    }
}
