import React from "react";
import { TextInput, StyleSheet, Dimensions } from 'react-native';
import { 	NUMBER_SIZE } from "../../../constants/style-constants";

interface IMinuteInputState {
	pomodoroMinutes: number,
	smallBreakMinutes: number,
	longBreakMinutes: number,
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

const MinuteInput = ({ 
	pomodoroMinutes, setPomodoro,
	smallBreakMinutes, setSmallBreak,
	longBreakMinutes, setLongBreak,
	showPomodoro, showSmallBreak, showLongBreak
}: IMinuteInputState) => {

	const [minutes, setMinutes] = React.useState<string>(
		showPomodoro ? (pomodoroMinutes < 10 ? '0' + pomodoroMinutes.toString() : pomodoroMinutes.toString())
		: showSmallBreak ? (smallBreakMinutes < 10 ? '0' + smallBreakMinutes.toString() : smallBreakMinutes.toString())
		: (longBreakMinutes < 10 ? '0' + longBreakMinutes.toString() : longBreakMinutes.toString())
	);

	const checkMinutes = (): void => {
		console.log("CHECKING MINUTES");
		if(minutes === "") {
			setMinutes("00");
		}
		else if(minutes.length === 1) {
			setMinutes(`0${minutes}`);
		} 
	}

	React.useEffect(() => {
		if(showPomodoro) {
			setMinutes(pomodoroMinutes < 10 ? '0' + pomodoroMinutes.toString() : pomodoroMinutes.toString());
		}
		else if(showSmallBreak) {
			setMinutes(smallBreakMinutes < 10 ? '0' + smallBreakMinutes.toString() : smallBreakMinutes.toString());
		}
		else if(showLongBreak) {
			setMinutes(longBreakMinutes < 10 ? '0' + longBreakMinutes.toString() : longBreakMinutes.toString());
		}
	}, [showPomodoro, showSmallBreak, showLongBreak]);

	console.log("Rerendering minute input");

	return (
		<TextInput 
			style={ minuteInputStyle.input__general } 
			value={ minutes } 
			onChangeText={(input) => {
				const newInput = input.replace(/[^0-9]/g, '');
				if(showPomodoro) {
					setMinutes(newInput);
					setPomodoroInput(newInput, "minutes", setPomodoro);
				}
				else if(showSmallBreak) {
					setMinutes(newInput);
					setPomodoroInput(newInput, "minutes", setSmallBreak);
				}
				else if(showLongBreak) {
					setMinutes(newInput);
					setPomodoroInput(newInput, "minutes", setLongBreak);
				}
			}}
			onEndEditing={() => checkMinutes() }
			// onSubmitEditing={() => checkMinutes() }
			// onSelectionChange={() => checkMinutes() }
			textAlign="center"
			maxLength={ 2 }
			keyboardType="numeric"
			selectTextOnFocus
		/>
	);
}

const MinuteInputsAreEqual = (prevProps: IMinuteInputState, nextProps: IMinuteInputState) => {
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

const MinuteInputMemo = React.memo(MinuteInput, MinuteInputsAreEqual);

const minuteInputStyle = StyleSheet.create({
	input__general: {
    color: "#FFFFFF",
    fontSize: NUMBER_SIZE,
		marginHorizontal: 10,
		marginVertical: -10
  }
});

export default MinuteInputMemo;