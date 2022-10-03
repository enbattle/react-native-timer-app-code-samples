import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { 
  SCROLL_PICKER_AREA_MIN_WIDTH, 
  MIN_MAX_SCROLL_PICKER_ITEM_HEIGHT,
  NUMBER_SIZE
} from '../../../constants/style-constants';

const ScrollPickerSelectArea = () => {
	return (
		<View style={ pickerStyles.scroll__picker__area__view }>
			<Text style={ pickerStyles.scroll__picker__area__select }>
				--
			</Text>
		</View>
	);
}

const ScrollPickerLeftColon = () => {
	return (
		<View style={ pickerStyles.scroll__picker__area__view }>
			<Text style={ pickerStyles.scroll__picker__area__colon__left }>
				:
			</Text>
		</View>
	);
}

const ScrollPickerRightColon = () => {
	return (
		<View style={ pickerStyles.scroll__picker__area__view }>
			<Text style={ pickerStyles.scroll__picker__area__colon__right }>
				:
			</Text>
		</View>
	);
}

const ScrollPickerSelectAreaMemo = React.memo(ScrollPickerSelectArea, () => { return true; });
const ScrollPickerLeftColonMemo = React.memo(ScrollPickerLeftColon, () => { return true; });
const ScrollPickerRightColonMemo = React.memo(ScrollPickerRightColon, () => { return true; });

const pickerStyles = StyleSheet.create({
  scroll__picker__area__view: {
    flexDirection: "row", 
    alignItems: "center",
    marginTop: 30
  },

  scroll__picker__area__select: {
    fontSize: NUMBER_SIZE, 
    color: "gray", 
    backgroundColor: "gray",
    textAlign: "center", 
    position: "absolute", 
    minHeight: MIN_MAX_SCROLL_PICKER_ITEM_HEIGHT, 
    minWidth: MIN_MAX_SCROLL_PICKER_ITEM_HEIGHT - 4,
    width: SCROLL_PICKER_AREA_MIN_WIDTH * 3
  },

  scroll__picker__area__colon__left: {
    fontSize: NUMBER_SIZE, 
    color: "#FFFFFF", 
    textAlign: "center", 
    position: "absolute", 
    marginLeft: (SCROLL_PICKER_AREA_MIN_WIDTH / 3) * 2,
    minHeight: MIN_MAX_SCROLL_PICKER_ITEM_HEIGHT, 
    minWidth: MIN_MAX_SCROLL_PICKER_ITEM_HEIGHT - 4,
  },

  scroll__picker__area__colon__right: {
    fontSize: NUMBER_SIZE, 
    color: "#FFFFFF", 
    textAlign: "center", 
    position: "absolute", 
    marginLeft: (SCROLL_PICKER_AREA_MIN_WIDTH / 3) * 5,
    minHeight: MIN_MAX_SCROLL_PICKER_ITEM_HEIGHT, 
    minWidth: MIN_MAX_SCROLL_PICKER_ITEM_HEIGHT - 4,
  }
});

export { 
	ScrollPickerSelectAreaMemo,
	ScrollPickerLeftColonMemo,
	ScrollPickerRightColonMemo
 };