// Need to import react native reanimated in it's entirety to use redash
import 'react-native-reanimated';
import React from 'react';
import { Dimensions, StyleSheet, View, Animated, TextInput, Easing } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import notifee, { EventType } from '@notifee/react-native';
import BackgroundTimer from 'react-native-background-timer';
import { 
	displayOngoingNotification, 
	displayPausedNotification, 
	displayEndNotification, 
	cancelNotification 
} from './timer-notification';
import { 
	ProgressCircleTimerColonMemo,
	ProgressCircleHeaderMemo
} from './progress-circle-timer';
import ProgressCircleRingMemo from './progress-circle-ring';

interface IPomodoroTimerState {
	showPomodoroTimer: boolean,
	showSmallBreakTimer: boolean,
	showLongBreakTimer: boolean
}

interface ProgressCircleState {
	sendTimerToBackground: number, 
	setSendTimerToBackground: (state: number) => void,
	timerPaused: boolean, 
	setTimerPaused: (timerPaused: boolean) => void,
	totalTimePomodoro: number,
	totalTimeSmallBreak: number,
	totalTimeLongBreak: number,
	setProgressWidgetVisible: (progressWidgetVisible: boolean) => void,
	pomodoroTimerState: IPomodoroTimerState,
	setPomodoroTimerState: (state: IPomodoroTimerState) => void,
	pomodoroLongBreakCounter: number
}

const { width: screenWidth, height: screenHeight } = Dimensions.get("screen");

/* Parameters to draw the circle */
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedInput = Animated.createAnimatedComponent(TextInput);
const CIRCLE_RADIUS = 150;
const CIRCLE_CIRCUMFERENCE = CIRCLE_RADIUS * Math.PI * 2;
const CIRCLE_STROKE_WIDTH = 10;
const MAX_PERCENTAGE = 100;

/* Progress Circle Component */
const ProgressCircle = ({ 
	sendTimerToBackground, 
	setSendTimerToBackground,
	timerPaused, 
	setTimerPaused,
	setProgressWidgetVisible,
	totalTimePomodoro,
	totalTimeSmallBreak,
	totalTimeLongBreak,
	pomodoroTimerState,
	setPomodoroTimerState,
	pomodoroLongBreakCounter
}: ProgressCircleState) => {
		
	console.log("progress circle just re-rendered");

	const longBreakCounter = React.useRef<number>(1);
	const currentPomodoroState = React.useRef<string>("Pomodoro");
	const currentPomodoroTime = React.useRef<number>(totalTimePomodoro);

	const animatedCircleRef = React.useRef<any>();
	const animatedMinutesRef = React.useRef<any>();
	const animatedSecondsRef = React.useRef<any>();
	const updatePomodoroStateRef = React.useRef<ReturnType<typeof setTimeout>>();

	const circleDashOffset = React.useRef<Animated.Value>(new Animated.Value(0)).current;
	const circleTimerValue = React.useRef<Animated.Value>(new Animated.Value(totalTimePomodoro)).current;

	const savedMinutes = React.useRef<number>(Math.floor(totalTimePomodoro / 60) % 60);
	const savedSeconds = React.useRef<number>(totalTimePomodoro % 60);

	// Save the time passed to the timer event listeners to update timers on pause/unpaused
	const timeRemaining = React.useRef<number>(totalTimePomodoro);
	const backgroundTimeRemaining = React.useRef<number>(totalTimePomodoro);

	// Save time sent to background for background mode
	const timeSentToBackground = React.useRef<number>(Date.now());

	const startAnimateTimer = (durationInSeconds: number) => {
		return Animated.timing(circleTimerValue, {
			toValue: 0,
			easing: Easing.linear,
			duration: durationInSeconds * 1000,
			useNativeDriver: true
		}).start();
	}

	const startAnimateCircle = (durationInSeconds: number) => {
		return Animated.timing(circleDashOffset, {
			toValue: 100,
			duration: durationInSeconds * 1000,
			easing: Easing.linear,
			useNativeDriver: true
		}).start();
	}

	const addAnimateTimerListener = () => {
		circleTimerValue.addListener((timerValue: { value: number }) => {
			timeRemaining.current = currentPomodoroTime.current - (currentPomodoroTime.current - timerValue.value);

			const currentTimeSeconds = Math.ceil(timerValue.value);
			const getMinutes = Math.floor(currentTimeSeconds / 60) % 60;
			const getSeconds = currentTimeSeconds % 60;

			if(animatedMinutesRef?.current && animatedSecondsRef?.current) {
				animatedMinutesRef.current.setNativeProps({
					text: `${ getMinutes < 10 ? "0" + getMinutes.toString() : getMinutes }`
				});
				animatedSecondsRef.current.setNativeProps({
					text: `${ getSeconds < 10 ? "0" + getSeconds.toString() : getSeconds }`
				});
			}
		});
	}

	const addAnimateCircleListener = () => {
		circleDashOffset.addListener((dashOffset: { value: number }) => {
			if(dashOffset.value == 100) {
				updatePomodoroStateRef.current = setTimeout(updatePomodoroState, 100);
			}

			if(animatedCircleRef?.current) {
				const maxPercent = (100 * dashOffset.value) / MAX_PERCENTAGE;
				const strokeDashoffset = CIRCLE_CIRCUMFERENCE - (CIRCLE_CIRCUMFERENCE * maxPercent) / 100;
				animatedCircleRef.current.setNativeProps({
					strokeDashoffset
				});
			}
		});
	}

	function updatePomodoroState() {
		if(pomodoroTimerState.showPomodoroTimer) {
			longBreakCounter.current += 1;
			if(longBreakCounter.current == pomodoroLongBreakCounter) {
				currentPomodoroState.current = "Long Break";
				currentPomodoroTime.current = totalTimeLongBreak;
				setPomodoroTimerState({
					showPomodoroTimer: false,
					showSmallBreakTimer: false,
					showLongBreakTimer: true
				});
			}
			else {
				currentPomodoroState.current = "Small Break";
				currentPomodoroTime.current = totalTimeSmallBreak;
				setPomodoroTimerState({
					showPomodoroTimer: false,
					showSmallBreakTimer: true,
					showLongBreakTimer: false
				});
			}
		}
		else if(pomodoroTimerState.showSmallBreakTimer) {
			currentPomodoroState.current = "Pomodoro";
			currentPomodoroTime.current = totalTimePomodoro;
			setPomodoroTimerState({
				showPomodoroTimer: true,
				showSmallBreakTimer: false,
				showLongBreakTimer: false
			});
		}
		else if(pomodoroTimerState.showLongBreakTimer) {
			longBreakCounter.current = 0;
			currentPomodoroState.current = "Pomodoro";
			currentPomodoroTime.current = totalTimePomodoro;
			setPomodoroTimerState({
				showPomodoroTimer: true,
				showSmallBreakTimer: false,
				showLongBreakTimer: false
			});
		}
	}

	/**
	 * Starts the background timer to countdown
	 * 
	 * @param startTime - time that the background activity starts
	 */
	function startBackgroundActivity(startTime: number, stateType: string, id: number): void {
		BackgroundTimer.runBackgroundTimer(() => {
			// console.log("running background process", id);

			const totalTimeInSeconds = Math.floor(timeRemaining.current);
			const delta = Math.floor((Date.now() - startTime) / 1000);

			backgroundTimeRemaining.current = totalTimeInSeconds - delta;
			const getMinutes = Math.floor(backgroundTimeRemaining.current / 60) % 60;
			const getSeconds = backgroundTimeRemaining.current % 60;

			displayOngoingNotification(getMinutes, getSeconds, stateType);
		}, 250);
	}

	React.useEffect(() => {
		startAnimateCircle(currentPomodoroTime.current);
		startAnimateTimer(currentPomodoroTime.current);

		return () => {
			circleDashOffset.stopAnimation();
			circleTimerValue.stopAnimation();
			circleDashOffset.setValue(0);
			circleTimerValue.setValue(totalTimePomodoro);
		}
	}, []);

	React.useEffect(() => {
		addAnimateTimerListener();

		return () => {
			circleTimerValue.removeAllListeners();
		}
	}, []);

	React.useEffect(() => {
		addAnimateCircleListener();

		return () => {
			if(updatePomodoroStateRef.current) {
				clearTimeout(updatePomodoroStateRef.current);
			}
			circleDashOffset.removeAllListeners();
		}
	}, [pomodoroTimerState]);

	/**
	 * Use Notifee onBackgroundEvent to listen to notifications, triggers, and events
	 * while the application is in the background
	 */
	React.useEffect(() => {
		notifee.onBackgroundEvent(async ({ type, detail }) => {
			const { notification, pressAction } = detail;

			const totalTimeInSeconds = Math.floor(timeRemaining.current);
			const delta = Math.floor((Date.now() - timeSentToBackground.current) / 1000);

			if(totalTimeInSeconds - delta == 0) {
				BackgroundTimer.stopBackgroundTimer();
				displayEndNotification(0, 0, currentPomodoroState.current);
				updatePomodoroState();
				
				const currentTime = Date.now();
				timeSentToBackground.current = currentTime;
	
				startBackgroundActivity(currentTime, currentPomodoroState.current, Math.random());
			}

			if(type === EventType.ACTION_PRESS && pressAction?.id === 'default') {
				BackgroundTimer.stopBackgroundTimer();
				cancelNotification();
			}
			else if(type === EventType.ACTION_PRESS && pressAction?.id === 'pause') {
				setTimerPaused(true);
				BackgroundTimer.stopBackgroundTimer();
				
				const getMinutes = Math.floor((totalTimeInSeconds - delta) / 60) % 60;
				const getSeconds = (totalTimeInSeconds - delta) % 60;
				displayPausedNotification(getMinutes, getSeconds, currentPomodoroState.current);

				savedMinutes.current = getMinutes;
				savedSeconds.current = getSeconds;
				timeRemaining.current -= delta;
			}
			else if(type === EventType.ACTION_PRESS && pressAction?.id === 'resume') {
				displayOngoingNotification(savedMinutes.current, savedSeconds.current, currentPomodoroState.current);
				setTimerPaused(false);

				const startTime = Date.now();
				timeSentToBackground.current = startTime;
				startBackgroundActivity(startTime, currentPomodoroState.current, Math.random());
			}
			else if(type === EventType.ACTION_PRESS && pressAction?.id === 'cancel') {
				BackgroundTimer.stopBackgroundTimer();
				cancelNotification();

				circleDashOffset.setValue(0);
				circleTimerValue.setValue(totalTimePomodoro);
				setSendTimerToBackground(-1);
				setTimerPaused(false);
				setProgressWidgetVisible(false);
				setPomodoroTimerState({
					showPomodoroTimer: true,
					showSmallBreakTimer: false,
					showLongBreakTimer: false
				});
			}
		});
	}, [savedMinutes, savedSeconds, pomodoroTimerState, currentPomodoroState]);

	/*
	 * For when user puts the app into the background
	 * if a timer is ongoing, timer will be moved to notifications 
	 */
	React.useEffect(() => {
		if(sendTimerToBackground == 0) {
			console.log("Sending timer to fg");
			console.log(sendTimerToBackground);

			BackgroundTimer.stopBackgroundTimer();
			cancelNotification();

			circleDashOffset.setValue(100 * ((backgroundTimeRemaining.current - timeRemaining.current) / timeRemaining.current));
			circleTimerValue.setValue(backgroundTimeRemaining.current);

			if(!timerPaused) {
				startAnimateCircle(backgroundTimeRemaining.current);
				startAnimateTimer(backgroundTimeRemaining.current);
			}
		}
		else if(sendTimerToBackground == 1) {
			console.log("Sending timer to bg");
			console.log(sendTimerToBackground);

			if(updatePomodoroStateRef.current) {
				clearTimeout(updatePomodoroStateRef.current);
			}
			circleDashOffset.stopAnimation();
			circleTimerValue.stopAnimation();

			const currentTime = Date.now();
			timeSentToBackground.current = currentTime;

			if(timerPaused) {
				savedMinutes.current = Math.floor(timeRemaining.current / 60) % 60;
				savedSeconds.current = Math.floor(timeRemaining.current) % 60;
				displayPausedNotification(savedMinutes.current, savedSeconds.current, currentPomodoroState.current);
			}
			else {
				startBackgroundActivity(currentTime, currentPomodoroState.current, Math.random());
			}
		}

		return () => {
			BackgroundTimer.stopBackgroundTimer();
			cancelNotification();
		}
	}, [sendTimerToBackground]);

	/* Pausing or resuming circle progress animation */
	React.useEffect(() => {
		if(!timerPaused) {
			startAnimateCircle(timeRemaining.current);
			startAnimateTimer(timeRemaining.current);
		}
		else {
			// If pomodoro state is about to update, cancel it if user pauses the timer
			if(updatePomodoroStateRef.current) {
				clearTimeout(updatePomodoroStateRef.current);
			}

			circleDashOffset.stopAnimation();
			circleTimerValue.stopAnimation();
		}
	}, [timerPaused]);

	React.useEffect(() => {
		if(pomodoroTimerState.showPomodoroTimer) {
			// If user pauses right when the pomodoro state changes, unpause the timer
			if(timerPaused) {
				setTimerPaused(false);
			}

			circleDashOffset.setValue(0);
			circleTimerValue.setValue(totalTimePomodoro);
			timeRemaining.current = totalTimePomodoro;
			startAnimateCircle(totalTimePomodoro);
			startAnimateTimer(totalTimePomodoro);
		}
		else if(pomodoroTimerState.showSmallBreakTimer) {
			// If user pauses right when the pomodoro state changes, unpause the timer
			if(timerPaused) {
				setTimerPaused(false);
			}

			circleDashOffset.setValue(0);
			circleTimerValue.setValue(totalTimeSmallBreak);
			timeRemaining.current = totalTimeSmallBreak;
			startAnimateCircle(totalTimeSmallBreak);
			startAnimateTimer(totalTimeSmallBreak);
		}
		else if(pomodoroTimerState.showLongBreakTimer) {
			// If user pauses right when the pomodoro state changes, unpause the timer
			if(timerPaused) {
				setTimerPaused(false);
			}

			circleDashOffset.setValue(0);
			circleTimerValue.setValue(totalTimeLongBreak);
			timeRemaining.current = totalTimeLongBreak;
			startAnimateCircle(totalTimeLongBreak);
			startAnimateTimer(totalTimeLongBreak);
		}
	}, [pomodoroTimerState]);

	return (
		<View>
			{/* Timer display within the circle */}
			<View style={ progressCircleStyles.progress__circle__text__area }>
				<ProgressCircleHeaderMemo
					pomodoroTimerState={ pomodoroTimerState }
				/>
				<View style={ progressCircleStyles.progress__circle__timer__area }>
					<AnimatedInput
						ref={ animatedMinutesRef }
						underlineColorAndroid="transparent"
						editable={ false }
						defaultValue="00"
						style={ progressCircleStyles.progress__circle__text }
					/>
					<ProgressCircleTimerColonMemo/>
					<AnimatedInput
						ref={ animatedSecondsRef }
						underlineColorAndroid="transparent"
						editable={ false }
						defaultValue="00"
						style={ progressCircleStyles.progress__circle__text }
					/>
				</View>
			</View>

			{/* SVG circle area */}
			<Svg 
				style={ progressCircleStyles.progress__circle__svg } 
				transform={[
					{ rotateY: `${ CIRCLE_CIRCUMFERENCE - (Math.PI) }` },
					{ rotateZ: `${ CIRCLE_CIRCUMFERENCE - (Math.PI / 2) }` }
				]}
			>
				{/* Outer static circle */}
				<ProgressCircleRingMemo 
					cx={ screenWidth / 2 } 
					cy={ screenHeight / 2 } 
					r={ CIRCLE_RADIUS }
					stroke={ "gray" }
					strokeWidth={ CIRCLE_STROKE_WIDTH }
				/>
				{/* Inner animated circle */}
				<AnimatedCircle
					ref={ animatedCircleRef }
					cx={ screenWidth / 2 }
					cy={ screenHeight / 2 }
					r={ CIRCLE_RADIUS }
					stroke={ "#FFFFFF" }
					strokeWidth={ CIRCLE_STROKE_WIDTH }
					strokeDasharray={ CIRCLE_CIRCUMFERENCE }
					strokeDashoffset={ CIRCLE_CIRCUMFERENCE }
					strokeLinecap="round"
				/>
			</Svg>
		</View>
	);
};

const progressCircleStyles = StyleSheet.create({
	progress__circle__text__area: {
		justifyContent: "center", 
		alignItems: "center", 
		height: screenHeight, 
		width: screenWidth
	},

	progress__circle__timer__area: {
		flexDirection: "row", 
		justifyContent: "center", 
		alignItems: "center"
	},

	progress__circle__svg: {
		position: "absolute", 
		width: screenWidth, 
		height: screenHeight, 
		zIndex: -1
	},

	progress__circle__text: {
		color: "#FFFFFF",
		fontSize: 25,
		fontWeight: "bold"
	},
});

export default ProgressCircle;