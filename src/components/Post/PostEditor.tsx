import React from "react";
import {
  createPost,
  updatePost,
  usePost,
} from "@/config/redux/slices/post";
import { TextInput, View } from "react-native";
import { useEffect, useState } from "react";
import { Avatar, Button, Text } from "@rneui/themed";
import { toastSuccess } from "@/utils/toast";
import { useAuth } from "@/config/redux/slices/auth";
import { Post as PostType } from "@/@types/post";

const PostEditor = ({
  post,
  onNewPost,
  onCancel,
}: {
  post?: PostType;
  onNewPost?: (id: string) => void;
  onCancel?: () => void;
}) => {
  const [comment, setComment] = useState("");
  const [title, setTitle] = useState("");
  const { dispatch } = usePost();
  const { user } = useAuth();
  const editMode = !!post;
  useEffect(() => {
    setTitle(post?.title || "");
    setComment(post?.content || "");
  }, [post]);

  const handleReset = () => {
    setComment("");
    setTitle("");
  };

  const handleCreate = () => {
    dispatch(
      editMode
        ? updatePost(post.id, { title, content: comment })
        : createPost({ content: comment, title, category_id: 1 }, (post) => {
            if (onNewPost) onNewPost(post.id.toString());
            handleReset();
            toastSuccess("Đăng bài viết thành công!");
          })
    );
  };
  return (
    <View className="flex flex-col gap-2 px-3">
      <View className="flex flex-row gap-2 items-center">
        {!editMode && (
          <>
            <Avatar
              rounded
              source={{ uri: user?.avatar_url || "" }}
              size="small"
              containerStyle={{ borderWidth: 1, borderColor: "primary" }}
            />
            <Text style={{ fontSize: 16 }}>Đăng bài viết của bạn...</Text>
          </>
        )}
      </View>
      <View className="flex flex-col  ml-8 gap-2 flex-1">
        <TextInput
          value={title}
          onChangeText={setTitle}
          className="outline-none border-[1px] p-3 rounded-[8px]"
          placeholder="Tiêu đề"
          placeholderTextColor={"#e9e9e9"}
        />
        <TextInput
          multiline={true}
          numberOfLines={5}
          value={comment}
          onChangeText={setComment}
          className="outline-none border-[1px] p-3 h-[80px] flex-1 rounded-[8px]"
          placeholder="Nội dung"
          placeholderTextColor={"#e9e9e9"}
        />
      </View>
      <View className="flex flex-row items-center gap-2 ml-auto">
        <Button
          onPress={onCancel}
          type="clear"
          buttonStyle={{
            borderRadius: 4,
          }}
          titleStyle={{ fontSize: 12 }}
          title={"Huỷ"}
        />
        <Button
          onPress={handleCreate}
          disabled={!comment.length || !title.length}
          buttonStyle={{
            marginLeft: "auto",
            borderRadius: 4,
          }}
          titleStyle={{ fontSize: 12 }}
          title={editMode ? "Cập nhật" : "Đăng"}
        />
      </View>
    </View>
  );
};

export default PostEditor;
