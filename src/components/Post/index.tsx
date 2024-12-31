import { Post as PostType } from "@/@types/post";
import { Pressable, StyleSheet, TouchableOpacity, View } from "react-native";
import { Avatar, SizableText, Text } from "tamagui";
import dayjs from "@/config/dayjs";
import AvatarSample from "@/assets/icons/avatar.svg";
import { useRef } from "react";
import QuillEditor, { QuillToolbar } from "react-native-cn-quill";
import HeartIcon from "@/assets/icons/heart.svg";
import HeartFillIcon from "@/assets/icons/heart-fill.svg";
import CommentIcon from "@/assets/icons/comment.svg";
import MenuIcon from "@/assets/icons/menu.svg";
function TestEditor() {
  const _editor = useRef(null);

  return (
    <View className="flex-1">
      <QuillEditor
        style={styles.editor}
        ref={_editor}
        initialHtml="<h1>Quill Editor for react-native</h1>"
      />
      <QuillToolbar editor={_editor} options="full" theme="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontWeight: "bold",
    alignSelf: "center",
    paddingVertical: 10,
  },

  editor: {
    flex: 1,
    padding: 0,
    borderColor: "gray",
    borderWidth: 1,
    marginHorizontal: 30,
    marginVertical: 5,
    backgroundColor: "white",
  },
});

const Post = (props: PostType) => {
  return (
    <View className="flex flex-col gap-2 py-2 px-4 border-b-[#f1f1ef] border-b-[1px]">
      <View className="flex flex-row">
        <Avatar className="w-3 h-3">
          <AvatarSample style={{ width: 24, height: 24 }} className="w-3 h-3" />
        </Avatar>
        <View className="flex flex-col gap-1 flex-1">
          <View className="flex flex-row items-center">
            <SizableText size={"$6"}>{props.title}</SizableText>
            <TouchableOpacity className="ml-auto">
              <MenuIcon
                fill={"#000"}
                style={{
                  width: 20,
                  height: 20,
                }}
              />
            </TouchableOpacity>
          </View>
          <Text>{dayjs(props.created_at).from(dayjs())}</Text>
        </View>
      </View>
      <Text>{props.content}</Text>

      <View className="flex flex-row gap-12 items-center">
        <TouchableOpacity>
          {props.is_liked ? (
            <HeartFillIcon style={{ width: 20, height: 20 }} />
          ) : (
            <HeartIcon fill={"#000"} style={{ width: 20, height: 20 }} />
          )}
        </TouchableOpacity>
        <TouchableOpacity>
          <CommentIcon style={{ width: 20, height: 20 }} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Post;
