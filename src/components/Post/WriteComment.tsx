import { TextInput, View } from "react-native";
import { createComment, useComment } from "@/config/redux/slices/comment";
import { Button } from "@rneui/themed";
import { useState } from "react";
import { toastSuccess } from "@/utils/toast";

const WriteComment = ({
  post_id,
  onNewComment,
}: {
  post_id: string;
  onNewComment: (id: string) => void;
}) => {
  const [comment, setComment] = useState("");
  const { dispatch } = useComment();

  const handleCreate = () => {
    dispatch(
      createComment({ content: comment, post_id }, (cmt) => {
        onNewComment(cmt.id.toString());
        toastSuccess("Đăng bình luận thành công!");
        setComment("");
      })
    );
  };
  return (
    <View className="flex flex-col gap-2 px-3">
      <View className="flex flex-row gap-2">
        <View className="w-6 h-6 bg-black rounded-full" />
        <TextInput
          multiline={true}
          numberOfLines={5}
          value={comment}
          onChangeText={setComment}
          className="outline-none border-[1px] p-3 h-[40px] flex-1"
        />
      </View>
      <Button
        onPress={handleCreate}
        disabled={!comment.length}
        buttonStyle={{
          marginLeft: "auto",
          borderRadius: 4,
        }}
        titleStyle={{ fontSize: 12 }}
        title={"Đăng"}
      />
    </View>
  );
};

export default WriteComment;
