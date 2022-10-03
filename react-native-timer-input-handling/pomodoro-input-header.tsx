import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface IPomodoroState {
	showPomodoro: boolean,
	setPomodoroInputVisible: (inputType: string) => void
}

interface ISmallBreakState {
	showSmallBreak: boolean,
	setPomodoroInputVisible: (inputType: string) => void
}

interface ILongBreakState {
	showLongBreak: boolean,
	setPomodoroInputVisible: (inputType: string) => void
}

interface IPomodoroTimerState {
	showPomodoro: boolean,
	showSmallBreak: boolean,
	showLongBreak: boolean,
	setPomodoroInputVisible: (inputType: string) => void
}

const PomodoroButton = ({ showPomodoro, setPomodoroInputVisible }: IPomodoroState) => {
	console.log("Rerendering pomodoro button");
	return (
		<TouchableOpacity 
			style={ 
				showPomodoro ? [pomodoroTimerConstantStyles.pomodoro__button__selected, pomodoroTimerConstantStyles.pomodoro__button] 
				: pomodoroTimerConstantStyles.pomodoro__button 
			}
			onPress={() => {
				setPomodoroInputVisible("pomodoro");
			}}
		>
			<Text style={ pomodoroTimerConstantStyles.pomodoro__text }>
				Pomodoro
			</Text>
		</TouchableOpacity>
	);
}

const SmallBreakButton = ({ showSmallBreak, setPomodoroInputVisible }: ISmallBreakState) => {
	console.log("Rerendering small break button");
	return (
		<TouchableOpacity 
			style={ 
				showSmallBreak ? [pomodoroTimerConstantStyles.pomodoro__button__selected, pomodoroTimerConstantStyles.pomodoro__button] 
				: pomodoroTimerConstantStyles.pomodoro__button 
			}
			onPress={() => {
				setPomodoroInputVisible("smallBreak");
			}}
		>
			<Text style={ pomodoroTimerConstantStyles.pomodoro__text }>
				Small Break
			</Text>
		</TouchableOpacity>
	);
}

const LongBreakButton = ({ showLongBreak, setPomodoroInputVisible }: ILongBreakState) => {
	console.log("Rerendering long break button");
	return (
		<TouchableOpacity 
			style={ 
				showLongBreak ? [pomodoroTimerConstantStyles.pomodoro__button__selected, pomodoroTimerConstantStyles.pomodoro__button] 
				: pomodoroTimerConstantStyles.pomodoro__button 
			}
			onPress={() => {
				setPomodoroInputVisible("longBreak");
			}}
		>
			<Text style={ pomodoroTimerConstantStyles.pomodoro__text }>
				Long Break
			</Text>
		</TouchableOpacity>
	);
}

const PomodoroButtonsAreEqual = (prevProps: IPomodoroState, nextProps: IPomodoroState) => {
	const { showPomodoro: prevPomodoro } = prevProps;
	const { showPomodoro: nextPomodoro } = nextProps;
	return prevPomodoro == nextPomodoro;
}
const SmallBreakButtonsAreEqual = (prevProps: ISmallBreakState, nextProps: ISmallBreakState) => {
	const { showSmallBreak: prevSmallBreak } = prevProps;
	const { showSmallBreak: nextSmallBreak } = nextProps;
	return prevSmallBreak == nextSmallBreak;
}
const LongBreakButtonsAreEqual = (prevProps: ILongBreakState, nextProps: ILongBreakState) => {
	const { showLongBreak: prevLongBreak } = prevProps;
	const { showLongBreak: nextLongBreak } = nextProps;
	return prevLongBreak == nextLongBreak;
}

const PomodoroButtonMemo = React.memo(PomodoroButton, PomodoroButtonsAreEqual);
const SmallBreakButtonMemo = React.memo(SmallBreakButton, SmallBreakButtonsAreEqual);
const LongBreakButtonMemo = React.memo(LongBreakButton, LongBreakButtonsAreEqual);

const PomodoroTimerButtons = ({
	showPomodoro,
	showSmallBreak,
	showLongBreak,
	setPomodoroInputVisible
}: IPomodoroTimerState) => {
	return (
		<View style={ pomodoroTimerConstantStyles.pomodoro__view }>
			<PomodoroButtonMemo
				showPomodoro={ showPomodoro }
				setPomodoroInputVisible={ setPomodoroInputVisible }
			/>
			<SmallBreakButtonMemo
				showSmallBreak={showSmallBreak}
				setPomodoroInputVisible={setPomodoroInputVisible}
			/>
			<LongBreakButtonMemo
				showLongBreak={showLongBreak}
				setPomodoroInputVisible={setPomodoroInputVisible}
			/>
		</View>
	);
}

const PomodoroTimerButtonsAreEqual = (prevProps: IPomodoroTimerState, nextProps: IPomodoroTimerState) => {
	const {
		showPomodoro: prevPomodoro,
		showSmallBreak: prevSmallBreak,
		showLongBreak: prevLongBreak
	} = prevProps;

	const {
		showPomodoro: nextPomodoro,
		showSmallBreak: nextSmallBreak,
		showLongBreak: nextLongBreak
	} = nextProps;

	return prevPomodoro == nextPomodoro && 
	prevSmallBreak == nextSmallBreak && 
	prevLongBreak == nextLongBreak;
}

const PomodoroTimerButtonsMemo = React.memo(PomodoroTimerButtons, PomodoroTimerButtonsAreEqual);

const pomodoroTimerConstantStyles = StyleSheet.create({
	pomodoro__view: {
		flexDirection: "row"
	},

	pomodoro__button: {
		margin: 10
	},

	pomodoro__button__selected: {
		backgroundColor: "gray",
		borderRadius: 7
	},

	pomodoro__text: {
		margin: 5,
    fontWeight: "bold",
    color: "#FFFFFF"
	}
});

export default PomodoroTimerButtonsMemo;