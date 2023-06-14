export const useSpeechSynthesis = () => {
    
    const findVoiceByLang = (voiceValue: string) => {
       return window.speechSynthesis.getVoices().find(voice => voice.lang.includes(voiceValue));
    }

    const speak = (text: string, lang: string) => {
        const utterance = new SpeechSynthesisUtterance(text);
        const voice = findVoiceByLang(lang);
        if (voice) {
            utterance.voice = voice;
            utterance.pitch = 1;
            utterance.rate = 1;
            utterance.volume = 1;
            window.speechSynthesis.speak(utterance);
        }
    }

    return {speak, findVoiceByLang};
}