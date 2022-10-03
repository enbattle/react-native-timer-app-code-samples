import React from "react";
import { Text, StyleSheet } from 'react-native';
import { TEXT_SIZE } from "../../../constants/style-constants";

const MinutesHeader = () => {
	return (
		<Text style={ headerStyles.header__text }>Minutes</Text>
	);
}

const SecondsHeader = () => {
	return (
		<Text style={ headerStyles.header__text }>Seconds</Text>
	);
}

const MinutesHeaderMemo = React.memo(MinutesHeader, () => { return true });
const SecondsHeaderMemo = React.memo(SecondsHeader, () => { return true });

const headerStyles = StyleSheet.create({
	header__text: {
		color: "#FFFFFF",
		fontSize: TEXT_SIZE / (3 / 2)
	}
});

export {
	MinutesHeaderMemo,
	SecondsHeaderMemo
};