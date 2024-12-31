import { Post as PostType } from "@/@types/post";
import { StyleSheet, View } from "react-native";
import { Avatar, SizableText, Text } from "tamagui";
import dayjs from "@/config/dayjs";
import AvatarSample from "@/assets/icons/avatar.svg";
import { useRef } from "react";
import QuillEditor, { QuillToolbar } from "react-native-cn-quill";

function TestEditor() {
  const _editor = useRef(null);

  return (
    <View className="flex1">
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
    <View className="flex flex-row gap-2">
      <Avatar className="w-4 h-4">
        <AvatarSample className="" />
      </Avatar>
      <View className="flex flex-col gap-1">
        <SizableText size={"$6"}>{props.title}</SizableText>
        <Text>{dayjs(props.created_at).from(dayjs())}</Text>
        <Text>{ props.content}</Text>
      </View>
    </View>
  );
};

export default Post;
