import notifee, { AndroidColor, AndroidImportance } from '@notifee/react-native';

const displayOngoingNotification = async (timerMinutes: number, timerSeconds: number, stateType: string) => {
	// Create a channel
	const channelId = await notifee.createChannel({
		id: 'timer',
		name: 'Timer',
		importance: AndroidImportance.HIGH
	});

	// Display a notification
	await notifee.displayNotification({
		id: 'timer',
		title: 'Example Exercise',
		body: `${timerMinutes < 10 ? '0' + timerMinutes.toString(): timerMinutes}:${timerSeconds < 10 ? '0' + timerSeconds.toString(): timerSeconds}`,
		subtitle: stateType,
		android: {
			channelId,
			color: AndroidColor.BLACK,
			importance: AndroidImportance.HIGH,
			onlyAlertOnce: true,
			autoCancel: false,
			ongoing: true,
			pressAction: {
				id: 'default',
				launchActivity: 'default'
			},
			actions: [
				{
					title: 'Pause',
					pressAction: {
						id: 'pause'
					}
				},
				{
					title: 'Cancel',
					pressAction: {
						id: 'cancel'
					}
				}
			]
		},
	});
}

const displayEndNotification = async (timerMinutes: number, timerSeconds: number, stateType: string) => {
	// Create a channel
	const channelId = await notifee.createChannel({
		id: 'timer',
		name: 'Timer',
		importance: AndroidImportance.HIGH
	});

	// Display a notification
	await notifee.displayNotification({
		id: 'timer',
		title: 'Example Exercise',
		body: `${timerMinutes < 10 ? '0' + timerMinutes.toString(): timerMinutes}:${timerSeconds < 10 ? '0' + timerSeconds.toString(): timerSeconds}`,
		subtitle: stateType,
		android: {
			channelId,
			color: AndroidColor.BLACK,
			importance: AndroidImportance.HIGH,
			onlyAlertOnce: true,
			autoCancel: false,
			pressAction: {
				id: 'default',
				launchActivity: 'default'
			},
			actions: [
				{
					title: 'Cancel',
					pressAction: {
						id: 'cancel'
					}
				}
			]
		},
	});
}

const displayPausedNotification = async (timerMinutes: number, timerSeconds: number, stateType: string) => {
	// Create a channel
	const channelId = await notifee.createChannel({
		id: 'timer',
		name: 'Timer',
		importance: AndroidImportance.HIGH
	});

	// Display a notification
	await notifee.displayNotification({
		id: 'timer',
		title: 'Example Exercise',
		body: `${timerMinutes < 10 ? '0' + timerMinutes.toString(): timerMinutes}:${timerSeconds < 10 ? '0' + timerSeconds.toString(): timerSeconds}`,
		subtitle: stateType,
		android: {
			channelId,
			color: AndroidColor.BLACK,
			importance: AndroidImportance.HIGH,
			onlyAlertOnce: true,
			autoCancel: false,
			pressAction: {
				id: 'default',
				launchActivity: 'default'
			},
			actions: [
				{
					title: 'Resume',
					pressAction: {
						id: 'resume'
					}
				},
				{
					title: 'Cancel',
					pressAction: {
						id: 'cancel'
					}
				}
			]
		},
	});
}

const cancelNotification = async () => {
	const notifications = await notifee.getDisplayedNotifications();
	if(notifications && notifications.length) {
		const notificationId = notifications[0].id;
		if(notificationId) {
			await notifee.cancelNotification(notificationId);
		}
	}
}

export {
	displayOngoingNotification,
	displayPausedNotification,
	displayEndNotification,
	cancelNotification
};