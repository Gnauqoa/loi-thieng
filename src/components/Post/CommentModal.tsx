import { Post as PostType } from "@/@types/post";
import { TextInput, TouchableOpacity, View } from "react-native";
import { SizableText } from "tamagui";
import dayjs from "@/config/dayjs";
import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";
import { getAndPutComments, useComment } from "@/config/redux/slices/comment";
import PaginatedList from "../PaginatedList";
import Comment from "../Comment";
import { Button, Overlay } from "react-native-elements";
import { useState } from "react";

export type CommentModalProps = {
  post: PostType;
  open: boolean;
  onClose: () => void;
};

const CommentModalPost = (props: PostType & { onClose: () => void }) => {
  const { title, user, content, created_at } = props;
  return (
    <View
      className={`flex flex-col gap-2 py-3 px-4 border-b-[#f1f1ef] border-b-[1px] relative`}
    >
      <View className="flex flex-row items-center gap-2">
        <View className="w-6 h-6 bg-black rounded-full" />
        <View className="flex flex-col flex-1">
          <View className="flex flex-row items-center gap-3">
            <SizableText size={"$3"}>
              {user.first_name} {user.last_name}
            </SizableText>
            <TouchableOpacity className="ml-auto">
              <Entypo name="dots-three-horizontal" size={20} color="black" />
            </TouchableOpacity>
            <TouchableOpacity onPress={props.onClose}>
              <Feather name="x" size={20} color="black" />
            </TouchableOpacity>
          </View>
          <SizableText size={"$1"}>
            {dayjs(created_at).from(dayjs())}
          </SizableText>
        </View>
      </View>
      <SizableText size={"$6"}>{title}</SizableText>

      <SizableText size={"$2"}>{content}</SizableText>
    </View>
  );
};

const CommentModal = (props: CommentModalProps) => {
  const { dispatch, items, isLoading, total_items, total_pages, current_page } =
    useComment();

  const [comment, setComment] = useState("");
  return (
    <Overlay
      fullScreen={true}
      isVisible={props.open}
      onBackdropPress={props.onClose}
    >
      <View className="flex flex-col w-full gap-4">
        <CommentModalPost {...props.post} onClose={props.onClose} />
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
            disabled={!comment.length}
            buttonStyle={{
              marginLeft: "auto",
              borderRadius: 4,
            }}
            titleStyle={{ fontSize: 12 }}
            title={"Đăng"}
          />
        </View>
      </View>

      <PaginatedList
        className="bg-[#fff]"
        data={items}
        total_items={total_items}
        total_pages={total_pages}
        current_page={current_page}
        per_page={10}
        isLoading={isLoading}
        renderItem={({ item }) => <Comment {...item} />}
        fetchData={(params) => {
          dispatch(getAndPutComments({ ...params, post_id: props.post.id }));
        }}
      />
    </Overlay>
  );
};

export default CommentModal;
