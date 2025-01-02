import { Post as PostType } from "@/@types/post";
import { TextInput, TouchableOpacity, View } from "react-native";
import { SizableText } from "tamagui";
import dayjs from "@/config/dayjs";
import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";
import {
  createComment,
  getAndPutComments,
  useComment,
} from "@/config/redux/slices/comment";
import PaginatedList from "../PaginatedList";
import Comment from "../Comment";
import { Button, Overlay } from "@rneui/themed";
import { useState } from "react";
import WriteComment from "./WriteComment";
import CommentModalPost from "./CommentModalPost";

export type CommentModalProps = {
  post: PostType;
  open: boolean;
  onClose: () => void;
};

const CommentModal = (props: CommentModalProps) => {
  const { dispatch, items, isLoading, total_items, total_pages, current_page } =
    useComment();
  const [hightLights, setHightLights] = useState<string[]>([]);
  return (
    <Overlay
      fullScreen={true}
      isVisible={props.open}
      overlayStyle={{ padding: 0 }}
      onBackdropPress={props.onClose}
    >
      <View className="flex flex-col w-full gap-4 mb-3">
        <CommentModalPost {...props.post} onClose={props.onClose} />
        <WriteComment
          post_id={props.post.id}
          onNewComment={(id) => setHightLights((prev) => [...prev, id])}
        />
      </View>

      <PaginatedList
        className="bg-[#fff] gap-1"
        data={items}
        total_items={total_items}
        total_pages={total_pages}
        current_page={current_page}
        per_page={10}
        isLoading={isLoading}
        renderItem={({ item }) => (
          <Comment
            {...item}
            isHighlight={hightLights.includes(item.id.toString())}
          />
        )}
        fetchData={(params) => {
          dispatch(getAndPutComments({ ...params, post_id: props.post.id }));
        }}
      />
    </Overlay>
  );
};

export default CommentModal;
