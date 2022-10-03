import React from "react";
import { TextInput, StyleSheet, Dimensions } from 'react-native';
import { NUMBER_SIZE } from "../../../constants/style-constants";

interface ISecondInputState {
	pomodoroSeconds: number,
	smallBreakSeconds: number,
	longBreakSeconds: number,
	showPomodoro: boolean,
	showSmallBreak: boolean,
	showLongBreak: boolean,
	setPomodoro: (type: string, newMinutes: number) => void,
	setSmallBreak: (type: string, newBreakTime: number) => void,
	setLongBreak: (type: string, newBreakTime: number) => void,
}

function setPomodoroInput(newPomodoroValue: string, type: string, setPomodoroFunc: (type: string, newPomodoroValue: number) => void): void {
	const checkNumericValue = parseInt(newPomodoroValue);
	const newNumericValue = Number.isNaN(checkNumericValue) ? 0 : checkNumericValue;
	setPomodoroFunc(type, newNumericValue);
}

/* Window sizes */
const { width: screenWidth, height: screenHeight } = Dimensions.get("screen");

const SecondInput = ({ 
	pomodoroSeconds, setPomodoro,
	smallBreakSeconds, setSmallBreak,
	longBreakSeconds, setLongBreak,
	showPomodoro, showSmallBreak, showLongBreak
}: ISecondInputState) => {

	const [seconds, setSeconds] = React.useState<string>(
		showPomodoro ? (pomodoroSeconds < 10 ? '0' + pomodoroSeconds.toString() : pomodoroSeconds.toString())
		: showSmallBreak ? (smallBreakSeconds < 10 ? '0' + smallBreakSeconds.toString() : smallBreakSeconds.toString())
		: (longBreakSeconds < 10 ? '0' + longBreakSeconds.toString() : longBreakSeconds.toString())
	);

	const checkSeconds = (): void => {
		console.log("CHECKING SECONDS");
		if(seconds === "") {
			setSeconds("00");
		}
		else if(seconds.length === 1) {
			setSeconds(`0${seconds}`);
		} 
	}

	React.useEffect(() => {
		if(showPomodoro) {
			setSeconds(pomodoroSeconds < 10 ? '0' + pomodoroSeconds.toString() : pomodoroSeconds.toString());
		}
		else if(showSmallBreak) {
			setSeconds(smallBreakSeconds < 10 ? '0' + smallBreakSeconds.toString() : smallBreakSeconds.toString());
		}
		else if(showLongBreak) {
			setSeconds(longBreakSeconds < 10 ? '0' + longBreakSeconds.toString() : longBreakSeconds.toString());
		}
	}, [showPomodoro, showSmallBreak, showLongBreak]);

	console.log("Rerendering second input");

	return (
		<TextInput 
			style={ secondInputStyle.input__general } 
			value={ seconds } 
			onChangeText={(input) => {
				const newInput = input.replace(/[^0-9]/g, '');
				if(showPomodoro) {
					setSeconds(newInput);
					setPomodoroInput(newInput, "seconds", setPomodoro);
				}
				else if(showSmallBreak) {
					setSeconds(newInput);
					setPomodoroInput(newInput, "seconds", setSmallBreak);
				}
				else if(showLongBreak) {
					setSeconds(newInput);
					setPomodoroInput(newInput, "seconds", setLongBreak);
				}
			}}
			onEndEditing={() => checkSeconds() }
			// onSubmitEditing={() => checkSeconds() }
			// onSelectionChange={() => checkSeconds() }
			textAlign="center"
			maxLength={ 2 }
			keyboardType="numeric"
			selectTextOnFocus
		/>
	);
}

const SecondInputsAreEqual = (prevProps: ISecondInputState, nextProps: ISecondInputState) => {
	const {
		showPomodoro: prevShowPomodoro,
		showSmallBreak: prevShowSmallBreak,
		showLongBreak: prevShowLongBreak
	} = prevProps;

	const {
		showPomodoro: nextShowPomodoro,
		showSmallBreak: nextShowSmallBreak,
		showLongBreak: nextShowLongBreak
	} = nextProps;

	return prevShowPomodoro == nextShowPomodoro && 
	prevShowSmallBreak == nextShowSmallBreak &&
	prevShowLongBreak == nextShowLongBreak;
}

const SecondInputMemo = React.memo(SecondInput, SecondInputsAreEqual);

const secondInputStyle = StyleSheet.create({
	input__general: {
    color: "#FFFFFF",
    fontSize: NUMBER_SIZE,
		marginHorizontal: 10,
		marginVertical: -10
  }
});

export default SecondInputMemo;