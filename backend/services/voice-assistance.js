import axios from "axios";

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
  let wikipedia = null;

  const normalizedCommand = command.toLowerCase();

  if (normalizedCommand.includes("hey") || normalizedCommand.includes("hello")) {
    responseText = `Hello ${username ? username : "Boss"}`;
  } else if (normalizedCommand.includes("how are you")) {
    responseText = "I am fine boss, tell me how I can help you";
  } else if (normalizedCommand.includes("name")) {
    responseText = "My name is Jarvas";
  } else if (normalizedCommand.includes("open google")) {
    responseText = "Opening Google";
    action = "open";
    url = "https://google.com";
  } else if (normalizedCommand.includes("open instagram")) {
    responseText = "Opening Instagram";
    action = "open";
    url = "https://instagram.com";
  } else if (normalizedCommand.includes("what is") || normalizedCommand.includes("who is") || normalizedCommand.includes("what are")) {
    url = `https://www.google.com/search?q=${command.replace(/ /g, "+")}`;
    responseText = `This is what I found on the internet regarding ${command}`;
    action = "open";
  } else if (normalizedCommand.includes("wikipedia")) {
    const searchTerm = command.replace("wikipedia", "").trim();
    url = `https://en.wikipedia.org/wiki/${searchTerm}`;
    responseText = `This is what I found on Wikipedia regarding ${searchTerm}`;
    action = "open";
  } else if (normalizedCommand.includes("search")) {
    const searchTerm = command.replace("search", "").trim(); 
    console.log("Searching Wikipedia for:", searchTerm); // Log search term

    if (searchTerm) {
        return axios.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${searchTerm}`)
            .then((wikiResponse) => {
                console.log("Wikipedia API Response:", wikiResponse.data); // Log API response
                if (wikiResponse.data.extract) {
                    wikipedia = wikiResponse.data.extract.split(". ").slice(0, 2).join(". ") + ".";
                } else {
                    wikipedia = "I found some information, but I suggest checking Wikipedia for details.";
                }
                return { responseText: wikipedia, action, url, wikipedia };
            })
            .catch((error) => {
                console.error("Wikipedia API error:", error.message);
                return {
                    responseText: `I couldn't find information on Wikipedia for '${searchTerm}'. Try searching on Google instead.`,
                    action: "open",
                    url: `https://www.google.com/search?q=${searchTerm.replace(/ /g, "+")}`
                };
            });
    } else {
        responseText = "Please specify what you want to search for.";
    }
  } else if (normalizedCommand.includes("time")) {
    responseText = new Date().toLocaleString(undefined, { hour: "numeric", minute: "numeric" });
  } else if (normalizedCommand.includes("date")) {
    responseText = new Date().toLocaleString(undefined, { month: "short", day: "numeric" });
  } else if (normalizedCommand.includes("calculator")) {
    responseText = "Opening Calculator";
    action = "open";
    url = "Calculator:///";
  } else if (normalizedCommand.includes("open car page") || normalizedCommand.includes("open car") || normalizedCommand.includes("car page")) {
    responseText = "Opening car page";
    action = "navigate";
    url = "/user-cars"; 
  } else if (normalizedCommand.includes("open home page") || normalizedCommand.includes("open home") || normalizedCommand.includes("home page")) {
    responseText = "Opening home page";
    action = "navigate";
    url = "/";  
  } else if (normalizedCommand.includes("open about page") || normalizedCommand.includes("open about") || normalizedCommand.includes("about page")) {
    responseText = "Opening about page";
    action = "navigate";
    url = "/about";  
  } else if (normalizedCommand.includes("open contact page") || normalizedCommand.includes("open contact") || normalizedCommand.includes("contact page")) {
    responseText = "Opening contact page";
    action = "navigate";
    url = "/contact";  
  } else if (normalizedCommand.includes("open maps page") || normalizedCommand.includes("open maps") || normalizedCommand.includes("maps page")) {
    responseText = "Opening maps page";
    action = "navigate";
    url = "/maps";  
  }

  return { responseText, action, url };
};
