import React from "react";
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { 
	MIN_MAX_SCROLL_PICKER_ITEM_HEIGHT,
	NUMBER_SIZE, 
	SCROLL_PICKER_AREA_MIN_WIDTH, 
	SCROLL_PICKER_COLUMN_MAX_HEIGHT
} from "../../../constants/style-constants";
import { MinutesHeaderMemo, SecondsHeaderMemo } from "./pomodoro-input-constants";
import MinuteInputMemo from "./pomodoro-minute-input";
import SecondInputMemo from "./pomodoro-second-input";

interface IPomodoroInputState {
	pomodoroMinutes: number,
	pomodoroSeconds: number,
	smallBreakMinutes: number,
	smallBreakSeconds: number,
	longBreakMinutes: number,
	longBreakSeconds: number,
	showPomodoro: boolean,
	showSmallBreak: boolean,
	showLongBreak: boolean,
	setPomodoro: (type: string, newMinutes: number) => void,
	setSmallBreak: (type: string, newBreakTime: number) => void,
	setLongBreak: (type: string, newBreakTime: number) => void,
}

const InputColon = () => {
	return (
		<Text style={ pomodoroInputStyle.input__colons }>:</Text>
	);
}
const InputColonMemo = React.memo(InputColon, () => { return true });

/* Window sizes */
const { width: screenWidth, height: screenHeight } = Dimensions.get("screen");

const PomodoroInput = ({ 
	pomodoroMinutes, pomodoroSeconds, setPomodoro,
	smallBreakMinutes, smallBreakSeconds, setSmallBreak,
	longBreakMinutes, longBreakSeconds, setLongBreak,
	showPomodoro, showSmallBreak, showLongBreak
}: IPomodoroInputState) => {

	console.log("Rerendering pomodoro inputs");

	return (
		<View style={ pomodoroInputStyle.input__area }>
			{/* Minutes area */}
			<View style={ pomodoroInputStyle.input__column }>
				<MinutesHeaderMemo/>
				<MinuteInputMemo
					pomodoroMinutes={ pomodoroMinutes }
					smallBreakMinutes={ smallBreakMinutes }
					longBreakMinutes={ longBreakMinutes }
					showPomodoro={ showPomodoro }
					showSmallBreak={ showSmallBreak }
					showLongBreak={ showLongBreak }
					setPomodoro={ setPomodoro }
					setSmallBreak={ setSmallBreak }
					setLongBreak={ setLongBreak }
				/>
			</View>

			{/* Right colon */}
			<InputColonMemo/>

			{/* Seconds area */}
			<View style={ pomodoroInputStyle.input__column }>
				<SecondsHeaderMemo/>
				<SecondInputMemo
					pomodoroSeconds={ pomodoroSeconds }
					smallBreakSeconds={ smallBreakSeconds }
					longBreakSeconds={ longBreakSeconds }
					showPomodoro={ showPomodoro }
					showSmallBreak={ showSmallBreak }
					showLongBreak={ showLongBreak }
					setPomodoro={ setPomodoro }
					setSmallBreak={ setSmallBreak }
					setLongBreak={ setLongBreak }
				/>
			</View>
		</View>
	);
}

const PomodoroInputsAreEqual = (prevProps: IPomodoroInputState, nextProps: IPomodoroInputState) => {
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

const PomodoroInputMemo = React.memo(PomodoroInput, PomodoroInputsAreEqual);

const pomodoroInputStyle = StyleSheet.create({
	input__area: {
		margin: screenWidth * 0.05,
    flexDirection: "row", 
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
		borderColor: "#FFFFFF",
		borderWidth: 2,
		borderRadius: 10
  },

	input__column: {
    maxHeight: SCROLL_PICKER_COLUMN_MAX_HEIGHT,
    minWidth: SCROLL_PICKER_AREA_MIN_WIDTH / (3 / 2),
    justifyContent: "space-between",
    alignItems: "center",
		margin: 10
  },

  input__colons: {
    fontSize: NUMBER_SIZE, 
    color: "#FFFFFF", 
    textAlign: "center", 
    minHeight: MIN_MAX_SCROLL_PICKER_ITEM_HEIGHT 
    // minWidth: MIN_MAX_SCROLL_PICKER_ITEM_HEIGHT / (4 / 3)
  }
});

export default PomodoroInputMemo;