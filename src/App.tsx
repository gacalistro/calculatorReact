import { useEffect, useState } from "react";
import clsx from "clsx";
import { Equals } from "phosphor-react";

import "./styles/main.css";

import { Button } from "./components/Button";

export function App() {
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState(0);

  const [firstValue, setFirstValue] = useState<number | string>("");
  const [secondValue, setSecondValue] = useState<number | string>("");
  const [operator, setOperator] = useState("");

  const buttonValues = [
    ["CE", "C", "%", "/"],
    [7, 8, 9, "x"],
    [4, 5, 6, "-"],
    [1, 2, 3, "+"],
    ["negative", 0, ",", "="],
  ];

  const operationsRegex = /\+|\-|\/|x/;

  function action(value: string | number) {
    const lastElement = expression.slice(-1);
    const isLastElementAnOperator = operationsRegex.test(lastElement);

    if (typeof value === "number") {
      return addNumber(value);
    }

    if (operationsRegex.test(value) && (firstValue !== "" || result !== 0)) {
      if (isLastElementAnOperator) {
        if (lastElement !== value) {
          clearLastElement();
        } else {
          return;
        }
      }

      addOperator(value);
    }

    switch (value) {
      case "CE": {
        if (isLastElementAnOperator) {
          setOperator("");
        }
        clearLastElement();
        break;
      }
      case "C": {
        clearAll();
        break;
      }
      case "%": {
        percent();
        break;
      }
      case "=": {
        equals();
        break;
      }
      case ",": {
        addDecimal();
        break;
      }
      case "negative": {
        invertValue();
        break;
      }
    }
  }

  function calculateExpression() {
    if (operator === "/" && secondValue === 0) {
      return 0;
    }

    return Math.round(eval(expression.trim().replace("x", "*")) * 100) / 100;
  }

  function addNumber(value: number) {
    if (result !== 0 && firstValue === "") {
      setResult(0);
    }

    const lastElement = expression.at(-1);
    const zeroAfterOperator =
      operationsRegex.test(expression.slice(-2, -1)) && lastElement === "0";

    if (lastElement === "0" && value === 0) {
      return;
    }

    if (!expression || zeroAfterOperator) {
      clearLastElement();
    }

    !operator
      ? setFirstValue((prevState) =>
          !prevState ? value : Number(`${prevState}${value}`)
        )
      : setSecondValue((prevState) =>
          !prevState ? value : Number(`${prevState}${value}`)
        );
  }

  function addOperator(value: string) {
    if (firstValue === ".") {
      setFirstValue(0);
    }

    if (operator && secondValue) {
      setFirstValue(calculateExpression());
      setSecondValue("");
      setResult(calculateExpression());
    }

    setOperator(value);

    if (result !== 0 && !firstValue) {
      setFirstValue(result);
    }
  }

  function clearAll() {
    setFirstValue("");
    setSecondValue("");
    setOperator("");
    setResult(0);
  }

  function clearLastElement() {
    const negativeNumber =
      expression.trim().length === 2 && expression.at(0) === "-";

    if (!secondValue) {
      setOperator("");
    }

    if (operator) {
      setSecondValue((prevState) =>
        prevState.toString().length > 1
          ? Number(prevState.toString().slice(0, -1))
          : ""
      );
    } else {
      setFirstValue((prevState) =>
        prevState.toString().length > 1
          ? Number(prevState.toString().slice(0, -1))
          : ""
      );
    }

    if (expression.trim().length - 1 === 0 || negativeNumber) {
      setResult(0);
      setFirstValue("");
    }
  }

  function equals() {
    if (secondValue === "") {
      setResult(0);
    } else {
      setResult(calculateExpression());
    }

    setOperator("");
    setFirstValue("");
    setSecondValue("");
  }

  function invertValue() {
    if (!firstValue && result) {
      setFirstValue(result * -1);
      setResult(0);
      return;
    }

    if (!operator) {
      if (firstValue === 0 || firstValue === "") {
        return;
      }

      setFirstValue((prevState) => +prevState * -1);
    } else {
      if (secondValue === 0 || secondValue === "") {
        return;
      }

      setSecondValue((prevState) => +prevState * -1);
    }
  }

  function percent() {
    if (secondValue === "") {
      return;
    }
    setSecondValue((+firstValue * +secondValue) / 100);
  }

  function addDecimal() {
    if (secondValue === "") {
      if (!firstValue.toString().includes(".")) {
        setFirstValue((prevState) => `${prevState}.`);
      }
    } else {
      if (!secondValue.toString().includes(".")) {
        setSecondValue((prevState) => `${prevState}.`);
      }
    }
  }

  useEffect(() => {
    setExpression(
      `${firstValue !== "" ? firstValue : ""} ${operator} ${
        operator ? secondValue : ""
      }`
    );
  }, [firstValue, operator, secondValue]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-purple-900/5">
      <div className="pt-10 p-8 bg-gray-900 text-gray-100 rounded-3xl shadow-2xl shadow-black/50 border-4 border-gray-500/5">
        <div className="h-7 pl-4 pr-5 text-end text-xl text-gray-500">
          {expression}
        </div>

        <div className="mt-2 pl-4 pr-5 flex items-center justify-between">
          <Equals size={20} color="#6B6B6B" />
          <div className="flex-1 text-end text-4xl leading-tight">{result}</div>
        </div>

        <div className="mt-6 grid grid-cols-4 gap-3">
          {buttonValues.flat().map((value, i) => (
            <Button
              key={i}
              value={value}
              onClick={() => action(value)}
              className={clsx(
                "w-16 h-16 bg-gradient-to-b from-gray-900 to-gray-500/10 border-2 border-gray-500/5 rounded-full shadow-md shadow-black/40 text-2xl flex items-center justify-center",
                {
                  ["from-purple-900 to-purple-500/30 border-purple-500/5"]:
                    operationsRegex.test(value.toString()),
                  ["from-purple-500 to-purple-400/50 border-purple-500/5 bg-origin-border"]:
                    value === "=",
                  ["text-purple-500"]: value === "CE",
                }
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
