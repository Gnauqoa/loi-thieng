import { Post as PostType } from "@/@types/post";
import { TouchableOpacity, View } from "react-native";
import { Avatar, SizableText, Text } from "tamagui";
import dayjs from "@/config/dayjs";
import AvatarSample from "@/assets/icons/avatar.svg";
import MenuIcon from "@/assets/icons/menu.svg";
import Dialog from "react-native-dialog";
import { getAndPutComments, useComment } from "@/config/redux/slices/comment";
import PaginatedList from "../PaginatedList";
import Comment from "../Comment";

export type CommentModalProps = {
  post: PostType;
  open: boolean;
  onClose: () => void;
};

const CommentModalPost = (props: PostType) => {
  const { title, user, content, created_at } = props;
  return (
    <View
      className={`flex flex-col gap-2 py-3 px-4 border-b-[#f1f1ef] border-b-[1px]`}
    >
      <View className="flex flex-row items-center gap-2">
        <View className="w-6 h-6 bg-black rounded-full" />
        <View className="flex flex-col flex-1">
          <View className="flex flex-row items-center">
            <SizableText size={"$3"}>
              {user.first_name} {user.last_name}
            </SizableText>
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
  return (
    <Dialog.Container
      contentStyle={{
        padding: 0,
      }}
      headerStyle={{
        margin: 0,
        padding: 0,
      }}
      footerStyle={{
        padding: 0,
      }}
      visible={props.open}
      onBackdropPress={props.onClose}
    >
      <View className="flex flex-col w-full gap-4 ">
        <View className="flex flex-row items-center flex-1"></View>
        <CommentModalPost {...props.post} />
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
    </Dialog.Container>
  );
};

export default CommentModal;
