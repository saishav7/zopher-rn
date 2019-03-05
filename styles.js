import {
  Image,
  Platform,
  ScrollView,
  Dimensions,
  StyleSheet,
  TextInput,
  View
} from "react-native";

// Get the width of the device
let { width } = Dimensions.get("window");

let styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  developmentModeText: {
    marginBottom: 20,
    color: "rgba(0,0,0,0.4)",
    fontSize: 14,
    lineHeight: 19,
    textAlign: "center"
  },
  contentContainer: {
    paddingTop: 30
  },
  welcomeContainer: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: "contain",
    marginTop: 3,
    marginLeft: -10
  },
  getStartedContainer: {
    alignItems: "center",
    marginHorizontal: 50
  },
  homeScreenFilename: {
    marginVertical: 7
  },
  codeHighlightText: {
    color: "rgba(96,100,109, 0.8)"
  },
  codeHighlightContainer: {
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 3,
    paddingHorizontal: 4
  },
  getStartedText: {
    fontSize: 17,
    color: "rgba(96,100,109, 1)",
    lineHeight: 24,
    textAlign: "center"
  },
  tabBarInfoContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: "black",
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3
      },
      android: {
        elevation: 20
      }
    }),
    alignItems: "center",
    backgroundColor: "#fbfbfb",
    paddingVertical: 20
  },
  tabBarInfoText: {
    fontSize: 17,
    color: "rgba(96,100,109, 1)",
    textAlign: "center"
  },
  navigationFilename: {
    marginTop: 5
  },
  helpContainer: {
    marginTop: 15,
    alignItems: "center"
  },
  helpLink: {
    paddingVertical: 15
  },
  helpLinkText: {
    fontSize: 14,
    color: "#2e78b7"
  },
  headerStyle: {
    alignItems: "center",
    justifyContent: "center",
    padding: 13,
    borderBottomWidth: 2,
    borderBottomColor: "#3354fd"
  },
  postUsername: {
    fontSize: 18,
    color: "#3354fd"
  },
  postBody: {
    fontSize: 24,
    color: "#1986f9"
  },
  buttonStyle: {
    marginLeft: 21,
    marginRight: 21,
    padding: 22
  },
  cardStyle: {
    backgroundColor: "#ffdddddd",
    borderBottomWidth: 5,
    borderBottomColor: "#3354fd",
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    width: width * 0.95,
    marginTop: 10
  },
  cardFooterStyle: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end"
  }
});

export default styles;
