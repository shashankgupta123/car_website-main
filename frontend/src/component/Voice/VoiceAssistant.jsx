import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

const VoiceAssistant = () => {
  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  if (!browserSupportsSpeechRecognition) {
    return <span>Your browser doesn't support speech recognition.</span>;
  }

  const speak = (text) => {
    if (!text) {
      console.log("Speak function called with empty text");
      return;
    }

    console.log("Speaking:", text);
    window.speechSynthesis.cancel(); // Stop any ongoing speech

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => console.log("Speech started");
    utterance.onend = () => console.log("Speech ended");
    utterance.onerror = (err) => console.error("Speech error:", err);

    setTimeout(() => {
      window.speechSynthesis.speak(utterance);
    }, 500); // Added delay for smoother experience
  };

  const processCommand = async (command) => {
    if (!command.trim()) {
      setResponse("Please say something.");
      speak("Please say something.");
      return;
    }

    const username = localStorage.getItem("username") || "User";
    console.log("Processing command:", command);

    try {
      window.speechSynthesis.cancel(); // Stop any previous speech
      setLoading(true);
      const response = await fetch("http://localhost:5000/process-command", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ command, username }),
      });

      const data = await response.json();
      console.log("Response from server:", data);

      const responseText = data.responseText || "I didn't understand that.";
      setResponse(responseText);
      speak(responseText);

      if (data.action === "open" && data.url) {
        window.open(data.url, "_blank");
      } else if (data.action === "navigate" && data.url) {
        navigate(data.url);
      }else if (data.action === "searchCar") {
        // Call a function from Header.jsx to trigger car search
        window.dispatchEvent(new CustomEvent("searchCarEvent", {  detail: data.url.split("=")[1] }));
      }

      if (data.wikipedia) {
        setResponse(data.wikipedia);
        speak(data.wikipedia);
      }
    } catch (error) {
      console.error("Error:", error);
      speak("Sorry, I couldn't process your command.");
    } finally {
      setLoading(false);
    }
  };

  const startListening = () => {
    SpeechRecognition.startListening();
  };

  const stopListening = () => {
    processCommand(transcript);
    SpeechRecognition.stopListening();
    resetTranscript();
  };

  useEffect(() => {
    if (transcript) {
      setResponse("");
    }
  }, [transcript]);

  return (
    <div style={styles.container}>
      <p>Transcript: {transcript}</p>
      <div style={styles.buttonsContainer}>
        <img
          src="https://img.icons8.com/color/48/microphone.png"
          alt="Start Listening"
          onClick={startListening}
          style={styles.imageButton}
        />
        <img
          src="https://img.icons8.com/color/48/stop.png"
          alt="Stop Listening"
          onClick={stopListening}
          style={styles.imageButton}
        />
      </div>
      <button onClick={() => speak("Testing speech synthesis!")}>Test Speech</button>
    </div>
  );
};

const styles = {
  container: {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    backgroundColor: "transparent",
    zIndex: 1000,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  buttonsContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  imageButton: {
    cursor: "pointer",
    margin: "5px",
    width: "48px",
    height: "48px",
  },
};

export default VoiceAssistant;
