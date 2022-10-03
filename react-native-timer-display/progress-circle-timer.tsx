import React from 'react';
import { StyleSheet, Text } from 'react-native';

interface IPomodoroTimerState {
	showPomodoroTimer: boolean,
	showSmallBreakTimer: boolean,
	showLongBreakTimer: boolean
}

const ProgressCircleTimerColon = () => {
	return (
		<Text style={ progressCircleTimerStyles.progress__circle__text }>
			:
		</Text>
	);
}

const ProgressCircleTimerHeader = ({
	pomodoroTimerState
}: {
	pomodoroTimerState: IPomodoroTimerState
}) => {
	return (
		<Text style={ progressCircleTimerStyles.progress__circle__header }>
			{ pomodoroTimerState.showPomodoroTimer ? "Pomodoro"
				: pomodoroTimerState.showSmallBreakTimer ? "Small Break"
				: pomodoroTimerState.showLongBreakTimer ? "Long Break"
				: "Lucky Easter Egg!"
			}
		</Text>
	);
}

const progressCircleColonConstant = () => {
	return true;
}

const progressCircleTimerHeadersAreEqual = (
	prevProps: { pomodoroTimerState: IPomodoroTimerState },
	nextProps: { pomodoroTimerState: IPomodoroTimerState }
) => {
	const {
		showPomodoroTimer: prevPomodoroTimer,
		showSmallBreakTimer: prevSmallBreakTimer,
		showLongBreakTimer: prevLongBreakTimer
	} = prevProps.pomodoroTimerState;
	
	const {
		showPomodoroTimer: nextPomodoroTimer,
		showSmallBreakTimer: nextSmallBreakTimer,
		showLongBreakTimer: nextLongBreakTimer
	} = nextProps.pomodoroTimerState;

	return prevPomodoroTimer == nextPomodoroTimer &&
	prevSmallBreakTimer == nextSmallBreakTimer &&
	prevLongBreakTimer == nextLongBreakTimer;
}

const ProgressCircleTimerColonMemo = React.memo(ProgressCircleTimerColon, progressCircleColonConstant);
const ProgressCircleHeaderMemo = React.memo(ProgressCircleTimerHeader, progressCircleTimerHeadersAreEqual);

const progressCircleTimerStyles = StyleSheet.create({
	progress__circle__header: {
		color: "#FFFFFF",
		fontSize: 40,
		fontWeight: "bold"
	},

	progress__circle__text: {
		color: "#FFFFFF",
		fontSize: 25,
		fontWeight: "bold"
	},
});

export {
	ProgressCircleHeaderMemo,
	ProgressCircleTimerColonMemo
};