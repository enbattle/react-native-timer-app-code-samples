import React from "react";
import {
  Animated,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
  Dimensions
} from "react-native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { TEXT_SIZE } from '../../../constants/style-constants';
import DraggableActivityListItemMemo from './draggable-activity-list-item';

interface DraggableActivityListState {
  listStartingYPos: number, 
  listStartingHeight: number
}

interface IDraggableActivityListItem {
	id: number,
	activityName: string,
	minutes: number,
	seconds: number,
}

const ACTIVITY_LIST_ITEM = 60;
const { width: screenWidth, height: screenHeight } = Dimensions.get("screen");

const DraggableActivityList = ({ 
  listStartingYPos, 
  listStartingHeight 
}: DraggableActivityListState) => {

  const [data, setData] = React.useState<IDraggableActivityListItem[]>([]);
  const [dragging, setDragging] = React.useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = React.useState<number>(-1);
  const [currentPagePos, setCurrentPagePos] = React.useState<number>(-1);
  const [currentIndexItem, setCurrentIndexItem] = React.useState<IDraggableActivityListItem | null>(null);
  const [listOffset, setListOffset] = React.useState<number>(0);
  const pan = React.useRef<Animated.ValueXY>(new Animated.ValueXY()).current;
  const activityListRef = React.useRef<FlatList<IDraggableActivityListItem> | any>();

  const [scrollUp, setScrollUp] = React.useState<boolean>(false);
  const [scrollDown, setScrollDown] = React.useState<boolean>(false);
  const [scrolling, setScrolling] = React.useState<ReturnType<typeof setInterval>>();

  // console.log("REFRESHING");

  React.useEffect(() => {
    if(scrollUp) {
      if(scrolling) {
        clearInterval(scrolling);
      }

      const scrollInterval = setInterval(() => {
        // const currentTopIndex = Math.floor(listOffset / ACTIVITY_LIST_ITEM);
        activityListRef.current.scrollToOffset({
          offset: ACTIVITY_LIST_ITEM * (Math.floor(listOffset / ACTIVITY_LIST_ITEM) - 1),
          animated: true
        });
        console.log("scrolling up");
      }, 200);
      setScrolling(scrollInterval);
    }
    else if (scrollDown) {
      if(scrolling) {
        clearInterval(scrolling);
      }

      const scrollInterval = setInterval(() => {
        // const currentBottomIndex = Math.floor((activityListHeight.current - activityListYPos.current + listOffset) / ACTIVITY_LIST_ITEM);
        activityListRef.current.scrollToOffset({
          offset: ACTIVITY_LIST_ITEM * (Math.floor(listOffset / ACTIVITY_LIST_ITEM) + 1),
          animated: true
        });
        console.log("scrolling down");
      }, 200);
      setScrolling(scrollInterval);
    }
    else {
      if(scrolling) {
        clearInterval(scrolling);
      }
    }

    return () => {
      if(scrolling) {
        clearInterval(scrolling);
      }
    }
  }, [scrollUp, scrollDown]);

  const AddActivityButton = () => {
    return (
      <TouchableOpacity
        style={ draggableListStyles.activity__list__item__add__button }
        onPress={() => {
          let tempData = [...data];
          let tempItem = {
            id: Math.round(Math.random() * (10 ** 7)),
            activityName: `Preparation ${data.length + 1}`,
            minutes: 0,
            seconds: data.length + 1,
          }
          tempData.push(tempItem);
          setData(tempData);
        }}
      >
        <Ionicons name="add-circle" color={ "gray" } size={ 30 }/>
        <Text style={ draggableListStyles.activity__list__item__add__text }>Add Task</Text>
      </TouchableOpacity>
    );
  }

  const renderListItem = ({ item, index }: {item: IDraggableActivityListItem, index: number}) => (
    <DraggableActivityListItemMemo 
      item={ item } 
      index={ index } 
      data={ data }
      setData={ setData }
      currentIndex={ currentIndex }
      setCurrentIndex={ setCurrentIndex }
      currentIndexItem={ currentIndexItem }
      setCurrentIndexItem={ setCurrentIndexItem }
      currentPagePos={ currentPagePos }
      setCurrentPagePos={ setCurrentPagePos }
      scrollUp={ scrollUp }
      setScrollUp={ setScrollUp }
      scrollDown={ scrollDown }
      setScrollDown={ setScrollDown }
      setDragging={ setDragging }
      pan={ pan }
      activityListYPos={ listStartingYPos }
      activityListHeight={ listStartingYPos + listStartingHeight }
      listOffset={ listOffset }
    />
  );

  return (
    <View style={ draggableListStyles.activity__list__view__picked__area }>
      { dragging &&
        <View style={ draggableListStyles.activity__list__item__center }>
          <Animated.View
            style={[
              draggableListStyles.activity__list__item__picked,
              {
                opacity: 0.5,
                transform: [{ translateY: Animated.subtract(pan.y, listStartingYPos + (ACTIVITY_LIST_ITEM * 0.5)) }]
              }
            ]}
          >
            <View style={ draggableListStyles.activity__list__item }>
              <Text style={ draggableListStyles.activity__list__item__text }>
                { currentIndexItem == null ? "No Preparations" : currentIndexItem.activityName}
              </Text>
              <View style={ draggableListStyles.activity__list__item__scroll__icon__view }>
                <MaterialCommunityIcons name="arrow-up-down-bold" color="white" size={ 33 }/>
              </View>
            </View>
          </Animated.View>
        </View>
      }
      
      <FlatList
        ref={ activityListRef }
        scrollEnabled={ !dragging }
        data={ data }
        keyExtractor={ (item: IDraggableActivityListItem) => item.id.toString() }
        ListFooterComponent={() => (
          <AddActivityButton/>
        )}
        renderItem={ renderListItem }
        onScroll={(event)=> {
          setListOffset(event.nativeEvent.contentOffset.y);
        }}
        decelerationRate="fast"
        scrollEventThrottle={ 16 }
        contentContainerStyle={{ alignItems: 'center', justifyContent: "center", paddingHorizontal: 10 }}
        bounces={ false }
      />
    </View>
  );
};

const draggableActivityListAreEqual = (prevProps: DraggableActivityListState, nextProps: DraggableActivityListState) => {
  const { 
    listStartingYPos: prevStartingYPos,
    listStartingHeight: prevStartingHeight
  } = prevProps;

  const { 
    listStartingYPos: nextStartingYPos,
    listStartingHeight: nextStartingHeight
  } = nextProps;

  return prevStartingYPos === nextStartingYPos && prevStartingHeight === nextStartingHeight;
}

const DraggableActivityListMemo = React.memo(DraggableActivityList, draggableActivityListAreEqual);

const draggableListStyles = StyleSheet.create({
  activity__list__item__center: {
    alignItems: "center",
    justifyContent: "center"
  },

  activity__list__item: {
    flexDirection: "row",
    height: ACTIVITY_LIST_ITEM,
    width: screenWidth * 0.75,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    textAlign: "center",
    alignItems: "center",
  },

  activity__list__item__add__button: {
    height: ACTIVITY_LIST_ITEM,
    width: screenWidth * 0.75,
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    borderWidth: 2,
    borderRadius: 10,
    borderColor: "gray",
    borderStyle: "dashed",
    padding: 10
  },

  activity__list__view__picked__area: {
    height: screenHeight * 0.3,
    width: screenWidth * 0.8,
    margin: 10
  },

  activity__list__item__picked: {
    position: "absolute", 
    zIndex: 2, 
    elevation: 2
  },

  activity__list__item__text: {
    flex: 4,
    fontSize: TEXT_SIZE,
    color: "#FFFFFF",
    padding: 10,
  },

  activity__list__item__add__text: {
    fontSize: TEXT_SIZE,
    color: "gray",
    alignSelf: "center",
    marginLeft: 10
  },

  activity__list__item__scroll__icon__view: {
    flex: 1,
    borderWidth: 2,
    borderRadius: 10,
    borderColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    margin: 5
  },

  add__activity__input__area: {
		flex: 1,
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
		borderWidth: 1,
		borderColor: "#FFFFFF",
		backgroundColor: "#000000"
  },
});

export default DraggableActivityListMemo;