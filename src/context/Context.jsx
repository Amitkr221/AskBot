import { createContext, useState } from "react";
import main from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPrompts, setPrevPrompts] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");

  const delayPara = (index, nextWord) => {
    setTimeout(function () {
      setResultData((prev) => prev + nextWord);
    }, 75 * index);
  };

  const onSent = async (prompt) => {
    setResultData("");
    setLoading(true);
    setShowResult(true);
    setRecentPrompt(input);
    const response = await main(input);
    let resArr = response.split("**");
    let newRes = "";
    for (let i = 0; i < resArr.length; i++) {
      if (i === 0 || i % 2 !== 1) {
        newRes += resArr[i];
      } else {
        newRes += "<b>" + resArr[i] + "</b>";
      }
    }
    let newRes2 = newRes.split("*").join("</br>");

    let newResArr = newRes2.split(" ");
    for (let i = 0; i < newResArr.length; i++) {
      const nextWord = newResArr[i];
      delayPara(i, nextWord + " ");
    }
    // setResultData(newRes2);
    setLoading(false);
    setInput("");
  };

  //   onSent("what is reactjs");
  const contextValue = {
    prevPrompts,
    setPrevPrompts,
    onSent,
    setRecentPrompt,
    recentPrompt,
    showResult,
    loading,
    resultData,
    input,
    setInput,
  };

  return (
    <Context.Provider value={contextValue}>{props.children}</Context.Provider>
  );
};

export default ContextProvider;
