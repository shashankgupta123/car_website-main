import React, { useEffect, useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const VoiceAssistant = () => {
  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();
  const [response, setResponse] = useState("");

  if (!browserSupportsSpeechRecognition) {
    return <span>Your browser doesn't support speech recognition.</span>;
  }

  const processCommand = async (command) => {
    if (!command.trim()) {
      setResponse("Please say something.");
      return;
    }
    const username = localStorage.getItem('username');
    console.log('Processing command:', command);
    try {
      const response = await fetch("http://localhost:5000/process-command", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ command, username }),
      });
      const data = await response.json();

      setResponse(data.response);
      speak(data.response);

      if (data.action === "open" && data.url) {
        window.open(data.url, "_blank");
      }
    } catch (error) {
      console.error("Error:", error);
      speak("Sorry, I couldn't process your command.");
    }
  };

  const speak = (text) => {
    const speech = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(speech);
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
    </div>
  );
};

const styles = {
  container: {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    backgroundColor: "transparent", // No background
    zIndex: 1000,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column", // Stack buttons vertically
  },
  buttonsContainer: {
    display: "flex", // To display buttons horizontally
    flexDirection: "row", // Align images in a row
    alignItems: "center", // Center them vertically
  },
  imageButton: {
    cursor: "pointer", // Indicates it's clickable
    margin: "5px", // Space between buttons
    width: "48px", // Adjust image size
    height: "48px", // Adjust image size
  },
};

export default VoiceAssistant;
