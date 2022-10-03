import React, { MutableRefObject } from 'react';
import { StyleSheet, Text, TouchableOpacity, FlatList } from 'react-native';
import { 
  MIN_MAX_SCROLL_PICKER_ITEM_HEIGHT, 
  NUMBER_SIZE 
} from '../../../constants/style-constants';

interface ScrollPickerItemState {
  item: { key: string, value: string },
  index: number,
  onTimerValueChange: (timeValue: number) => void,
  scrollPickerListRef: MutableRefObject<FlatList<{key: string, value: string}> | any>,
  handleCustomTimerInputs: (time: number, timeType: string) => void, 
  timerType: string
}

/* 
  Scroll picker item that will be rendered for the scroll picker list
*/
const ScrollPickerItem = ({ 
  item,
  index,
  onTimerValueChange,
  scrollPickerListRef,
  handleCustomTimerInputs, 
  timerType
}: ScrollPickerItemState) => {

	console.log("item rerenderings", index);

  return (
    <TouchableOpacity
      onPress={() => {
        onTimerValueChange(index);
        scrollPickerListRef.current.scrollToIndex({ 
          index: index, 
          viewPosition: 0.5, 
          animated: true 
        });
        handleCustomTimerInputs(index, timerType);
      }}
      style={ itemStyles.scroll__picker__area__list__item }
    >
      <Text style={ itemStyles.scroll__picker__area__list__item__number }>
        { item.value }
      </Text>
    </TouchableOpacity>
  );
}

/* 
  Check if props have changed for the scroll picker item
  If changed, re-render
*/
const scrollPickerItemsAreEqual = (prevProps: ScrollPickerItemState, nextProps: ScrollPickerItemState) => {
  return true;
}

/* 
  Memoized object for rendering scroll picker items
*/
const ScrollPickerItemMemo = React.memo(ScrollPickerItem, scrollPickerItemsAreEqual);

const itemStyles = StyleSheet.create({
  scroll__picker__area__list__item: {
    justifyContent: 'center', 
    alignItems: 'center',
    minHeight: MIN_MAX_SCROLL_PICKER_ITEM_HEIGHT
  },

  scroll__picker__area__list__item__number: {
    color: "#FFFFFF",
    fontSize: NUMBER_SIZE
  }
});

export { ScrollPickerItemMemo };