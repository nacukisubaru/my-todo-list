export const useSpeechSynthesis = () => {
    
    const findVoiceByLang = (voiceValue: string) => {
        return window.speechSynthesis.getVoices().find(voice => {
            return voice.name.includes(voiceValue);
        });
    }

    const speak = (text: string, lang: string, voiceOff: boolean = false) => {
        const utterance = new SpeechSynthesisUtterance(text);
        const voice = findVoiceByLang(lang);
        if (voice) {
            utterance.voice = voice;
            utterance.pitch = 1;
            utterance.rate = 1;
            utterance.volume = 1;
            if (voiceOff) {
                utterance.volume = 0;
                utterance.rate = 0;
                utterance.pitch = 0;
            }
            window.speechSynthesis.speak(utterance);
        }
    }

    return {speak, findVoiceByLang};
}