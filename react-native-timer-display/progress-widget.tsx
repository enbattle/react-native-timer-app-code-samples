import React from 'react';
import { AppState, View, StyleSheet, Modal, TouchableOpacity, Text, Alert, AppStateStatus } from 'react-native';
import ProgressCircle from './progress-circle';
import { TEXT_SIZE } from '../../constants/style-constants';
// import { Audio } from 'expo-av';

interface ProgressWidgetState {
	progressWidgetVisible: boolean, 
	setProgressWidgetVisible: (progressWidgetVisible: boolean) => void,
	totalTimePomodoro: number,
	totalTimeSmallBreak: number,
	totalTimeLongBreak: number
}

interface IPomodoroTimerState {
	showPomodoroTimer: boolean,
	showSmallBreakTimer: boolean,
	showLongBreakTimer: boolean
}

/* Progress Widget Component */
const ProgressWidget = ({ 
	progressWidgetVisible,
	setProgressWidgetVisible,
	totalTimePomodoro,
	totalTimeSmallBreak,
	totalTimeLongBreak
}: ProgressWidgetState) => {

	// const [sound, setSound] = React.useState<Audio.Sound>();
	const [timerPaused, setTimerPaused] = React.useState<boolean>(false);
	const [pomodoroTimerState, setPomodoroTimerState] = React.useState<IPomodoroTimerState>({
		showPomodoroTimer: true,
		showSmallBreakTimer: false,
		showLongBreakTimer: false
	});
	const [pomodoroLongBreakCounter, setPomodoroLongBreakCounter] = React.useState<number>(4);
	const appState = React.useRef<AppStateStatus>(AppState.currentState);

	// Three states for the app for the timer
	// -1: app just initialized
	// 0: app is returning to the foreground
	// 1: app is going into the background
	const [sendTimerToBackground, setSendTimerToBackground] = React.useState<number>(-1);

	console.log("Progress widget re-rendering");

	// async function createPlaySound() {
	// 	console.log("Loading Sound");

	// 	await Audio.setAudioModeAsync({
	// 		// interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS,
	// 		shouldDuckAndroid: true,
	// 		staysActiveInBackground: true,
	// 		// playThroughEarpieceAndroid: true
	// 	});

	// 	const { sound } = await Audio.Sound.createAsync(
	// 		require('../../assets/game-win-sound.wav')
	// 	);
	// 	setSound(sound);

	// 	console.log("Playing sound");
	// 	await sound.setIsLoopingAsync(true);
	// 	await sound.playAsync();
	// }

	// React.useEffect(() => {
	// 	if(timerFinished) {
	// 		createPlaySound();
	// 	}

	// 	return sound
	// 		? () => {
	// 				console.log('Unloading Sound');
	// 				sound.unloadAsync(); }
	// 		: undefined;
	// }, [timerFinished]);

  React.useEffect(() => {
    const subscription = AppState.addEventListener("change", nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
				// console.log("AppState before change:", appState.current);
        // console.log("App has come to the foreground!");
				setSendTimerToBackground(0);
      }
			else if(appState.current.match(/active/) &&
			nextAppState === "active") {
				// console.log("AppState before change:", appState.current);
				// console.log("App is initializing");
				setSendTimerToBackground(-1);
			}
			else {
				// console.log("AppState before change:", appState.current);
				// console.log("App is going to the background");
				setSendTimerToBackground(1);
			}

      appState.current = nextAppState;
      // console.log("AppState after change", appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, []);

	return (
		<Modal
			animationType="fade" 
			visible={ progressWidgetVisible }
			onRequestClose={() => {
				Alert.alert("Closing progress circle.");
			}}
		>
			<View style={ progressWidgetStyles.progress__area }>
				<View style={ progressWidgetStyles.progress__widget }>
					{/* Progress circle area */}
					<ProgressCircle
						sendTimerToBackground={ sendTimerToBackground }
						setSendTimerToBackground={ setSendTimerToBackground }
						timerPaused={ timerPaused }
						setTimerPaused={ setTimerPaused }
						setProgressWidgetVisible={ setProgressWidgetVisible }
						totalTimePomodoro={ totalTimePomodoro }
						totalTimeSmallBreak={ totalTimeSmallBreak }
						totalTimeLongBreak={ totalTimeLongBreak }
						pomodoroTimerState={ pomodoroTimerState }
						setPomodoroTimerState={ setPomodoroTimerState }
						pomodoroLongBreakCounter={ pomodoroLongBreakCounter }
					/>
				</View>
				
				<View style={ progressWidgetStyles.progress__buttons }>
					{/* Pause/Resume/Restart button */}
					<TouchableOpacity
						style={ 
							timerPaused ? progressWidgetStyles.progress__buttons__resume
							: progressWidgetStyles.progress__buttons__pause 
						}
						onPress={
							timerPaused ? () => setTimerPaused(false)
							: () => setTimerPaused(true)
						}
					>
						<Text style={ progressWidgetStyles.progress__widget__text }>
							{ timerPaused ? "Resume" : "Pause" }
						</Text>
					</TouchableOpacity>

					{/* Cancel button */}
					<TouchableOpacity
						style={ progressWidgetStyles.progress__buttons__stop }
						onPress={() => {
							// if(sound) {
							// 	sound.unloadAsync(); 
							// }
							setSendTimerToBackground(-1);
							setTimerPaused(false);
							setProgressWidgetVisible(false);
							setPomodoroTimerState({
								showPomodoroTimer: true,
								showSmallBreakTimer: false,
								showLongBreakTimer: false
							});
						}}
					>
						<Text style={ progressWidgetStyles.progress__widget__text }>
							Cancel
						</Text>
					</TouchableOpacity>
				</View>
			</View>
		</Modal>
	);
};

const progressWidgetAreEqual = (prevProps: ProgressWidgetState, nextProps: ProgressWidgetState) => {
	const { progressWidgetVisible: prevWidgetVisible } = prevProps;
	const { progressWidgetVisible: nextWidgetVisible } = nextProps;

	return prevWidgetVisible == nextWidgetVisible;
}

const ProgressWidgetModal = React.memo(ProgressWidget, progressWidgetAreEqual);

const progressWidgetStyles = StyleSheet.create({
	progress__area: {
		flex: 1,
		backgroundColor: "#000000",
	},

	progress__widget: {
		flex: 5,
		textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
		backgroundColor: "#000000",
	},

	progress__buttons: {
		flex: 1,
		flexDirection: "row",
		textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
		backgroundColor: "#000000",
	},

	progress__buttons__restart: {
		borderWidth: 1,
    borderRadius: 100,
    paddingVertical: 10,
    paddingHorizontal: 30,
    backgroundColor: "green",
		marginRight: 20
	},

	progress__buttons__pause: {
    borderWidth: 1,
    borderRadius: 100,
    paddingVertical: 10,
    paddingHorizontal: 30,
    backgroundColor: "#8B0000",
		marginRight: 20
  },

	progress__buttons__resume: {
    borderWidth: 1,
    borderRadius: 100,
    paddingVertical: 10,
    paddingHorizontal: 30,
    backgroundColor: "orange",
		marginRight: 20
  },

	progress__buttons__stop: {
    borderWidth: 1,
    borderRadius: 100,
    paddingVertical: 10,
    paddingHorizontal: 30,
    backgroundColor: "gray",
		marginLeft: 20
  },

	progress__widget__text: {
		color: "#FFFFFF",
		fontSize: TEXT_SIZE,
		fontWeight: "bold"
	}
});

export default ProgressWidgetModal;