import * as React from 'react';
import { 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Dimensions, 
  Modal, 
  Pressable 
} from 'react-native';

const popupMenuWidth = 100;
const popupMenuHeight = 75;
const { width: screenWidth, height: screenHeight } = Dimensions.get('screen');

interface PopupMenuState {
  menuPosX: number,
  menuPosY: number,
  showMenu: boolean,
  setShowMenu: (showMenu: boolean) => void
}

const PopupMenu = ({ menuPosX, menuPosY, showMenu, setShowMenu }: PopupMenuState) => {
  return (
    <Modal
      animationType="fade"
      visible={showMenu}
      transparent={true}
      onRequestClose={() => {
        setShowMenu(false);
      }}
    >
      <TouchableOpacity
        style={{
          flex: 1
        }}
        activeOpacity={1}
        onPressOut={() => {
          setShowMenu(false);
        }}
      >
        <Pressable
          style={{
            transform: menuPosY >= screenHeight * 0.75 
            ? [
              { translateX: menuPosX - popupMenuWidth },
              { translateY: menuPosY - popupMenuHeight}
            ]
            : [
              { translateX: menuPosX - popupMenuWidth },
              { translateY: menuPosY }
            ],
            padding: 10,
            borderWidth: 1,
            borderRadius: 10,
            borderColor: "black",
            backgroundColor: "lightgreen",
            width: popupMenuWidth,
            height: popupMenuHeight,
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <TouchableOpacity
            onPress={() => {
              setShowMenu(false);
            }}
          >
            <Text style={{ textAlign: "center" }}>Choice 1</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setShowMenu(false);
            }}
          >
            <Text style={{ textAlign: "center" }}>Choice 2</Text>
          </TouchableOpacity>
        </Pressable>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   justifyContent: 'center',
  //   paddingTop: Constants.statusBarHeight,
  //   backgroundColor: '#ecf0f1',
  //   padding: 8,
  // },
  // paragraph: {
  //   margin: 24,
  //   fontSize: 18,
  //   fontWeight: 'bold',
  //   textAlign: 'center',
  // },
});

export default PopupMenu;
