export const processCommand = ({ command, username }) => {
  if (!command || command.trim() === "") {
    return {
      responseText: "Please say something or try again.",
      action: null,
      url: null
    };
  }

  let responseText = "I did not understand what you said, please try again.";
  let action = null;
  let url = null;

  if (command.includes("hey") || command.includes("hello")) {
    responseText = `Hello ${username ? username : "Boss"}`;
  } else if (command.includes("how are you")) {
    responseText = "I am fine boss, tell me how I can help you";
  } else if (command.includes("name")) {
    responseText = "My name is Jarvas";
  } else if (command.includes("open google")) {
    responseText = "Opening Google";
    action = "open";
    url = "https://google.com";
  } else if (command.includes("open instagram")) {
    responseText = "Opening Instagram";
    action = "open";
    url = "https://instagram.com";
  } else if (command.includes("what is") || command.includes("who is") || command.includes("what are")) {
    url = `https://www.google.com/search?q=${command.replace(/ /g, "+")}`;
    responseText = `This is what I found on the internet regarding ${command}`;
    action = "open";
  } else if (command.includes("wikipedia")) {
    url = `https://en.wikipedia.org/wiki/${command.replace("wikipedia", "").trim()}`;
    responseText = `This is what I found on Wikipedia regarding ${command}`;
    action = "open";
  } else if (command.includes("time")) {
    responseText = new Date().toLocaleString(undefined, { hour: "numeric", minute: "numeric" });
  } else if (command.includes("date")) {
    responseText = new Date().toLocaleString(undefined, { month: "short", day: "numeric" });
  } else if (command.includes("calculator")) {
    responseText = "Opening Calculator";
    action = "open";
    url = "Calculator:///";
  } else if (command.includes("Open car")) {
    url = `http://localhost:5173/user-cars`;
    responseText = `Opening car page`;
    action = "open";
  } else {
    url = `https://www.google.com/search?q=${command.replace(/ /g, "+")}`;
    responseText = `I found some information for ${command} on Google`;
    action = "open";
  }

  return { responseText, action, url };
};
