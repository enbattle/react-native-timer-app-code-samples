import React from "react";
import { Dimensions, View, StyleSheet } from 'react-native';
import { 
	SCROLL_PICKER_COLUMN_MAX_HEIGHT, 
	SCROLL_PICKER_AREA_MIN_WIDTH
} from "../../constants/style-constants";
import PomodoroInputMemo from "./inputs/pomodoro-input";
import PomodoroTimerButtonsMemo from "./pomodoro-input-header";

/* Window sizes */
const { width: screenWidth, height: screenHeight } = Dimensions.get("screen");

interface IPomodoroAreaState {
	pomodoroMinutes: number,
	pomodoroSeconds: number,
	smallBreakMinutes: number,
	smallBreakSeconds: number,
	longBreakMinutes: number,
	longBreakSeconds: number,
	showPomodoro: boolean,
	showSmallBreak: boolean,
	showLongBreak: boolean,
	setPomodoroInputVisible: (inputType: string) => void,
	setPomodoro: (type: string, newMinutes: number) => void,
	setSmallBreak: (type: string, newBreakMinutes: number) => void,
	setLongBreak: (type: string, newBreakMinutes: number) => void
}

const PomodoroArea = ({
	pomodoroMinutes, pomodoroSeconds, setPomodoro,
	smallBreakMinutes, smallBreakSeconds, setSmallBreak,
	longBreakMinutes, longBreakSeconds, setLongBreak,
	showPomodoro, showSmallBreak, showLongBreak, setPomodoroInputVisible
}: IPomodoroAreaState) => {

	console.log("Pomodoro Timer input rerendering");
	
  return (
		<View>
			<View style={ PomodoroAreaStyles.input__area__inputs }>

				<View style={ PomodoroAreaStyles.input__column }>
					<PomodoroTimerButtonsMemo
						showPomodoro={ showPomodoro }
						showSmallBreak={showSmallBreak }
						showLongBreak={ showLongBreak }
						setPomodoroInputVisible={ setPomodoroInputVisible }
					/>
					<PomodoroInputMemo
						pomodoroMinutes={ pomodoroMinutes }
						pomodoroSeconds={ pomodoroSeconds }
						smallBreakMinutes={ smallBreakMinutes }
						smallBreakSeconds={ smallBreakSeconds }
						longBreakMinutes={ longBreakMinutes }
						longBreakSeconds={ longBreakSeconds }
						showPomodoro={ showPomodoro }
						showSmallBreak={showSmallBreak }
						showLongBreak={ showLongBreak }
						setPomodoro={ setPomodoro }
						setSmallBreak={ setSmallBreak }
						setLongBreak={ setLongBreak }
					/>
				</View>
			</View>
		</View>
  );
};

const PomodoroAreasAreEqual = (prevProps: IPomodoroAreaState, nextProps: IPomodoroAreaState) => {
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

const PomodoroAreaMemo = React.memo(PomodoroArea, PomodoroAreasAreEqual);

const PomodoroAreaStyles = StyleSheet.create({
	input__column: {
    maxHeight: SCROLL_PICKER_COLUMN_MAX_HEIGHT,
    minWidth: SCROLL_PICKER_AREA_MIN_WIDTH / (3 / 2),
    justifyContent: "space-between",
    alignItems: "center",
		margin: 10
  },

  input__area__inputs: {
		margin: screenWidth * 0.05,
    flexDirection: "row", 
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
		borderRadius: 10,
		backgroundColor: "#2F2F2E"
  }
});

export default PomodoroAreaMemo;