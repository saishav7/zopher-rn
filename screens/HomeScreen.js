import React from "react";
import {
  Image,
  Platform,
  ScrollView,
  Dimensions,
  StyleSheet,
  TextInput,
  View,
  Alert,
  TouchableOpacity
} from "react-native";
import { WebBrowser } from "expo";

import { MonoText } from "../components/StyledText";
import Auth from "@aws-amplify/auth";
// Imports from native-base
import { Form, Item, Button, Text, Card, Icon } from "native-base";
// Amplify api imports
import API, { graphqlOperation } from "@aws-amplify/api";
import {
  createPost,
  listPosts,
  deletePost,
  createLike,
  deleteLike
} from "../graphql";
import styles from "../styles";

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null
  };

  state = {
    postContent: "",
    postOwnerId: "",
    postOwnerUsername: "",
    posts: [],
    likeOwnerUsername: "",
    likeOwnerId: "",
    numberLikes: 0
  };

  componentDidMount = async () => {
    await Auth.currentAuthenticatedUser()
      .then(user => {
        this.setState({
          postOwnerUsername: user.username,
          postOwnerId: user.attributes.sub,
          likeOwnerUsername: user.username,
          likeOwnerId: user.attributes.sub
        });
      })
      .catch(err => console.log(err));
    this.listPosts();
  };

  onChangeText = (key, val) => {
    this.setState({ [key]: val });
  };

  createPost = async () => {
    const post = this.state;
    if (post.postContent === "") {
      console.log("Write something!");
      return;
    }
    try {
      await API.graphql(graphqlOperation(createPost, post));
      await this.componentDidMount();
      console.log("Post successfully created.", post);
    } catch (err) {
      console.log("Error creating post.", err);
    }
  };

  listPosts = async () => {
    try {
      const graphqldata = await API.graphql(graphqlOperation(listPosts));
      this.setState({
        posts: graphqldata.data.listPosts.items,
        // reset the input field to empty after post creation
        postContent: ""
      });
    } catch (err) {
      console.log("error: ", err);
    }
  };

  deletePostAlert = async post => {
    await Alert.alert(
      "Delete Post",
      "Are you sure you want to delete this post",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Deletion canceled"),
          style: "cancel"
        },
        { text: "OK", onPress: () => this.confirmDeletePost(post) }
      ],
      { cancelable: false }
    );
  };

  confirmDeletePost = async post => {
    const postId = await post["id"];
    try {
      await API.graphql(graphqlOperation(deletePost, { id: postId }));
      await this.componentDidMount();
      console.log("Post successfully deleted");
    } catch {
      console.log("Error deleting post", err);
    }
  };

  toggleLikePost = async post => {
    const loggedInUser = await this.state.postOwnerId;
    // Get the like instance of the logged in user
    const likeUserObject = await post.likes.items.filter(
      obj => obj.likeOwnerId === loggedInUser
    );
    // If there is a like instance fire a delete action
    if (likeUserObject.length !== 0) {
      await this.deleteLike(likeUserObject);
      return;
    }
    // Otherwise create a like instance
    await this.createLike(post);
  };

  createLike = async post => {
    const postId = await post["id"];
    this.setState({ numberLikes: 1 });
    const like = {
      likeOwnerId: this.state.likeOwnerId,
      numberLikes: this.state.numberLikes,
      likeOwnerUsername: this.state.likeOwnerUsername,
      id: postId
    };
    try {
      await API.graphql(graphqlOperation(createLike, like));
      console.log("Like successfully created.", like);
      await this.componentDidMount();
    } catch (err) {
      console.log("Error creating like.", err);
    }
  };

  deleteLike = async likeUserObject => {
    const likeId = await likeUserObject[0]["id"];
    try {
      await API.graphql(graphqlOperation(deleteLike, { id: likeId }));
      console.log("Like successfully deleted.");
      await this.componentDidMount();
    } catch (err) {
      console.log("Error deleting like.", err);
    }
  };

  render() {
    let loggedInUser = this.state.postOwnerId;
    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
        >
          <Text style={styles.getStartedText}>Press button to add post</Text>
          <View style={styles.headerStyle}>
            <Form style={{ padding: 13 }}>
              <Item>
                <TextInput
                  onChangeText={val => this.onChangeText("postContent", val)}
                  placeholder="Type here ..."
                  value={this.state.postContent}
                  style={{ fontSize: 22, padding: 13 }}
                />
              </Item>
            </Form>
            <View style={{ flexDirection: "row" }}>
              <Button style={styles.buttonStyle} onPress={this.createPost}>
                <Text>Add Post</Text>
              </Button>
            </View>

            <ScrollView contentContainerStyle={styles.container}>
              <View style={{ flex: 1, alignItems: "center" }}>
                {this.state.posts.map((post, index) => (
                  <Card key={index} style={styles.cardStyle}>
                    <Text style={styles.postBody}>{post.postContent}</Text>
                    <Text style={styles.postUsername}>
                      {post.postOwnerUsername}
                    </Text>
                    <View style={styles.cardFooterStyle}>
                      {/* Logged in user liked this post */}
                      {post.likes.items.length !== 0 &&
                        post.likes.items.filter(
                          obj => obj.likeOwnerId === loggedInUser
                        ).length === 1 && (
                          <View
                            style={{
                              flex: 1,
                              justifyContent: "center",
                              alignItems: "center"
                            }}
                          >
                            <TouchableOpacity
                              onPress={() => this.toggleLikePost(post)}
                            >
                              <Icon
                                name="md-heart"
                                style={{ fontSize: 55, color: "#fb7777" }}
                              />
                            </TouchableOpacity>
                          </View>
                        )}
                      {/* Logged in user did not like this post */}
                      {post.likes.items.length !== 0 &&
                        post.likes.items.filter(
                          obj => obj.likeOwnerId === loggedInUser
                        ).length === 0 && (
                          <View
                            style={{
                              flex: 1,
                              justifyContent: "center",
                              alignItems: "center"
                            }}
                          >
                            <TouchableOpacity
                              onPress={() => this.toggleLikePost(post)}
                            >
                              <Icon
                                name="md-heart"
                                style={{ fontSize: 55, color: "#69ff" }}
                              />
                            </TouchableOpacity>
                          </View>
                        )}
                      {/* Post has no likes yet */}
                      {post.likes.items.length === 0 && (
                        <View
                          style={{
                            flex: 1,
                            justifyContent: "center",
                            alignItems: "center"
                          }}
                        >
                          <TouchableOpacity
                            onPress={() => this.toggleLikePost(post)}
                          >
                            <Icon
                              name="md-heart"
                              style={{ fontSize: 55, color: "#69ff" }}
                            />
                          </TouchableOpacity>
                        </View>
                      )}
                      {/* Check if the logged in user is the post owner */}
                      {post.postOwnerId === loggedInUser && (
                        <Icon
                          name="ios-trash"
                          onPress={() => this.deletePostAlert(post)}
                        />
                      )}
                    </View>
                  </Card>
                ))}
              </View>
            </ScrollView>
          </View>
        </ScrollView>

        <View style={styles.tabBarInfoContainer}>
          <Text style={styles.tabBarInfoText}>
            This is a tab bar. You can edit it in:
          </Text>

          <View
            style={[styles.codeHighlightContainer, styles.navigationFilename]}
          >
            <MonoText style={styles.codeHighlightText}>
              navigation/MainTabNavigator.js
            </MonoText>
          </View>
        </View>
      </View>
    );
  }

  _maybeRenderDevelopmentModeWarning() {
    if (__DEV__) {
      const learnMoreButton = (
        <Text onPress={this._handleLearnMorePress} style={styles.helpLinkText}>
          Learn more
        </Text>
      );

      return (
        <Text style={styles.developmentModeText}>
          Development mode is enabled, your app will be slower but you can use
          useful development tools. {learnMoreButton}
        </Text>
      );
    } else {
      return (
        <Text style={styles.developmentModeText}>
          You are not in development mode, your app will run at full speed.
        </Text>
      );
    }
  }
}
