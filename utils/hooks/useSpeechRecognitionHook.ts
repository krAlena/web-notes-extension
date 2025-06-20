import { useEffect, useRef, useState } from "react";

interface UseSpeechRecognitionReturn {
  text: string;
  finalText: string;
  isListening: boolean;
  startListening: () => void;
  stopListening: () => void;
  hasRecognitionSupport: boolean;
}

const useSpeechRecognition = (): UseSpeechRecognitionReturn => {
  const [isListening, setIsListening] = useState(false);
  const [text, setText] = useState("");
  const [finalText, setFinalText] = useState("");
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const hasRecognitionSupport = typeof window !== "undefined" && "webkitSpeechRecognition" in window;

  useEffect(() => {
    if (!hasRecognitionSupport) return;

    // @ts-ignore
    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.lang = "en-US";
    recognition.interimResults = true;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interimTranscript = "";
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        } else {
          interimTranscript += result[0].transcript;
        }
      }

      setText(interimTranscript);
      setFinalText(finalTranscript);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (event.error === "not-allowed") {
        alert("Microphone access is not allowed. Please grant microphone permissions.");
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
    // Only run once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasRecognitionSupport]);

  useEffect(() => {
    if (!recognitionRef.current) return;

    recognitionRef.current.onresult = (event) => {
      console.log("onresult event:", event);

      let finalTranscript = "";

      for (let i = 0; i < event.results.length; i++) {
        finalTranscript += event.results[i][0].transcript;
      }

      setFinalText(finalTranscript);
    };

    recognitionRef.current.onend = () => {
      // If you want to keep listening even after pause
      if (isListening) recognitionRef?.current?.start();
    };
}, [isListening]);

  const startListening = () => {
    if (!recognitionRef.current) return;
    setText("");
    setFinalText("");
    setIsListening(true);
    recognitionRef.current.start();
  };

  const stopListening = () => {
    if (!recognitionRef.current) return;
    setIsListening(false);
    recognitionRef.current.stop();
  };

  return {
    text,
    finalText,
    isListening,
    startListening,
    stopListening,
    hasRecognitionSupport,
  };
};

export default useSpeechRecognition;